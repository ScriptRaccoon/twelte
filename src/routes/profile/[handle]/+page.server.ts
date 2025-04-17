import { query } from '$lib/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';
import type { Post } from '$lib/types';

type Profile = {
	id: number;
	display_name: string;
	handle: string;
	bio: string;
};

export const load: PageServerLoad = async (event) => {
	const limit = Number(event.url.searchParams.get('limit') ?? '10');

	const handle = event.params.handle;

	const sql_profile = `
    SELECT
        users.id as id,
        display_name,
        handle,
        bio
    FROM
        users
    INNER JOIN
        profiles ON users.id = profiles.user_id
    WHERE
        users.handle = ?
    `;

	const { rows: profiles, success: success_profile } = await query<Profile>(sql_profile, [handle]);

	if (!success_profile) error(500, 'Database error');
	if (!profiles.length) error(404, 'User not found');

	const profile = profiles[0];

	const res = await event.fetch(`/api/posts?user_id=${profile.id}&limit=${limit}`);
	if (!res.ok) error(res.status, 'Failed to fetch posts');

	const posts: Post[] = await res.json();

	return { profile, posts, limit };
};
