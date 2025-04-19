import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { query } from '$lib/server/db'

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user
	if (!user) throw error(401, 'Unauthorized')

	const sql = `
    SELECT
        n.id,
        n.read,
        u.name,
        u.handle
    FROM
        follow_notifications n
    INNER JOIN
        follows f on f.id = n.id
    INNER JOIN
        users u on u.id = f.follower_id
    WHERE
        f.followed_id = ?
    ORDER BY
        n.created_at DESC
    `

	const { rows, success } = await query<{
		id: number
		name: string
		handle: string
		read: number
	}>(sql, [user.id])

	if (!success) error(500, 'Database error')

	const follow_notifications = rows.map((row) => ({
		id: row.id,
		name: row.name,
		handle: row.handle,
		read: Boolean(row.read)
	}))

	const number_unread = follow_notifications.filter((n) => !n.read).length

	setTimeout(() => {
		// don't await on purpose
		mark_notifications_as_read(user.id)
	}, 1000)

	return {
		follow_notifications,
		number_unread
	}
}

async function mark_notifications_as_read(user_id: number) {
	const sql = `
    UPDATE
        follow_notifications
    SET
        read = 1
    WHERE id IN (
        SELECT
            follow_notifications.id
        FROM
            follow_notifications
        JOIN
            follows ON follow_notifications.id = follows.id
        WHERE 
            follows.followed_id = ?
            AND follow_notifications.read = 0
    )
    `

	const { success } = await query(sql, [user_id])
	if (!success) console.error('Failed to mark notifications as read')
}
