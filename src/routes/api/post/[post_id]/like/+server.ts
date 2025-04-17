import { query } from '$lib/db'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

export const POST: RequestHandler = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const post_id = event.params.post_id

	const { rows: posts } = await query<{ author_id: number }>(
		'SELECT author_id FROM posts WHERE id = ?',
		[post_id]
	)

	if (!posts?.length) error(404, 'Post not found')

	if (posts[0].author_id === user.id) error(403, 'Not allowed to like your own post')

	const sql = 'INSERT INTO likes (user_id, post_id) VALUES (?, ?)'

	const { err } = await query(sql, [user.id, post_id])
	if (err) {
		if (err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
			error(403, 'Not allowed to like the same post twice')
		}

		error(500, 'Database error')
	}

	const sql_count = 'SELECT COUNT(*) as count FROM likes WHERE post_id = ?'

	const { rows, err: count_err } = await query<{ count: number }>(sql_count, [post_id])
	if (count_err) error(500, 'Database error')

	if (rows.length === 0) error(404, 'Post not found')

	const count = rows[0].count

	return json({ count })
}
