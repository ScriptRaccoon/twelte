import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { FollowNotification } from '$lib/types'

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const res = await event.fetch('/api/notifications/follow')
	if (!res.ok) error(res.status, 'Failed to fetch notifications')

	const follow_notifications: FollowNotification[] = await res.json()
	const number_unread = follow_notifications.filter((n) => !n.read).length

	if (number_unread > 0) {
		// mark as read, don't await on purpose
		event.fetch('/api/notifications/follow', { method: 'PATCH' })
	}

	return { follow_notifications, number_unread }
}
