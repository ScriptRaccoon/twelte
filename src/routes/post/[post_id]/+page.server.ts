import { error, fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { post_content_schema } from '$lib/schemas'
import { get_error_msg } from '$lib/utils'
import { query } from '$lib/db'

type PostDetail = {
	id: number
	author_id: number
	author_handle: string
	content: string
	created_at: string
	likes_count: number
	liked_by_user: boolean
}

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user
	const post_id = event.params.post_id

	const sql_post = `
	SELECT
		posts.id as id,
		users.id as author_id,
		users.handle as author_handle,
		posts.content,
		posts.created_at,
		COALESCE(COUNT(likes.id), 0) as likes_count,
		EXISTS (
			SELECT 1
			FROM likes
			WHERE likes.post_id = posts.id AND likes.user_id = :user_id
		) as liked_by_user
	FROM
		posts
	INNER JOIN
		users ON posts.author_id = users.id
	LEFT JOIN
		likes on posts.id = likes.post_id
	WHERE
		posts.id = :post_id
		AND posts.parent_id IS NULL
		AND posts.deleted = 0
	GROUP BY
		posts.id
	`

	const { rows: posts, success: success_post } = await query<PostDetail>(sql_post, {
		user_id: user ? user.id : 0,
		post_id
	})

	if (!success_post) error(500, 'Database error')

	if (!posts.length) error(404, 'Post not found')

	const post = posts[0]

	const sql_replies = `
	SELECT
		posts.id as id,
		users.id as author_id,
		users.handle as author_handle,
		posts.content,
		posts.created_at,
		COALESCE(COUNT(likes.id), 0) as likes_count,
		EXISTS (
			SELECT 1
			FROM likes
			WHERE likes.post_id = posts.id AND likes.user_id = :user_id
		) as liked_by_user
	FROM
		posts
	INNER JOIN
		users ON posts.author_id = users.id
	LEFT JOIN
		likes on posts.id = likes.post_id
	WHERE
		posts.parent_id = :parent_id
		AND posts.deleted = 0
	GROUP BY
		posts.id
	ORDER BY
		posts.created_at DESC
	`

	const { rows: replies, success: success_replies } = await query<PostDetail>(sql_replies, {
		user_id: user ? user.id : 0,
		parent_id: post.id
	})

	if (!success_replies) error(500, 'Database error')

	return { post, replies }
}

export const actions: Actions = {
	reply: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const post_id = event.params.post_id

		const form_data = await event.request.formData()
		const content = form_data.get('content') as string | null

		const { error: content_error } = post_content_schema.safeParse(content)

		if (content_error) {
			return fail(400, { error: get_error_msg(content_error), content })
		}

		const sql = 'INSERT INTO posts (author_id, content, parent_id) VALUES (?, ?, ?)'
		const { err } = await query(sql, [user.id, content, post_id])

		if (err) return fail(500, { error: 'Database error' })

		return { success: true }
	}
}
