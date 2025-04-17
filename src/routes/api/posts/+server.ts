import { query } from '$lib/db'
import { transform_post, type Post_DB, type Post } from '$lib/types'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

const sql_profile_posts = `
SELECT
    posts.id,
    users.id as user_id,
    users.handle as user_handle,
    posts.content,
    posts.created_at,
    COALESCE(COUNT(likes.id), 0) as likes_count,
    EXISTS (
        SELECT 1
        FROM likes
        WHERE likes.post_id = posts.id AND likes.user_id = ?
    ) as liked_by_user
FROM
    posts
INNER JOIN
    users ON posts.user_id = users.id
LEFT JOIN
    likes on posts.id = likes.post_id
WHERE
    posts.deleted = 0
    AND posts.parent_id IS NULL
    AND posts.user_id = ?
GROUP BY
    posts.id
ORDER BY
    posts.created_at DESC
LIMIT ?
`

const sql_posts = `
SELECT
    posts.id,
    users.id as user_id,
    users.handle as user_handle,
    posts.content,
    posts.created_at,
    COALESCE(COUNT(likes.id), 0) as likes_count,
    EXISTS (
        SELECT 1
        FROM likes
        WHERE likes.post_id = posts.id AND likes.user_id = ?
    ) as liked_by_user
FROM
    posts
INNER JOIN
    users ON posts.user_id = users.id
LEFT JOIN
    likes on posts.id = likes.post_id
WHERE
    posts.deleted = 0
    AND posts.parent_id IS NULL
GROUP BY
    posts.id
ORDER BY
    posts.created_at DESC
LIMIT ?
`

export const GET: RequestHandler = async (event) => {
	const me = event.locals.user
	const me_id = me ? me.id : 0
	const user_id = event.url.searchParams.get('user_id') as string | null
	const limit = event.url.searchParams.get('limit') as string | null

	const sql = user_id ? sql_profile_posts : sql_posts
	const args = user_id ? [me_id, user_id, limit ?? 10] : [me_id, limit ?? 10]

	const { rows: posts, success } = await query<Post_DB>(sql, args)

	if (!success) error(500, 'Database error')

	const transformed_posts: Post[] = posts.map(transform_post)

	return json(transformed_posts)
}
