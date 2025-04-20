import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { post_content_schema } from '$lib/server/schemas'
import { get_error_msg } from '$lib/utils'
import { query } from '$lib/server/db'

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user
	if (!user) redirect(302, `/account/login?redirect=${event.url.pathname}`)
}

export const actions: Actions = {
	default: async (event) => {
		const user = event.locals.user
		if (!user) error(401, 'Unauthorized')

		const form_data = await event.request.formData()
		const content = form_data.get('content') as string | null

		const { error: content_error } = post_content_schema.safeParse(content)

		if (content_error) {
			return fail(400, { error: get_error_msg(content_error), content })
		}

		const sql = 'INSERT INTO posts (author_id, content) VALUES (?, ?) RETURNING id'
		const { rows, err } = await query<{ id: number }>(sql, [user.id, content])

		if (err) return fail(500, { error: 'Database error', content })
		const post_id = rows[0]?.id

		redirect(302, `/post/${post_id}`)
	}
}
