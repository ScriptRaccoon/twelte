import { query } from '$lib/db';
import { error, redirect } from '@sveltejs/kit';
import bcrypt from 'bcryptjs';
import type { Actions } from './$types';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '$env/static/private';
import type { PageServerLoad } from '../$types';

export const load: PageServerLoad = async (event) => {
	const user = event.locals.user;
	if (user) {
		redirect(302, '/account');
	}

	return {};
};

export const actions: Actions = {
	login: async (event) => {
		const form_data = await event.request.formData();
		const password = form_data.get('password') as string | null;
		const handle = form_data.get('handle') as string | null;

		if (!password) error(400, 'Password is required');
		if (!handle) error(400, 'Handle is required');

		// TODO: add proper validation

		type Credentials = { id: number; password_hash: string };

		const { rows, err } = await query<Credentials>(
			'SELECT id, password_hash FROM users WHERE handle = ?',
			[handle]
		);

		// TODO: improve error display

		if (err) {
			error(500, 'Database error');
		}

		if (rows.length === 0) {
			error(401, 'Invalid credentials');
		}

		const user = rows[0];

		const password_is_correct = await bcrypt.compare(password, user.password_hash);

		if (!password_is_correct) {
			error(401, 'Invalid credentials');
		}

		const token = jwt.sign({ id: user.id }, JWT_SECRET);

		event.cookies.set('jwt', token, {
			httpOnly: true,
			path: '/',
			maxAge: 60 * 60 * 24 * 7, // 1 week
			sameSite: 'strict',
			secure: true
		});

		redirect(302, '/account');
	}
};
