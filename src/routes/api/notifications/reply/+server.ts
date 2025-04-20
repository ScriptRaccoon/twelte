import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { query } from '$lib/server/db'
import {
	transform_reply_notification,
	type ReplyNotification_DB,
	type ReplyNotification
} from '$lib/types'

/**
 * Retrieves reply notifications for the authenticated user.
 */
export const GET: RequestHandler = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const sql = `
    SELECT
        n.id, name, handle, read, content, parent_id
    FROM
        reply_notifications n
    INNER JOIN
        posts p on p.id = n.id
    INNER JOIN
        users u on u.id = p.author_id
    WHERE
        n.user_id = ?
    ORDER BY
        n.created_at DESC
    `

	const { rows, success } = await query<ReplyNotification_DB>(sql, [user.id])
	if (!success) error(500, 'Database error')

	const reply_notifications: ReplyNotification[] = rows.map(transform_reply_notification)

	return json(reply_notifications)
}
