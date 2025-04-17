import { query } from '$lib/db';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

// TODO: remove duplication with type from home page
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
	const me = event.locals.user;
	const me_id = me ? me.id : 0;

	type Profile = {
		id: number;
		display_name: string;
		handle: string;
		bio: string;
	};

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

	// TODO: remove duplication with query from home page
	const sql_posts = `
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
		AND posts.user_id = ?
    GROUP BY
        posts.id
    ORDER BY
        posts.created_at DESC
    LIMIT 10
	`;

	const { rows: posts, success: success_posts } = await query<Post>(sql_posts, [me_id, profile.id]);

	if (!success_posts) error(500, 'Database error');

	return { profile, posts };
};
