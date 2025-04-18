import type { Context } from '@netlify/functions'
import { createClient } from '@libsql/client'

const DB_URL = Netlify.env.get('DB_URL')
const DB_AUTH_TOKEN = Netlify.env.get('DB_AUTH_TOKEN')

if (!DB_URL || !DB_AUTH_TOKEN) {
	throw new Error('DB_URL and DB_AUTH_TOKEN must be set in the environment variables')
}

const db = createClient({
	url: DB_URL,
	authToken: DB_AUTH_TOKEN
})

export default async () => {
	const sql = `
	DELETE FROM users
	WHERE last_login IS NULL
	AND created_at <= DATETIME('now', '-7 days');
	`
	try {
		const { rowsAffected } = await db.execute(sql)
		console.info(`Inactive users (${rowsAffected}) cleaned up successfully`)
		return new Response('Inactive users cleaned up successfully')
	} catch (err) {
		console.error('Error cleaning up inactive users:', err)
		return new Response('Error cleaning up inactive users', { status: 500 })
	}
}
