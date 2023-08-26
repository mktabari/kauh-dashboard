import { redirect } from '@sveltejs/kit';

export const actions = {
	login: async ({ request, cookies }) => {
		let { username, password } = Object.fromEntries(await request.formData());

		if (username === 'admin' && password === 'sys3211') {
			cookies.set('auth', 'admin', {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7 // 1 week
			});

			throw redirect(303, '/');
		}
	}
};
