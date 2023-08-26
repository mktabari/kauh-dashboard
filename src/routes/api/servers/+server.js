import { getServers, getServer, removeServer, updateServer } from '$lib/modules/myServers.js';
import { json } from '@sveltejs/kit';

export const GET = () => {
	return json(getServers());
};
