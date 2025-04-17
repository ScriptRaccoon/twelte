import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Post } from '$lib/types';

export const load: PageServerLoad = async (event) => {
	const res = await event.fetch('/api/posts');
	if (!res.ok) error(res.status, 'Failed to fetch posts');
	const posts: Post[] = await res.json();
	return { posts };
};
