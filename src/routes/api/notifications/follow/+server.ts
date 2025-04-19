import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { query } from '$lib/server/db'

export const DELETE: RequestHandler = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const sql = `
    DELETE FROM
        follow_notifications
    WHERE id IN (
        SELECT
            follow_notifications.id
        FROM
            follow_notifications
        JOIN
            follows ON follow_notifications.id = follows.id
        WHERE 
            follows.followed_id = ?
    )
    `

	const { success } = await query(sql, [user.id])

	if (!success) error(500, 'Database error')

	return json({ success: true })
}
