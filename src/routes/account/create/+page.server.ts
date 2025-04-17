import { query } from '$lib/db';
import { fail } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import type { Actions } from './$types';
import { email_schema, handle_schema, password_schema } from './schemas';
import { get_error_msg } from '$lib/utils';

export const actions: Actions = {
	register: async (event) => {
		const form_data = await event.request.formData();

		const email = form_data.get('email') as string | null;
		const password = form_data.get('password') as string | null;
		const handle = form_data.get('handle') as string | null;

		const { error: email_error } = email_schema.safeParse(email);
		if (email_error) return fail(400, { error: get_error_msg(email_error), email, handle });

		const { error: password_error } = password_schema.safeParse(password);
		if (password_error) return fail(400, { error: get_error_msg(password_error), email, handle });

		const { error: handle_error } = handle_schema.safeParse(handle);
		if (handle_error) return fail(400, { error: get_error_msg(handle_error), email, handle });

		const password_hash = await bcrypt.hash(password!, 10);

		const { rows, err: err_insert } = await query<{ id: number }>(
			'INSERT INTO USERS (email, password_hash, handle) VALUES (?, ?, ?) RETURNING id',
			[email, password_hash, handle]
		);

		if (err_insert) {
			if (err_insert.code === 'SQLITE_CONSTRAINT_UNIQUE') {
				return fail(400, { error: 'Email or handle already exists', email, handle });
			}

			return fail(500, { error: 'Database error', email, handle });
		}

		const id = rows[0].id;

		const { err: err_profile } = await query(
			'INSERT INTO profiles (user_id, display_name) VALUES (?, ?)',
			[id, handle]
		);

		if (err_profile) return fail(500, { error: 'Database error', email, handle });

		return { success: true, email, handle };
	}
};
