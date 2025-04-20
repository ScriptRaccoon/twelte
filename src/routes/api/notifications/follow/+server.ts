import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { query } from '$lib/server/db'
import {
	transform_follow_notification,
	type FollowNotification,
	type FollowNotification_DB
} from '$lib/types'

/**
 * Retrieves follow notifications for the authenticated user.
 */
export const GET: RequestHandler = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const sql = `
    SELECT
        n.id, read, name, handle
    FROM
        follow_notifications n
    INNER JOIN
        follows f on f.id = n.id
    INNER JOIN
        users u on u.id = f.follower_id
    WHERE
        n.user_id = ?
    ORDER BY
        n.created_at DESC
    `

	const { rows, success } = await query<FollowNotification_DB>(sql, [user.id])

	if (!success) error(500, 'Database error')

	const follow_notifications: FollowNotification[] = rows.map(transform_follow_notification)

	return json(follow_notifications)
}
