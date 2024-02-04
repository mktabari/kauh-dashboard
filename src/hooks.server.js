import { redirect } from '@sveltejs/kit';

export const handle = async ({ event, resolve }) => {
	const { cookies } = event;
	const user = cookies.get('auth');
	event.locals.user = user;
	// event.locals.user = 'admin';
	if (event.url.pathname !== '/login') {
		if (!event.locals.user || event.locals.user !== 'admin') {
			throw redirect(303, '/login');
		}
	}
	const response = await resolve(event);

	return response;
};
