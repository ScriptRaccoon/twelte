import { query } from '$lib/db'
import { fail } from '@sveltejs/kit'
import bcrypt from 'bcryptjs'
import type { Actions } from './$types'
import { email_schema, handle_schema, password_schema } from '$lib/schemas'
import { get_error_msg } from '$lib/utils'
import { send_verification_email } from '$lib/mail'

export const actions: Actions = {
	register: async (event) => {
		const form_data = await event.request.formData()

		const email = form_data.get('email') as string | null
		const password = form_data.get('password') as string | null
		const handle = form_data.get('handle') as string | null

		const { error: email_error } = email_schema.safeParse(email)
		if (email_error) return fail(400, { error: get_error_msg(email_error), email, handle })

		const { error: password_error } = password_schema.safeParse(password)
		if (password_error)
			return fail(400, { error: get_error_msg(password_error), email, handle })

		const { error: handle_error } = handle_schema.safeParse(handle)
		if (handle_error) return fail(400, { error: get_error_msg(handle_error), email, handle })

		const password_hash = await bcrypt.hash(password!, 10)

		const { rows, err: err_insert } = await query<{ id: number }>(
			'INSERT INTO USERS (email, password_hash, handle) VALUES (?, ?, ?) RETURNING id',
			[email, password_hash, handle]
		)

		if (err_insert) {
			if (err_insert.code === 'SQLITE_CONSTRAINT_UNIQUE') {
				return fail(400, { error: 'Email or handle already exists', email, handle })
			}

			return fail(500, { error: 'Database error', email, handle })
		}

		const user_id = rows[0].id

		const { err: err_profile } = await query(
			'INSERT INTO profiles (user_id, display_name) VALUES (?, ?)',
			[user_id, handle]
		)

		if (err_profile) {
			// TODO: delete user if profile creation fails
			return fail(500, { error: 'Database error', email, handle })
		}

		const email_token = crypto.randomUUID()

		const token_sql = `
		INSERT INTO
			tokens (user_id, token, purpose)
		VALUES
			(:user_id, :token, 'email_verification')
		`

		const { err: err_token } = await query(token_sql, {
			user_id,
			token: email_token
		})

		if (err_token) {
			return fail(500, {
				error: 'Token could not be created',
				email,
				handle
			})
		}

		const { success: email_sent } = await send_verification_email(
			event.url.origin,
			email!,
			email_token
		)

		if (!email_sent) {
			// TODO: give user option to resend email
			return fail(500, {
				error: 'Verification Email could not be sent',
				email,
				handle
			})
		}

		return { success: true, email, handle }
	}
}
