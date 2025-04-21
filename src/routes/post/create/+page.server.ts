import { fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user
	if (!user) redirect(302, `/account/login?redirect=${event.url.pathname}`)
}

export const actions: Actions = {
	default: async (event) => {
		const form_data = await event.request.formData()
		const content = form_data.get('content') as string | null

		const res = await event.fetch('/api/posts', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ content })
		})

		const res_json = (await res.json()) as { post_id?: number; message: string }

		if (!res.ok) return fail(res.status, { error: res_json.message })

		const { post_id } = res_json

		redirect(302, `/post/${post_id}`)
	}
}
