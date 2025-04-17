import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from './$types';
import { db, query } from '$lib/db';

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (!user) {
		redirect(302, '/account/login');
	}

	type AccountData = { email: string; handle: string; display_name: string; bio: string };

	const sql = `
	SELECT email, handle, display_name, bio
	FROM users
	INNER JOIN profiles ON users.id = profiles.user_id
	WHERE users.id = ?
	`;

	const { rows, err } = await query<AccountData>(sql, [user.id]);

	if (err) {
		error(500, 'Database error:');
	}

	if (!rows.length) {
		error(404, 'Profile not found');
	}

	const account = rows[0];

	return account;
};

export const actions: Actions = {
	logout: async (event) => {
		event.cookies.delete('jwt', { path: '/' });
		throw redirect(302, '/account/login');
	},

	edit: async (event) => {
		const form_data = await event.request.formData();
		const email = form_data.get('email') as string | null;
		const display_name = form_data.get('display_name') as string | null;
		const bio = (form_data.get('bio') ?? '') as string;

		// TODO: add validation

		const user = event.locals.user;
		if (!user) error(401, 'Unauthorized');

		const sql_email = `
		UPDATE users
		SET email = ?
		WHERE id = ?
		`;

		const sql_profile = `
		UPDATE profiles
		SET display_name = ?, bio = ?
		WHERE user_id = ?
		`;

		// TODO: error handling
		await db.batch([
			{ sql: sql_email, args: [email, user.id] },
			{ sql: sql_profile, args: [display_name, bio, user.id] }
		]);

		redirect(302, '/account');
	},

	delete: async (event) => {
		const user = event.locals.user;
		if (!user) error(401, 'Unauthorized');

		const sql = 'DELETE FROM users WHERE id = ?';
		const { err } = await query(sql, [user.id]);

		if (err) {
			error(500, 'Database error');
		}

		event.cookies.delete('jwt', { path: '/' });

		throw redirect(302, '/');
	}
};
