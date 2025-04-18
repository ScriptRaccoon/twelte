import { JWT_SECRET } from '$env/static/private'
import type { UserLocals } from '$lib/types'
import type { Handle } from '@sveltejs/kit'
import jwt from 'jsonwebtoken'

export const handle: Handle = async ({ event, resolve }) => {
	const token = event.cookies.get('jwt')

	if (token) {
		try {
			const user = jwt.verify(token, JWT_SECRET) as UserLocals
			event.locals.user = user
		} catch (err) {
			console.error(err)
			event.cookies.delete('jwt', { path: '/' })
		}
	}

	return await resolve(event)
}
