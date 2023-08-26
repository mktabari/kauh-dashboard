import { getTagServers } from '$lib/modules/myServers.js';
export const load = async () => {
	let servers = getTagServers('Space');

	return { servers };
};
