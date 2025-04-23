import { query } from '$lib/server/db'
import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import type { Post, Profile } from '$lib/types'

export const load: PageServerLoad = async (event) => {
	const handle = event.params.handle

	const limit = 20

	const [res_profile, res_posts] = await Promise.all([
		event.fetch(`/api/profile/${handle}`),
		event.fetch(`/api/profile/${handle}/posts?limit=${limit}`)
	])

	if (!res_profile.ok) error(res_profile.status, 'Failed to fetch profile')
	if (!res_posts.ok) error(res_posts.status, 'Failed to fetch posts')

	const profile: Profile = await res_profile.json()
	const posts: Post[] = await res_posts.json()

	return { profile, posts, limit }
}

export const actions: Actions = {
	follow: async (event) => {
		const user = event.locals.user
		if (!user) redirect(302, `/login?redirect=${event.url.pathname}`)

		const form_data = await event.request.formData()

		const followed_id = form_data.get('followed_id') as string | null
		if (!followed_id) error(400, 'Invalid request')
		const followed_id_num = Number(followed_id)

		const sql = 'INSERT INTO follows (follower_id, followed_id) VALUES (?, ?) RETURNING id'
		const { rows } = await query<{ id: number }>(sql, [user.id, followed_id_num])

		if (!rows?.length) return fail(500, { error: 'Database error' })

		const { id } = rows[0]

		const sql_notify = `
		INSERT INTO follow_notifications (id, user_id)
		SELECT ?, ?
		FROM settings
		WHERE user_id = ? AND follow_notifications_enabled = 1`

		const args = [id, followed_id_num, followed_id_num]

		const { success } = await query(sql_notify, args)

		if (!success) return fail(500, { error: 'Database error' })

		return { success }
	},

	unfollow: async (event) => {
		const user = event.locals.user
		if (!user) redirect(302, `/login?redirect=${event.url.pathname}`)

		const form_data = await event.request.formData()

		const followed_id = form_data.get('followed_id') as string | null
		if (!followed_id) error(400, 'Invalid request')
		const followed_id_num = Number(followed_id)

		const sql = 'DELETE FROM follows WHERE follower_id = ? AND followed_id = ?'
		const { success } = await query(sql, [user.id, followed_id_num])

		return { success }
	}
}
