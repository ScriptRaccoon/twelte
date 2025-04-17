import { query } from '$lib/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

type Post = {
	id: number;
	user_id: number;
	user_handle: string;
	content: string;
	created_at: string;
	likes_count: number;
	liked_by_user: number; // 0 or 1
};

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	const user_id = user ? user.id : 0;

	const sql = `
    SELECT
        posts.id,
        users.id as user_id,
        users.handle as user_handle,
        posts.content,
        posts.created_at,
        COALESCE(COUNT(likes.id), 0) as likes_count,
        EXISTS (
            SELECT 1
            FROM likes
            WHERE likes.post_id = posts.id AND likes.user_id = ?
        ) as liked_by_user
    FROM
        posts
    INNER JOIN
        users ON posts.user_id = users.id
    LEFT JOIN
        likes on posts.id = likes.post_id
    WHERE
        posts.deleted = 0
        AND posts.parent_id IS NULL
    GROUP BY
        posts.id
    ORDER BY
        posts.created_at DESC
    LIMIT 10
	`;

	const { rows: posts, err } = await query<Post>(sql, [user_id]);

	if (err) error(500, 'Database error');

	return { posts };
};
