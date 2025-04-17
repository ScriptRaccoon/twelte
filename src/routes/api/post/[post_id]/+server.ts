import { query } from '$lib/db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './delete/$types';

export const DELETE: RequestHandler = async (event) => {
	const user = event.locals.user;
	if (!user) error(401, 'Unauthorized');

	const post_id = event.params.post_id;

	const sql = 'UPDATE POSTS SET deleted = 1 WHERE id = ? AND user_id = ?';

	const { err } = await query(sql, [post_id, user.id]);

	if (err) error(500, 'Database error');

	return json({ success: true });
};
