import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { db } from '$lib/server/db'

/**
 * Deletes all notifications for the authenticated user.
 */
export const DELETE: RequestHandler = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const sql_follow = `DELETE FROM follow_notifications WHERE follow_notifications.user_id = ?`
	const sql_like = `DELETE FROM like_notifications WHERE like_notifications.user_id = ?`

	try {
		await db.batch([
			{ sql: sql_follow, args: [user.id] },
			{ sql: sql_like, args: [user.id] }
		])

		return json({ success: true })
	} catch (err) {
		console.error(err)
		error(500, 'Database error')
	}
}

/**
 * Marks all notifications as read for the authenticated user.
 */
export const PATCH: RequestHandler = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const sql_follow = `
    UPDATE follow_notifications
    SET read = 1
    WHERE follow_notifications.user_id = ?`

	const sql_like = `
    UPDATE like_notifications
    SET read = 1
    WHERE like_notifications.user_id = ?`

	try {
		await db.batch([
			{ sql: sql_follow, args: [user.id] },
			{ sql: sql_like, args: [user.id] }
		])

		return json({ success: true })
	} catch (err) {
		console.error(err)
		error(500, 'Database error')
	}
}
