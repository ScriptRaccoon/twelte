import { query } from '$lib/server/db'
import { error, fail, redirect } from '@sveltejs/kit'
import type { Actions, PageServerLoad } from './$types'
import { transform_profile, type Post, type Profile_DB, type Profile } from '$lib/types'

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user
	const handle = event.params.handle
	const profile = await fetch_profile(handle, user ? user.id : 0)

	const limit = 20
	const res = await event.fetch(`/api/posts/profile/${profile.id}?limit=${limit}`)
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

		const sql = 'INSERT INTO follows (follower_id, followed_id) VALUES (?, ?) RETURNING id'
		const { rows } = await query<{ id: number }>(sql, [user.id, followed_id_num])

		if (!rows?.length) return fail(500, { error: 'Database error' })
		// TODO: display error in UI

		const { id } = rows[0]

		const sql_notify = `
		INSERT INTO follow_notifications (id, user_id)
		SELECT ?, ?
		FROM settings
		WHERE user_id = ? AND follow_notifications_enabled = 1`

		const args = [id, followed_id_num, followed_id_num]

		const { success } = await query(sql_notify, args)

		if (!success) return fail(500, { error: 'Database error' })
		// TODO: display error in UI

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
		// TODO: display error in UI

		return { success }
	}
}

/**
 * Queries the database for the profile data of a user by their handle.
 */
const sql_profile = `
SELECT
	users.id,
	name,
	handle,
	bio,
	avatar_url,
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
		WHERE p.author_id = users.id
		AND p.parent_id IS NULL
	) as posts_count,
	(
		SELECT COUNT(*)
		FROM posts p
		WHERE p.author_id = users.id
		AND p.parent_id IS NOT NULL
	) as replies_count
FROM
	users
WHERE
	users.handle = :handle
`

async function fetch_profile(handle: string, user_id: number): Promise<Profile> {
	const { rows: profiles, success } = await query<Profile_DB>(sql_profile, { user_id, handle })

	if (!success) error(500, 'Database error')
	if (!profiles.length) error(404, 'User not found')

	return transform_profile(profiles[0])
}
