import { query } from '$lib/server/db'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { transform_post, type Post, type Post_DB } from '$lib/types'
import { SINGLE_POST_QUERY } from '../queries'

/**
 * Retrieves a specific post.
 */
export const GET: RequestHandler = async (event) => {
	const user = event.locals.user
	const user_id = user ? user.id : 0
	const post_id = event.params.post_id

	const { rows: posts, success: success_post } = await query<Post_DB>(SINGLE_POST_QUERY, {
		user_id,
		post_id
	})

	if (!success_post) error(500, 'Database error')

	if (!posts.length) error(404, 'Post not found')

	const post: Post = transform_post(posts[0])

	return json(post)
}

/**
 * Deletes a specific post.
 */
export const DELETE: RequestHandler = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const post_id = event.params.post_id

	const sql = 'DELETE FROM POSTS WHERE id = ? AND author_id = ?'

	const { err } = await query(sql, [post_id, user.id])

	if (err) error(500, 'Database error')

	return json({ success: true })
}
