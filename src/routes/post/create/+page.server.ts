import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { post_content_schema } from '$lib/server/schemas'
import { extract_hashtags, get_error_msg } from '$lib/utils'
import { db, query } from '$lib/server/db'

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user
	if (!user) redirect(302, `/account/login?redirect=${event.url.pathname}`)
}

export const actions: Actions = {
	default: async (event) => {
		// TODO: extract this action to an API endpoint
		// since it will be reused in the reply action

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

		const hashtags: string[] = extract_hashtags(content!)

		if (hashtags.length) {
			const sql_hashtags = `
			INSERT INTO hashtags (tag)
			VALUES ${hashtags.map(() => '(?)').join(', ')}
			ON CONFLICT(tag) DO NOTHING`

			const sql_hashtags_posts = `
			INSERT INTO post_hashtags (post_id, hashtag)
			VALUES ${hashtags.map(() => '(?, ?)').join(', ')}`

			try {
				await db.batch([
					{ sql: sql_hashtags, args: hashtags },
					{ sql: sql_hashtags_posts, args: hashtags.flatMap((tag) => [post_id, tag]) }
				])
			} catch (err) {
				console.error('Error inserting hashtags:', err)
				return fail(500, { error: 'Database error', content })
			}
		}

		redirect(302, `/post/${post_id}`)
	}
}
