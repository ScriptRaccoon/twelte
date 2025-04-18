import { query } from '$lib/server/db'
import { error, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { transform_profile, type Post, type Profile_DB, type Profile } from '$lib/types'

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user

	const handle = event.params.handle

	const sql_profile = `
    SELECT
        users.id as user_id,
        display_name,
        handle,
        bio,
		(
			SELECT COUNT(*)
			FROM follows f
			WHERE f.followed_id = users.id
		) as followers_count,
    	(
			SELECT COUNT(*)
			FROM follows f
			WHERE f.follower_id = users.id
		) as following_count,
		EXISTS (
			SELECT 1
			FROM follows f
			WHERE f.follower_id = :user_id AND f.followed_id = users.id
		) as following,
		EXISTS (
			SELECT 1
			FROM follows f
			WHERE f.follower_id = users.id AND f.followed_id = :user_id
		) as followed,
		(
			SELECT COUNT(*)
			FROM posts p
			WHERE p.author_id = users.id AND p.deleted = 0
		) as posts_count
    FROM
        users
    INNER JOIN
        profiles ON users.id = profiles.user_id
    WHERE
        users.handle = :handle
    `

	const { rows: profiles, success: success_profile } = await query<Profile_DB>(sql_profile, {
		user_id: user ? user.id : 0,
		handle
	})

	if (!success_profile) error(500, 'Database error')
	if (!profiles.length) error(404, 'User not found')

	const profile: Profile = transform_profile(profiles[0])

	const limit = 20

	const res = await event.fetch(`/api/posts?author_id=${profile.user_id}&limit=${limit}`)
	if (!res.ok) error(res.status, 'Failed to fetch posts')

	const posts: Post[] = await res.json()

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

		const sql = `INSERT INTO follows (follower_id, followed_id) VALUES (?, ?)`

		const { success } = await query(sql, [user.id, followed_id_num])

		return { success }
	},

	unfollow: async (event) => {
		const user = event.locals.user
		if (!user) redirect(302, `/login?redirect=${event.url.pathname}`)

		const form_data = await event.request.formData()

		const followed_id = form_data.get('followed_id') as string | null
		if (!followed_id) error(400, 'Invalid request')
		const followed_id_num = Number(followed_id)

		const sql = `DELETE FROM follows WHERE follower_id = ? AND followed_id = ?`

		const { success } = await query(sql, [user.id, followed_id_num])

		return { success }
	}
}
