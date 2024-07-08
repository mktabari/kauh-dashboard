import { getTagServers } from '$lib/modules/myServers.js';
export const load = async () => {
	let lockServers = getTagServers('Locks');
	return {
		lockServers
	};
};
