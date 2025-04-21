import { db, query } from '$lib/server/db'
import { transform_post, type Post_DB, type Post } from '$lib/types'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { post_request_schema } from '$lib/server/schemas'
import { extract_hashtags, get_error_msg } from '$lib/utils'

/**
 * Queries all posts
 */
const sql_all = `
SELECT
    posts.id,
    users.id as author_id,
    users.handle as author_handle,
    users.name as author_name,
    users.avatar_url as author_avatar_url,
    posts.content,
    posts.created_at,
    (
        SELECT COUNT(*)
        FROM likes
        WHERE likes.post_id = posts.id
    ) as likes_count,
    EXISTS (
        SELECT 1
        FROM likes
        WHERE likes.post_id = posts.id AND likes.user_id = ?
    ) as liked_by_user,
    (
        SELECT COUNT(*)
        FROM posts replies
        WHERE replies.parent_id = posts.id
        AND replies.deleted = 0
    ) as replies_count
FROM
    posts
INNER JOIN
    users ON posts.author_id = users.id
WHERE
    posts.deleted = 0
    AND posts.parent_id IS NULL
ORDER BY
    posts.created_at DESC
LIMIT ? OFFSET ?
`

/**
 * Queries all posts by users the current user is following
 */
const sql_following = `
SELECT
    posts.id,
    users.id as author_id,
    users.handle as author_handle,
    users.name as author_name,
    users.avatar_url as author_avatar_url,
    posts.content,
    posts.created_at,
    (
        SELECT COUNT(*)
        FROM likes
        WHERE likes.post_id = posts.id
    ) as likes_count,
    EXISTS (
        SELECT 1
        FROM likes
        WHERE likes.post_id = posts.id AND likes.user_id = ?
    ) as liked_by_user,
    (
        SELECT COUNT(*)
        FROM posts replies
        WHERE replies.parent_id = posts.id
        AND replies.deleted = 0
    ) as replies_count
FROM
    posts
INNER JOIN
    follows ON follows.followed_id = posts.author_id
INNER JOIN
    users ON posts.author_id = users.id
WHERE
    follows.follower_id = ?    
    AND posts.deleted = 0
    AND posts.parent_id IS NULL
ORDER BY
    posts.created_at DESC
LIMIT ? OFFSET ?
`

/**
 * Retrieves all posts
 */
export const GET: RequestHandler = async (event) => {
	const user = event.locals.user
	const user_id = user ? user.id : 0
	const limit = (event.url.searchParams.get('limit') as string | null) ?? '10'
	const offset = (event.url.searchParams.get('offset') as string | null) ?? '0'
	const filter = event.url.searchParams.get('filter') ?? 'all'

	const sql = filter === 'all' ? sql_all : sql_following
	const args = filter === 'all' ? [user_id, limit, offset] : [user_id, user_id, limit, offset]

	const { rows: posts, success } = await query<Post_DB>(sql, args)

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
            WHERE user_id = posts.author_id AND reply_notifications_enabled = 1
        )`

		const args = [post_id, data.parent_id]

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
