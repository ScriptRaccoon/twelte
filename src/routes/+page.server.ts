import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import type { Post } from '$lib/types'

export const load: PageServerLoad = async (event) => {
	const limit = 20

	const filter = event.url.searchParams.get('filter') ?? 'all'

	const res = await event.fetch(`/api/posts?filter=${filter}&limit=${limit}`)
	if (!res.ok) error(res.status, 'Failed to fetch posts')

	const posts: Post[] = await res.json()

	return { posts, limit, filter }
}
