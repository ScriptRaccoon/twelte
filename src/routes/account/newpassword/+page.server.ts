import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { query } from '$lib/server/db'
import { password_schema } from '$lib/server/schemas'
import { get_error_msg } from '$lib/utils'
import bcrypt from 'bcryptjs'

export const load: PageServerLoad = async (event) => {
	const token = event.url.searchParams.get('token')
	if (!token) error(400, 'Token is required')

	const sql_token = `
    SELECT
        id
    FROM
        tokens
    WHERE
        id = ?
        AND purpose = 'password_reset'
        AND expires_at > datetime('now')
    `

	const { rows, success } = await query<{ id: string }>(sql_token, [token])
	if (!success) error(500, 'Database error')

	if (!rows.length) error(400, 'Invalid token')
}

export const actions: Actions = {
	default: async (event) => {
		const form_data = await event.request.formData()
		const password = form_data.get('password') as string | null
		const confirm_password = form_data.get('confirm_password') as string | null

		const token = event.url.searchParams.get('token')
		if (!token) return fail(400, { error: 'Token is required' })

		const { error: password_error } = password_schema.safeParse(password)

		if (password_error) return fail(400, { error: get_error_msg(password_error) })

		if (password !== confirm_password) return fail(400, { error: 'Passwords do not match' })

		const password_hash = await bcrypt.hash(password!, 10)

		const sql = `
        UPDATE users
        SET password_hash = ?
        WHERE id = (SELECT user_id FROM tokens WHERE id = ? AND purpose = 'password_reset')`

		const { err } = await query(sql, [password_hash, token])

		if (err) return fail(500, { error: 'Database error' })

		await query('DELETE FROM tokens WHERE id = ?', [token])

		redirect(302, '/account/login?code=password_reset')
	}
}
