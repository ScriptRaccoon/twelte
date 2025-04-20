import { error, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from '../$types'
import { query } from '$lib/server/db'
import { bio_schema, name_schema, email_schema, password_schema } from '$lib/server/schemas'
import { fail } from '@sveltejs/kit'
import { get_error_msg } from '$lib/utils'
import bcrypt from 'bcryptjs'
import type { AccountData } from '$lib/types'

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user
	if (!user) redirect(302, '/account/login')

	const sql = 'SELECT email, handle, name, bio FROM users WHERE users.id = ?'
	const { rows, err } = await query<AccountData>(sql, [user.id])

	if (err) error(500, 'Database error')
	if (!rows.length) error(404, 'Account not found')

	const account: AccountData = rows[0]

	return { account }
}

export const actions: Actions = {
	logout: async (event) => {
		event.cookies.delete('jwt', { path: '/' })
		redirect(302, '/account/login')
	},

	edit: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const form_data = await event.request.formData()

		const email = form_data.get('email') as string | null
		const name = form_data.get('name') as string | null
		const bio = (form_data.get('bio') ?? '') as string

		const { error: email_error } = email_schema.safeParse(email)
		if (email_error) return fail(400, { action: 'edit', error: get_error_msg(email_error) })

		const { error: name_error } = name_schema.safeParse(name)
		if (name_error) return fail(400, { action: 'edit', error: get_error_msg(name_error) })

		const { error: bio_error } = bio_schema.safeParse(bio)
		if (bio_error) return fail(400, { action: 'edit', error: get_error_msg(bio_error) })

		const sql = 'UPDATE users SET email = ?, name = ?, bio = ? WHERE id = ?'
		const { err } = await query(sql, [email, name, bio, user.id])

		if (err) {
			if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
				return fail(400, { action: 'edit', error: 'Email already exists' })
			}
			return fail(500, { action: 'edit', error: 'Database error' })
		}

		return { action: 'edit', message: 'Profile updated' }
	},

	password: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const form_data = await event.request.formData()
		const old_password = form_data.get('old_password') as string | null
		const new_password = form_data.get('new_password') as string | null

		if (old_password === new_password)
			return fail(400, {
				action: 'password',
				error: 'New password must be different from old password'
			})

		const { error: parse_error } = password_schema.safeParse(new_password)
		if (parse_error) return fail(400, { action: 'password', error: get_error_msg(parse_error) })

		const { rows } = await query<{ password_hash: string }>(
			'SELECT password_hash FROM users WHERE id = ?',
			[user.id]
		)

		if (!rows) return fail(500, { action: 'password', error: 'Database error' })
		if (!rows.length)
			return fail(401, { action: 'password', error: 'Old Password is incorrect' })

		const { password_hash } = rows[0]

		const password_is_correct = await bcrypt.compare(old_password!, password_hash)

		if (!password_is_correct)
			return fail(401, { action: 'password', error: 'Old Password is incorrect' })

		const new_password_hash = await bcrypt.hash(new_password!, 10)

		const { success } = await query('UPDATE users SET password_hash = ? WHERE id = ?', [
			new_password_hash,
			user.id
		])

		if (!success) return fail(500, { action: 'password', error: 'Database error' })

		return { action: 'password', message: 'Password updated' }
	},

	delete: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const { err } = await query('DELETE FROM users WHERE id = ?', [user.id])
		if (err) return fail(500, { action: 'delete', error: 'Database error' })

		event.cookies.delete('jwt', { path: '/' })

		redirect(302, '/')
	}
}
