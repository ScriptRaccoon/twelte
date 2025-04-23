import { email_schema } from '$lib/server/schemas'
import { fail } from '@sveltejs/kit'
import type { Actions } from './$types'
import { query } from '$lib/server/db'
import { send_password_reset_email } from '$lib/server/mail'

export const actions: Actions = {
	default: async (event) => {
		const form_data = await event.request.formData()
		const email = form_data.get('email') as string | null

		const { success: is_valid } = email_schema.safeParse(email)
		if (!is_valid) return fail(400, { error: 'Invalid email address', email })

		const sql_user = 'SELECT id FROM users WHERE email = ?'
		const { rows, err: err_user } = await query<{ id: number }>(sql_user, [email])

		if (err_user) return fail(500, { error: 'Database error', email })

		if (!rows.length) return fail(400, { error: 'Email not found', email })

		const { id: user_id } = rows[0]

		const reset_token = crypto.randomUUID()

		const sql_token = `
        INSERT INTO tokens (id, user_id, purpose)
        VALUES (?, ?, 'password_reset')`

		const { err: err_token } = await query(sql_token, [reset_token, user_id])

		if (err_token) return fail(500, { error: 'Database error', email })

		const { success } = await send_password_reset_email(event.url.origin, email!, reset_token)

		if (!success) return fail(500, { error: 'Failed to send email', email })

		return { success: true, email }
	}
}
