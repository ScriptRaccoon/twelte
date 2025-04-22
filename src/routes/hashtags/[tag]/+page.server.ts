import { error } from '@sveltejs/kit'

import type { PageServerLoad } from './$types'
import type { Post } from '$lib/types'

export const load: PageServerLoad = async (event) => {
	const tag = event.params.tag

	const res = await event.fetch(`/api/posts/hashtag/${tag}`)
	if (!res.ok) error(res.status, 'Failed to fetch posts')

	const posts: Post[] = await res.json()

	return { posts, tag }
}
