import { query } from '$lib/server/db'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

/**
 * Handles the liking of a post.
 */
export const POST: RequestHandler = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const post_id = event.params.post_id

	const { rows: posts } = await query<{ author_id: number }>(
		'SELECT author_id FROM posts WHERE id = ?',
		[post_id]
	)

	if (!posts?.length) error(404, 'Post not found')

	const author_id = posts[0].author_id

	if (author_id === user.id) error(403, 'Not allowed to like your own post')

	const sql = 'INSERT INTO likes (user_id, post_id) VALUES (?, ?) RETURNING id'

	const { err, rows } = await query<{ id: string }>(sql, [user.id, post_id])
	if (err) {
		if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
			error(403, 'Not allowed to like the same post twice')
		}

		error(500, 'Database error')
	}

	const { id } = rows[0]

	const { success } = await query('INSERT INTO like_notifications (id, user_id) VALUES (?, ?)', [
		id,
		author_id
	])
	if (!success) error(500, 'Database error')

	return json({ success: true })
}
