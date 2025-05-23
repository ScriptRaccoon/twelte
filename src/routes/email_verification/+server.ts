import { error, redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { query } from '$lib/server/db'

/**
 * Handles the email verification process.
 * It reads the token from the URL, checks if it's valid,
 * deletes the token from the database, and updates the
 * user's email verification status.
 */
export const GET: RequestHandler = async (event) => {
	const token = event.url.searchParams.get('token')
	if (!token) error(400, 'Invalid Token')

	const token_sql = `
    SELECT
        user_id
    FROM
        tokens
    WHERE
        id = :token
        AND purpose = 'email_verification'
        AND expires_at > datetime('now')
    `

	const { rows, err } = await query<{ user_id: number }>(token_sql, { token })

	if (err) {
		error(500, 'Internal Server Error')
	}

	if (!rows.length) {
		error(400, 'Invalid Token')
	}

	const { user_id } = rows[0]

	const delete_token_sql = 'DELETE FROM tokens where id = :token'

	await query(delete_token_sql, { token })

	const user_verify_sql = `
    UPDATE
		users
    SET
		email_verified_at = datetime('now')
    WHERE
		id = :user_id
    `

	const { err: err_user } = await query(user_verify_sql, { user_id })

	if (err_user) {
		error(500, 'Internal Server Error')
	}

	return redirect(303, '/account/login?code=email_verified')
}
