import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { FollowNotification, LikeNotification } from '$lib/types'

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user
	if (!user) error(401, 'Unauthorized')

	const [res_follow, res_like] = await Promise.all([
		event.fetch('/api/notifications/follow'),
		event.fetch('/api/notifications/like')
	])

	if (!res_follow.ok) error(res_follow.status, 'Failed to fetch notifications')
	if (!res_like.ok) error(res_like.status, 'Failed to fetch notifications')

	const follow_notifications: FollowNotification[] = await res_follow.json()
	const like_notifications: LikeNotification[] = await res_like.json()

	const total_number = follow_notifications.length + like_notifications.length
	const number_unread_follow = follow_notifications.filter((n) => !n.read).length
	const number_unread_like = like_notifications.filter((n) => !n.read).length
	const number_unread = number_unread_follow + number_unread_like

	if (number_unread > 0) {
		// mark as read, don't await on purpose
		event.fetch('/api/notifications', { method: 'PATCH' })
	}

	return { follow_notifications, like_notifications, number_unread, total_number }
}
