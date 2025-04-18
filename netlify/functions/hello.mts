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

export default async (req: Request, context: Context) => {
	const { rows } = await db.execute('SELECT handle FROM users')
	if (!rows) {
		return new Response('No users found', { status: 404 })
	}
	return new Response(JSON.stringify(rows))
}
