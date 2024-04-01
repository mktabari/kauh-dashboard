import { redirect } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
	const { cookies } = event;
	const user = cookies.get('auth');
	event.locals.user = user;
	// event.locals.user = 'admin';
	if (event.url.pathname !== '/login') {
		if (!event.locals.user || event.locals.user !== 'admin') {
			throw redirect(303, '/login');
		} else {
			cookies.set('auth', 'admin', {
				path: '/',
				httpOnly: true,
				sameSite: 'strict',
				secure: process.env.NODE_ENV === 'production',
				maxAge: 60 * 60 * 24 * 7 // 1 week
			});
		}
	}
	const response = await resolve(event);

	return response;
};
