import { db, query } from '$lib/server/db'
import { transform_post, type Post_DB, type Post } from '$lib/types'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { post_request_schema } from '$lib/server/schemas'
import { extract_hashtags, get_error_msg } from '$lib/utils'
import { ALL_POSTS_QUERY, FOLLOWED_POSTS_QUERY } from '$lib/server/queries'

/**
 * Retrieves all posts
 */
export const GET: RequestHandler = async (event) => {
	const user = event.locals.user
	const user_id = user ? user.id : 0
	const limit = (event.url.searchParams.get('limit') as string | null) ?? '10'
	const offset = (event.url.searchParams.get('offset') as string | null) ?? '0'
	const filter = event.url.searchParams.get('filter') ?? 'all'

	const sql = filter === 'all' ? ALL_POSTS_QUERY : FOLLOWED_POSTS_QUERY

	const { rows: posts, success } = await query<Post_DB>(sql, {
		user_id,
		limit,
		offset
	})

	if (!success) error(500, 'Database error')

	const transformed_posts: Post[] = posts.map(transform_post)

	return json(transformed_posts)
}

/**
 * Creates a new post
 */
export const POST: RequestHandler = async (event) => {
	const user = event.locals.user
	if (!user) return error(401, 'Unauthorized')

	const body = await event.request.json()
	const { data, error: validation_error } = post_request_schema.safeParse(body)

	if (validation_error) error(400, { message: get_error_msg(validation_error) })

	const sql = data.parent_id
		? 'INSERT INTO posts (author_id, content, parent_id) VALUES (?, ?, ?) RETURNING id'
		: 'INSERT INTO posts (author_id, content) VALUES (?, ?) RETURNING id'
	const args = data.parent_id ? [user.id, data.content, data.parent_id] : [user.id, data.content]
	const { rows, err } = await query<{ id: number }>(sql, args)

	if (err) error(500, { message: 'Database error' })

	const post_id = rows[0]?.id

	if (data.parent_id) {
		const sql_notify = `
        INSERT INTO reply_notifications (id, user_id)
        SELECT ?, author_id
        FROM posts
        WHERE id = ? AND EXISTS (
            SELECT 1
            FROM settings
            WHERE user_id = posts.author_id
			AND reply_notifications_enabled = 1
			AND posts.author_id != ?
        )`

		const args = [post_id, data.parent_id, user.id]

		const { success } = await query(sql_notify, args)

		if (!success) error(500, { message: 'Database error' })
	}

	const hashtags: string[] = extract_hashtags(data.content)

	if (hashtags.length) {
		const sql_hashtags = `
			INSERT INTO hashtags (tag)
			VALUES ${hashtags.map(() => '(?)').join(', ')}
			ON CONFLICT(tag) DO NOTHING`

		const sql_hashtags_posts = `
			INSERT INTO post_hashtags (post_id, hashtag)
			VALUES ${hashtags.map(() => '(?, ?)').join(', ')}`

		try {
			await db.batch([
				{ sql: sql_hashtags, args: hashtags },
				{ sql: sql_hashtags_posts, args: hashtags.flatMap((tag) => [post_id, tag]) }
			])
			return json({ message: 'Post and hashtags created', post_id })
		} catch (err) {
			console.error('Error inserting hashtags:', err)
			error(500, { message: 'Database error' })
		}
	}

	return json({ message: 'Post created', post_id })
}
