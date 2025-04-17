import { query } from '$lib/db';
import { error, json } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

export const POST: RequestHandler = async (event) => {
	const user = event.locals.user;
	if (!user) error(401, 'Unauthorized');

	const post_id = event.params.post_id;

	const sql = 'DELETE FROM likes WHERE user_id = ? AND post_id = ?';

	const { err } = await query(sql, [user.id, post_id]);

	if (err) error(500, 'Database error');

	const sql_count = 'SELECT COUNT(*) as count FROM likes WHERE post_id = ?';

	const { rows, err: count_err } = await query<{ count: number }>(sql_count, [post_id]);
	if (count_err) error(500, 'Database error');

	if (rows.length === 0) error(404, 'Post not found');

	const count = rows[0].count;

	return json({ count });
};
