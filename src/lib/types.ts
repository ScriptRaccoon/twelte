export type Post_DB = {
	id: number
	author_id: number
	author_handle: string
	content: string
	created_at: string
	likes_count: number
	liked_by_user: 0 | 1
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
	user_id: number
	display_name: string
	handle: string
	bio: string
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
