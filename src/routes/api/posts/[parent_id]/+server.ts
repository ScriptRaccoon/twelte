import { query } from '$lib/db'
import { transform_post, type Post_DB, type Post } from '$lib/types'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

const sql_replies = `
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
    ) as liked_by_user,
    COALESCE(COUNT(replies.id), 0) as replies_count
FROM
    posts
INNER JOIN
    users ON posts.author_id = users.id
LEFT JOIN
    likes on posts.id = likes.post_id
LEFT JOIN
    posts replies ON posts.id = replies.parent_id
WHERE
    posts.deleted = 0
    AND posts.parent_id = ?
GROUP BY
    posts.id
ORDER BY
    posts.created_at DESC
`

export const GET: RequestHandler = async (event) => {
	const user = event.locals.user
	const user_id = user ? user.id : 0

	const parent_id = event.params.parent_id

	const { rows: posts, success } = await query<Post_DB>(sql_replies, [user_id, parent_id])

	if (!success) error(500, 'Database error')

	const transformed_posts: Post[] = posts.map(transform_post)

	return json(transformed_posts)
}
