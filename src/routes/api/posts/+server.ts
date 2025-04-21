import { query } from '$lib/server/db'
import { transform_post, type Post_DB, type Post } from '$lib/types'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

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
