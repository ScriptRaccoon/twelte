import { query } from '$lib/server/db'
import { transform_profile, type Profile_DB } from '$lib/types'
import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'

/**
 * Queries the profile data of a user
 */
const sql_profile = `
SELECT
    users.id,
    name,
    handle,
    bio,
    avatar_url,
    website,
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

/**
 * Retrieves the profile of a user by their handle.
 * If the user is authenticated, it also includes their follow status.
 */
export const GET: RequestHandler = async (event) => {
	const user = event.locals.user
	const user_id = user ? user.id : 0
	const handle = event.params.handle

	const { rows, success } = await query<Profile_DB>(sql_profile, { user_id, handle })

	if (!success) error(500, 'Database error')
	if (!rows.length) error(404, 'User profile not found')

	const profile = transform_profile(rows[0])

	return json(profile)
}
