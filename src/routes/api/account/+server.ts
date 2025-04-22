import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { query } from '$lib/server/db'

export const DELETE: RequestHandler = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const { err } = await query('DELETE FROM users WHERE id = ?', [user.id])
	if (err) error(500, 'Failed to delete account')

	event.cookies.delete('jwt', { path: '/' })
	delete event.locals.user

	return json({ message: 'Account deleted' })
}
