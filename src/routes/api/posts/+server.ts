import { query } from '$lib/db'
import { transform_post, type Post_DB, type Post } from '$lib/types'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

const sql_profile_posts = `
SELECT
    posts.id,
    users.id as author_id,
    users.handle as author_handle,
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
    users ON posts.author_id = users.id
LEFT JOIN
    likes on posts.id = likes.post_id
WHERE
    posts.deleted = 0
    AND posts.parent_id IS NULL
    AND posts.author_id = ?
GROUP BY
    posts.id
ORDER BY
    posts.created_at DESC
LIMIT ? OFFSET ?
`

const sql_posts = `
SELECT
    posts.id,
    users.id as author_id,
    users.handle as author_handle,
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
    users ON posts.author_id = users.id
LEFT JOIN
    likes on posts.id = likes.post_id
WHERE
    posts.deleted = 0
    AND posts.parent_id IS NULL
GROUP BY
    posts.id
ORDER BY
    posts.created_at DESC
LIMIT ? OFFSET ?
`

export const GET: RequestHandler = async (event) => {
	const user = event.locals.user
	const user_id = user ? user.id : 0
	const author_id = event.url.searchParams.get('author_id') as string | null
	const limit = (event.url.searchParams.get('limit') as string | null) ?? '10'
	const offset = (event.url.searchParams.get('offset') as string | null) ?? '0'

	const sql = author_id ? sql_profile_posts : sql_posts
	const args = author_id ? [user_id, author_id, limit, offset] : [user_id, limit, offset]

	const { rows: posts, success } = await query<Post_DB>(sql, args)

	if (!success) error(500, 'Database error')

	const transformed_posts: Post[] = posts.map(transform_post)

	return json(transformed_posts)
}
