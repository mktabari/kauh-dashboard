import { getTagServers } from '$lib/modules/myServers.js';
export const load = async () => {
	let servers = getTagServers('DB');
	let lockServers = getTagServers('Locks');

	return {
		servers,
		lockServers
	};
};
