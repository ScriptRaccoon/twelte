import { query } from '$lib/db'
import { fail, redirect } from '@sveltejs/kit'
import bcrypt from 'bcryptjs'
import type { Actions } from './$types'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '$env/static/private'
import type { PageServerLoad } from '../$types'

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user
	if (user) {
		redirect(302, '/account/dashboard')
	}

	return {}
}

export const actions: Actions = {
	default: async (event) => {
		const form_data = await event.request.formData()
		const handle = form_data.get('handle') as string | null
		const password = form_data.get('password') as string | null
		const redirect_path = event.url.searchParams.get('redirect') ?? '/account/dashboard'

		if (!password) return fail(400, { error: 'Password is required', handle })
		if (!handle) return fail(400, { error: 'Handle is required', handle })

		type Credentials = { id: number; password_hash: string }

		const { rows, err } = await query<Credentials>(
			'SELECT id, password_hash FROM users WHERE handle = ?',
			[handle]
		)

		if (err) return fail(500, { error: 'Database error' })
		if (rows.length === 0) return fail(401, { error: 'Invalid credentials', handle })

		const { id, password_hash } = rows[0]

		const password_is_correct = await bcrypt.compare(password, password_hash)
		if (!password_is_correct) return fail(401, { error: 'Invalid credentials', handle })

		const token = jwt.sign({ id, handle }, JWT_SECRET)

		event.cookies.set('jwt', token, {
			httpOnly: true,
			path: '/',
			maxAge: 60 * 60 * 24 * 7, // 1 week
			sameSite: 'strict',
			secure: true
		})

		redirect(302, redirect_path)
	}
}
