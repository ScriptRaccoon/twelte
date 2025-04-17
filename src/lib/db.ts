import { createClient, type LibsqlError } from '@libsql/client'

const db = createClient({
	url: 'file:database/twelte.db'
})

/**
 * Small wrapper around the `db.execute` function from `@libsql/client` to handle errors.
 */
export async function query<T = any>(
	sql: string,
	params?: Record<string, any>
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
		const { rows } = params ? await db.execute(sql, params) : await db.execute(sql)
		return { rows: rows as T[], success: true, err: null }
	} catch (err) {
		// This will always be a LibsqlError
		const libsql_error = err as LibsqlError
		console.error(libsql_error.message)
		return { rows: null, err: libsql_error, success: false }
	}
}

/**
 * Small wrapper around the `db.batch` function from `@libsql/client` to handle errors.
 */
export async function query_batched(
	queries: {
		sql: string
		args?: Record<string, any>
	}[]
) {
	try {
		await db.batch(queries)
		return { success: true, err: null }
	} catch (err) {
		// This will always be a LibsqlError
		const libsql_error = err as LibsqlError
		console.error(libsql_error.message)
		return { success: false, err: libsql_error }
	}
}
