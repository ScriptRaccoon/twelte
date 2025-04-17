import { query } from '$lib/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

type Post = {
	id: number;
	user_id: number;
	user_handle: string;
	content: string;
	created_at: string;
};

export const load: PageServerLoad = async (event) => {
	const sql = `
    SELECT
        posts.id,
        users.id as user_id,
        users.handle as user_handle,
        posts.content,
        posts.created_at
    FROM
        posts
    INNER JOIN
        users ON posts.user_id = users.id
    WHERE
        posts.deleted = 0
        AND posts.parent_id IS NULL
    ORDER BY
        posts.created_at DESC
    LIMIT 10
    `;

	const { rows: posts, err } = await query<Post>(sql);

	if (err) error(500, 'Database error');

	return { posts };
};
