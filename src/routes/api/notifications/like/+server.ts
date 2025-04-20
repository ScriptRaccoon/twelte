import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { query } from '$lib/server/db'
import {
	transform_like_notification,
	type LikeNotification,
	type LikeNotification_DB
} from '$lib/types'

/**
 * Retrieves all like notifications for the authenticated user.
 */
export const GET: RequestHandler = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const sql = `
    SELECT
        n.id, read, name, handle, post_id, content
    FROM
        like_notifications n
    INNER JOIN
        likes l on l.id = n.id
    INNER JOIN
        posts p on p.id = l.post_id
    INNER JOIN
        users u on u.id = l.user_id
    WHERE
        n.user_id = ?
    ORDER BY
        n.created_at DESC
    `

	const { rows, success } = await query<LikeNotification_DB>(sql, [user.id])
	if (!success) error(500, 'Database error')

	const like_notifications: LikeNotification[] = rows.map(transform_like_notification)

	return json(like_notifications)
}
