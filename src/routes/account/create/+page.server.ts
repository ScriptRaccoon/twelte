import { query } from '$lib/db';
import { error } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import type { Actions } from './$types';

export const actions: Actions = {
	register: async (event) => {
		const form_data = await event.request.formData();
		const email = form_data.get('email') as string | null;
		const password = form_data.get('password') as string | null;
		const handle = form_data.get('handle') as string | null;

		if (!email) error(400, 'Email is required');
		if (!password) error(400, 'Password is required');
		if (!handle) error(400, 'Handle is required');

		// TODO: add proper validation

		const password_hash = await bcrypt.hash(password, 10);

		const { rows, err } = await query<{ id: number }>(
			`INSERT INTO USERS (email, password_hash, handle) VALUES (?, ?, ?) RETURNING id`,
			[email, password_hash, handle]
		);

		if (err) {
			// TODO: display error for user in better way
			error(500, 'Database error');
		}

		const id = rows[0].id;

		const { err: err_profile } = await query(
			'INSERT INTO profiles (user_id, display_name) VALUES (?, ?)',
			[id, handle]
		);

		if (err_profile) {
			error(500, 'Database error');
		}

		return { success: true };
	}
};
