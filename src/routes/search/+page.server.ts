import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { type Post } from '$lib/types'

export const load: PageServerLoad = async (event) => {
	const limit = 20

	const q = event.url.searchParams.get('q')
	if (!q) return { q: '', limit, posts: null }

	const res = await event.fetch(`/api/posts/search?q=${q}&limit=${limit}`)
	if (!res.ok) error(res.status, 'Failed to fetch posts')

	const posts: Post[] = await res.json()

	return { q, limit, posts }
}
