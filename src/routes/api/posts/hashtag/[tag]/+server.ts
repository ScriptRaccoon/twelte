import { query } from '$lib/server/db'
import { transform_post, type Post_DB, type Post } from '$lib/types'
import { error, json } from '@sveltejs/kit'
import { POSTS_BY_HASHTAG_QUERY } from '$lib/server/queries'
import type { RequestHandler } from './$types'

/**
 * Retrieves all posts with a given hashtag
 */
export const GET: RequestHandler = async (event) => {
	const user = event.locals.user
	const user_id = user ? user.id : 0

	const tag = event.params.tag

	const limit = event.url.searchParams.get('limit') ?? '10'
	const offset = event.url.searchParams.get('offset') ?? '0'

	const args = { user_id, tag, limit, offset }
	const { rows: posts, success } = await query<Post_DB>(POSTS_BY_HASHTAG_QUERY, args)

	if (!success) error(500, 'Database error')

	const transformed_posts: Post[] = posts.map(transform_post)

	return json(transformed_posts)
}
