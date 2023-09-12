import { getTagServers } from '$lib/modules/myServers.js';
export const load = () => {
	let UDServers = getTagServers('UD');
	let WServers = getTagServers('Waits');
	return {
		UDServers,
		WServers
	};
};
