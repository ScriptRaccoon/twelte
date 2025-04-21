import { error, fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import type { Post } from '$lib/types'

export const load: PageServerLoad = async (event) => {
	const post_id = event.params.post_id

	const [res_post, res_replies] = await Promise.all([
		event.fetch(`/api/posts/${post_id}`),
		event.fetch(`/api/posts/${post_id}/replies`)
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

		const form_data = await event.request.formData()
		const content = form_data.get('content') as string | null

		const post_id = event.params.post_id

		const res = await event.fetch('/api/posts', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ content, parent_id: Number(post_id) })
		})

		const res_json = (await res.json()) as { post_id?: number; message: string }

		if (!res.ok) return fail(res.status, { error: res_json.message, content })

		return { success: true }
	}
}
