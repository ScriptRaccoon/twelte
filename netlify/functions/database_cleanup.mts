import { createClient } from '@libsql/client'
import { Config } from '@netlify/functions'

const DB_URL = Netlify.env.get('DB_URL')
const DB_AUTH_TOKEN = Netlify.env.get('DB_AUTH_TOKEN')

if (!DB_URL || !DB_AUTH_TOKEN) {
	throw new Error('DB_URL and DB_AUTH_TOKEN must be set in the environment variables')
}

const db = createClient({
	url: DB_URL,
	authToken: DB_AUTH_TOKEN
})

/**
 * Netlify function to clean the database.
 */
export default async () => {
	try {
		await enable_foreign_keys()
	} catch (err) {
		console.error('Failed to enable foreign keys', err)
		return new Response('Failed to enable foreign keys', { status: 500 })
	}

	const errors: string[] = []

	try {
		await clean_inactive_users()
	} catch (err) {
		errors.push('Failed to clean inactive users')
		console.error(err)
	}

	try {
		await clean_expired_tokens()
	} catch (err) {
		errors.push('Failed to clean expired tokens')
		console.error(err)
	}

	if (errors.length > 0) {
		console.error('Errors occurred during cleanup:', errors)
		return new Response('Failed to clean database', { status: 500 })
	}

	return new Response('Database cleaned successfully', { status: 200 })
}

/**
 * Configure this function to run daily.
 */
export const config: Config = {
	schedule: '@daily'
}

/**
 * Enables foreign key constraints in the database.
 */
async function enable_foreign_keys() {
	await db.execute('PRAGMA foreign_keys = ON;')
}

/**
 * Clean users that have registered in the last 30 days and have never logged in.
 */
async function clean_inactive_users() {
	const sql_inactive_users = `
	DELETE FROM users
	WHERE last_login IS NULL
	AND created_at <= datetime('now', '-30 days');`

	const { rowsAffected } = await db.execute(sql_inactive_users)
	console.info(`${rowsAffected} inactive users cleaned up successfully`)
}

/**
 * Clean expired tokens.
 */
async function clean_expired_tokens() {
	const sql_tokens = `
	DELETE FROM tokens
	WHERE expires_at <= datetime('now');`

	const { rowsAffected } = await db.execute(sql_tokens)
	console.info(`${rowsAffected} expired tokens cleaned up successfully`)
}
