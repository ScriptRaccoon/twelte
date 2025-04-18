import { query } from '$lib/server/db'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './delete/$types'
import { transform_post, type Post, type Post_DB } from '$lib/types'

export const DELETE: RequestHandler = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const post_id = event.params.post_id

	const sql = 'UPDATE POSTS SET deleted = 1 WHERE id = ? AND author_id = ?'

	const { err } = await query(sql, [post_id, user.id])

	if (err) error(500, 'Database error')

	return json({ success: true })
}

export const GET: RequestHandler = async (event) => {
	const user = event.locals.user
	const user_id = user ? user.id : 0
	const post_id = event.params.post_id

	const sql = `
	SELECT
		posts.id as id,
		users.id as author_id,
		users.handle as author_handle,
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
			WHERE likes.post_id = posts.id AND likes.user_id = :user_id
		) as liked_by_user,
		(
    		SELECT COUNT(*)
        	FROM posts replies
       		WHERE replies.parent_id = posts.id AND replies.deleted = 0
    	) as replies_count,
		posts.parent_id as parent_id
	FROM
		posts
	INNER JOIN
		users ON posts.author_id = users.id
	WHERE
		posts.id = :post_id
		AND posts.deleted = 0
	`

	const { rows: posts, success: success_post } = await query<Post_DB>(sql, {
		user_id,
		post_id
	})

	if (!success_post) error(500, 'Database error')

	if (!posts.length) error(404, 'Post not found')

	const post: Post = transform_post(posts[0])

	return json(post)
}
