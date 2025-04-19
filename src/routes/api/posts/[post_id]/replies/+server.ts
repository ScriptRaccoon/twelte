import { query } from '$lib/server/db'
import { transform_post, type Post_DB, type Post } from '$lib/types'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

/**
 * Queries all replies to a specific post.
 */
const sql_replies = `
SELECT
    posts.id,
    users.id as author_id,
    users.handle as author_handle,
    users.name as author_name,
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
    ) as replies_count,
    posts.parent_id as parent_id
FROM
    posts
INNER JOIN
    users ON posts.author_id = users.id
WHERE
    posts.deleted = 0
    AND posts.parent_id = ?
ORDER BY
    posts.created_at DESC
`

/**
 * Retrieves all replies to a specific post.
 */
export const GET: RequestHandler = async (event) => {
	const user = event.locals.user
	const user_id = user ? user.id : 0
	const parent_id = event.params.post_id

	const args = [user_id, parent_id]
	const { rows: posts, success } = await query<Post_DB>(sql_replies, args)

	if (!success) error(500, 'Database error')

	const transformed_posts: Post[] = posts.map(transform_post)

	return json(transformed_posts)
}
