import { DB_AUTH_TOKEN, DB_URL } from '$env/static/private'
import { createClient, type LibsqlError } from '@libsql/client'

export const db = createClient({
	url: DB_URL,
	authToken: DB_AUTH_TOKEN
})

async function adjust_database() {
	try {
		await db.execute('PRAGMA foreign_keys = ON')
	} catch (err) {
		const libsql_error = err as LibsqlError
		console.error(libsql_error.message)
	}
}

adjust_database()

/**
 * Small wrapper around the `db.execute` function from `@libsql/client` to handle errors.
 */
export async function query<T = any>(
	sql: string,
	args?: Record<string, any> | any[],
	log = false
): Promise<
	| {
			rows: T[]
			success: true
			err: null
	  }
	| {
			rows: null
			success: false
			err: LibsqlError
	  }
> {
	try {
		const res = args ? await db.execute(sql, args) : await db.execute(sql)
		if (log) console.debug(res)
		return { rows: res.rows as T[], success: true, err: null }
	} catch (err) {
		const libsql_error = err as LibsqlError
		console.error(libsql_error)
		return { rows: null, err: libsql_error, success: false }
	}
}
