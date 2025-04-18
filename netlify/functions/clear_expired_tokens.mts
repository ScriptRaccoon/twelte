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

async function enableForeignKeys() {
	try {
		await db.execute('PRAGMA foreign_keys = ON;')
		return { success: true }
	} catch (err) {
		console.error('Error enabling foreign keys:', err)
		return { success: false }
	}
}

export default async () => {
	const { success } = await enableForeignKeys()
	if (!success) return

	const sql = `
    DELETE FROM tokens
    WHERE expires_at <= datetime('now');
    `
	try {
		const { rowsAffected } = await db.execute(sql)
		console.info(`${rowsAffected} expired tokens have been cleared successfully`)
		return new Response('Expired tokens cleared successfully')
	} catch (err) {
		console.error('Error clearing expired tokens', err)
		return new Response('Error clearing expired tokens', { status: 500 })
	}
}

// export const config: Config = {
// 	schedule: '@daily'
// }
