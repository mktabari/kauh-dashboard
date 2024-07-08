import { redirect } from '@sveltejs/kit';

export const GET = async ({ cookies }) => {
	//cookies.delete('auth');

	cookies.set('auth', 'admin', { expires: Date.now() });
	throw redirect(303, '/');
};
