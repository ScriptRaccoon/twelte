import { query } from '$lib/server/db'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

/**
 * Handles the unliking of a post.
 */
export const POST: RequestHandler = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const post_id = event.params.post_id

	const sql = 'DELETE FROM likes WHERE user_id = ? AND post_id = ?'

	const { err } = await query(sql, [user.id, post_id])

	if (err) error(500, 'Database error')

	return json({ success: true })
}
