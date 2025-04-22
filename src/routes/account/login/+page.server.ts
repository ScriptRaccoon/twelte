import { query } from '$lib/server/db'
import { fail, redirect } from '@sveltejs/kit'
import bcrypt from 'bcryptjs'
import type { Actions } from './$types'
import jwt from 'jsonwebtoken'
import { JWT_SECRET } from '$env/static/private'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user
	if (user) redirect(302, '/account/dashboard')
}

export const actions: Actions = {
	default: async (event) => {
		const form_data = await event.request.formData()
		const handle = form_data.get('handle') as string | null
		const password = form_data.get('password') as string | null
		const redirect_path = event.url.searchParams.get('redirect') ?? '/'

		if (!password) return fail(400, { error: 'Password is required', handle })
		if (!handle) return fail(400, { error: 'Handle is required', handle })

		const sql = 'SELECT id, password_hash, email_verified_at FROM users WHERE handle = ?'
		const { rows, err } = await query<{
			id: number
			password_hash: string
			email_verified_at: string | null
		}>(sql, [handle])

		if (err) return fail(500, { error: 'Database error', handle })
		if (!rows.length) return fail(401, { error: 'Invalid credentials', handle })

		const { id, password_hash, email_verified_at } = rows[0]

		const password_is_correct = await bcrypt.compare(password, password_hash)
		if (!password_is_correct) return fail(401, { error: 'Invalid credentials', handle })

		if (!email_verified_at)
			return fail(401, { error: 'Email not verified. Please check your inbox.', handle })

		const token = jwt.sign({ id, handle }, JWT_SECRET)

		event.cookies.set('jwt', token, {
			httpOnly: true,
			path: '/',
			maxAge: 60 * 60 * 24 * 7, // 1 week
			sameSite: 'strict',
			secure: true
		})

		// don't await on purpose
		query("UPDATE users SET last_login = datetime('now') WHERE id = ?", [id])

		redirect(302, redirect_path)
	}
}
