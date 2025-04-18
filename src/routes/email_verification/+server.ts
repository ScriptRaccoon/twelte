import { error, redirect } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { query } from '$lib/db'

export const GET: RequestHandler = async (event) => {
	const token = event.url.searchParams.get('token')
	if (!token) error(400, 'Invalid Token')

	const token_sql = `
    SELECT
        id as token_id,
        user_id
    FROM
        tokens
    WHERE
        token = :token
        AND purpose = 'email_verification'
        AND expires_at > datetime('now')
    `

	const { rows, err } = await query<{ token_id: number; user_id: number }>(token_sql, { token })

	if (err) {
		error(500, 'Internal Server Error')
	}

	if (!rows.length) {
		error(400, 'Invalid Token')
	}

	const { token_id, user_id } = rows[0]

	const delete_token_sql = 'DELETE FROM tokens where id = :token_id'
	await query(delete_token_sql, { token_id })

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
