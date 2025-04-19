import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { query } from '$lib/server/db'

export const DELETE: RequestHandler = async (event) => {
	const id = event.params.id
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')
	const sql = 'DELETE FROM follow_notifications WHERE id = ?'
	const { success } = await query(sql, [id, user.id])
	if (!success) error(500, 'Database error')
	return json({ success: true })
}
