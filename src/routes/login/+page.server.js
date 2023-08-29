import { redirect } from '@sveltejs/kit';
import { env } from '$env/dynamic/private';
export const actions = {
	login: async ({ request, cookies }) => {
		let { username, password } = Object.fromEntries(await request.formData());

		if (username === 'admin' && password === env.SECRET_ADMIN_PASSWORD) {
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
