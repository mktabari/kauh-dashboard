import { getTagServers } from '$lib/modules/myServers.js';
export const load = async ({ locals }) => {
	let veeam = getTagServers('VEEAM');
	return {
		user: locals.user,
		veeam
	};
};
