export type UserLocals = {
	id: number
	handle: string
}

export type Post_DB = {
	id: number
	author_id: number
	author_name: string
	author_handle: string
	author_avatar_url: string | null
	content: string
	created_at: string
	likes_count: number
	liked_by_user: 0 | 1
	replies_count: number
	parent_id: number | null
}

export type Post = Omit<Post_DB, 'liked_by_user'> & {
	liked_by_user: boolean
}

export function transform_post(post: Post_DB): Post {
	return {
		...post,
		liked_by_user: Boolean(post.liked_by_user)
	}
}

export type Profile_DB = {
	id: number
	name: string
	handle: string
	bio: string
	avatar_url: string | null
	followers_count: number
	following_count: number
	following: 0 | 1
	followed: 0 | 1
	posts_count: number
}

export type Profile = Omit<Profile_DB, 'following' | 'followed'> & {
	following: boolean
	followed: boolean
}

export function transform_profile(profile: Profile_DB): Profile {
	return {
		...profile,
		following: Boolean(profile.following),
		followed: Boolean(profile.followed)
	}
}

export type AccountData_DB = {
	email: string
	handle: string
	name: string
	bio: string
	avatar_url: string | null
	like_notifications_enabled: number
	follow_notifications_enabled: number
	reply_notifications_enabled: number
}

export type AccountData = Omit<
	AccountData_DB,
	'like_notifications_enabled' | 'follow_notifications_enabled' | 'reply_notifications_enabled'
> & {
	like_notifications_enabled: boolean
	follow_notifications_enabled: boolean
	reply_notifications_enabled: boolean
}

export function transform_account_data(account: AccountData_DB): AccountData {
	return {
		...account,
		like_notifications_enabled: Boolean(account.like_notifications_enabled),
		follow_notifications_enabled: Boolean(account.follow_notifications_enabled),
		reply_notifications_enabled: Boolean(account.reply_notifications_enabled)
	}
}

export type FollowNotification_DB = {
	id: number
	name: string
	handle: string
	read: number
}

export type FollowNotification = Omit<FollowNotification_DB, 'read'> & {
	read: boolean
}

export function transform_follow_notification(
	notification: FollowNotification_DB
): FollowNotification {
	return {
		...notification,
		read: Boolean(notification.read)
	}
}

export type LikeNotification_DB = {
	id: number
	read: number
	name: string
	handle: string
	post_id: number
	content: string
}

export type LikeNotification = Omit<LikeNotification_DB, 'read'> & {
	read: boolean
}
export function transform_like_notification(notification: LikeNotification_DB): LikeNotification {
	return {
		...notification,
		read: Boolean(notification.read)
	}
}

export type ReplyNotification_DB = {
	id: number
	read: number
	name: string
	handle: string
	content: string
	parent_id: number
}

export type ReplyNotification = Omit<ReplyNotification_DB, 'read'> & {
	read: boolean
}

export function transform_reply_notification(
	notification: ReplyNotification_DB
): ReplyNotification {
	return {
		...notification,
		read: Boolean(notification.read)
	}
}
