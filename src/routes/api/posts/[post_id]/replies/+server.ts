import { query } from '$lib/server/db'
import { transform_post, type Post_DB, type Post } from '$lib/types'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { REPLIES_QUERY } from '$lib/server/queries'

/**
 * Retrieves all replies to a specific post.
 */
export const GET: RequestHandler = async (event) => {
	const user = event.locals.user
	const user_id = user ? user.id : 0
	const parent_id = event.params.post_id

	const { rows: posts, success } = await query<Post_DB>(REPLIES_QUERY, { user_id, parent_id })

	if (!success) error(500, 'Database error')

	const transformed_posts: Post[] = posts.map(transform_post)

	return json(transformed_posts)
}
