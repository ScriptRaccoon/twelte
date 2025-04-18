import { error, fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { post_content_schema } from '$lib/server/schemas'
import { get_error_msg } from '$lib/utils'
import { query } from '$lib/server/db'
import type { Post } from '$lib/types'

export const load: PageServerLoad = async (event) => {
	const post_id = event.params.post_id

	const [res_post, res_replies] = await Promise.all([
		event.fetch(`/api/post/${post_id}`),
		event.fetch(`/api/posts/${post_id}`)
	])

	if (!res_post.ok) error(res_post.status, 'Failed to fetch post')
	if (!res_replies.ok) error(res_replies.status, 'Failed to fetch replies')

	const post: Post = await res_post.json()
	const replies: Post[] = await res_replies.json()

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
