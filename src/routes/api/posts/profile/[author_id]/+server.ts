import { query } from '$lib/server/db'
import { transform_post, type Post_DB, type Post } from '$lib/types'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { POSTS_BY_AUTHOR_QUERY } from '../../queries'

export const GET: RequestHandler = async (event) => {
	const user = event.locals.user
	const user_id = user ? user.id : 0
	const author_id = Number(event.params.author_id)
	const limit = (event.url.searchParams.get('limit') as string | null) ?? '10'
	const offset = (event.url.searchParams.get('offset') as string | null) ?? '0'

	const args = { user_id, author_id, limit, offset }
	const { rows: posts, err } = await query<Post_DB>(POSTS_BY_AUTHOR_QUERY, args)

	if (err) error(500, 'Database error')

	const transformed_posts: Post[] = posts.map(transform_post)

	return json(transformed_posts)
}
