import { POSTS_BY_SEARCH_QUERY } from '$lib/server/queries'
import { transform_post, type Post, type Post_DB } from '$lib/types'
import type { RequestHandler } from './$types'
import { query } from '$lib/server/db'
import { error, json } from '@sveltejs/kit'

export const GET: RequestHandler = async (event) => {
	const user = event.locals.user
	const user_id = user ? user.id : 0

	const q = event.url.searchParams.get('q')
	const limit = event.url.searchParams.get('limit') ?? '10'
	const offset = event.url.searchParams.get('offset') ?? '0'

	const { rows, success } = await query<Post_DB>(POSTS_BY_SEARCH_QUERY, {
		user_id,
		search: `%${q}%`,
		limit,
		offset
	})

	if (!success) error(500, 'Database error')

	const posts: Post[] = rows.map(transform_post)

	return json(posts)
}
