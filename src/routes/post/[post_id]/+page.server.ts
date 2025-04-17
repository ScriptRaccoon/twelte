import { error, fail } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { post_content_schema } from '$lib/schemas'
import { get_error_msg } from '$lib/utils'
import { query } from '$lib/db'

export const load: PageServerLoad = async (event) => {
	const post_id = event.params.post_id
	return { post_id }
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
