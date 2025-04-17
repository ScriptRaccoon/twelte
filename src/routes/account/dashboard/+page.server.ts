import { error, redirect } from '@sveltejs/kit';
import type { Actions, PageServerLoad } from '../$types';
import { db, query } from '$lib/db';
import { bio_schema, display_name_schema, email_schema } from '$lib/schemas';
import { fail } from '@sveltejs/kit';
import { get_error_msg } from '$lib/utils';
import { LibsqlError } from '@libsql/client';

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (!user) redirect(302, '/account/login');

	type AccountData = { email: string; handle: string; display_name: string; bio: string };

	const sql = `
	SELECT email, handle, display_name, bio
	FROM users
	INNER JOIN profiles ON users.id = profiles.user_id
	WHERE users.id = ?
	`;

	const { rows, err } = await query<AccountData>(sql, [user.id]);

	if (err) error(500, 'Database error');

	if (!rows.length) error(404, 'Account not found');

	const account = rows[0];

	const code = event.url.searchParams.get('code');
	const message = code === 'updated' ? 'Profile updated' : null;

	return { account, message };
};

export const actions: Actions = {
	logout: async (event) => {
		event.cookies.delete('jwt', { path: '/' });
		throw redirect(302, '/account/login');
	},

	edit: async (event) => {
		const user = event.locals.user;
		if (!user) redirect(302, '/account/login');

		const form_data = await event.request.formData();

		const email = form_data.get('email') as string | null;
		const display_name = form_data.get('display_name') as string | null;
		const bio = (form_data.get('bio') ?? '') as string;

		const { error: email_error } = email_schema.safeParse(email);
		if (email_error) return fail(400, { error: get_error_msg(email_error) });

		const { error: display_name_error } = display_name_schema.safeParse(display_name);
		if (display_name_error) return fail(400, { error: get_error_msg(display_name_error) });

		const { error: bio_error } = bio_schema.safeParse(bio);
		if (bio_error) return fail(400, { error: get_error_msg(bio_error) });

		const sql_email = 'UPDATE users SET email = ? WHERE id = ?';
		const sql_profile = 'UPDATE profiles SET display_name = ?, bio = ? WHERE user_id = ?';

		try {
			await db.batch([
				{ sql: sql_email, args: [email, user.id] },
				{ sql: sql_profile, args: [display_name, bio, user.id] }
			]);
		} catch (err) {
			if (err instanceof LibsqlError && err.code === 'SQLITE_CONSTRAINT_UNIQUE') {
				return fail(400, { error: 'Email already exists' });
			}

			return fail(500, { error: 'Database error' });
		}

		redirect(302, '/account/dashboard?code=updated');
	},

	delete: async (event) => {
		const user = event.locals.user;
		if (!user) redirect(302, '/account/login');

		const sql = 'DELETE FROM users WHERE id = ?';
		const { err } = await query(sql, [user.id]);

		if (err) return fail(500, { error: 'Database error' });

		event.cookies.delete('jwt', { path: '/' });

		throw redirect(302, '/');
	}
};
