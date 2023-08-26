import { getServer, removeServer, updateServer } from '$lib/modules/myServers.js';
import { json } from '@sveltejs/kit';

export const GET = (requwstEvent) => {
	const { params } = requwstEvent;
	const { serverId } = params;
	return json(getServer(serverId));
};

export const DELETE = (requwstEvent) => {
	const { params } = requwstEvent;
	const { serverId } = params;
	const myServer = getServer(serverId);
	removeServer(myServer);
	return json(myServer);
};
export const PATCH = async (requestEvent) => {
	const { params, request } = requestEvent;
	const { serverId } = params;
	const myServer = getServer(serverId);
	const updatedServer = await request.json();
	updateServer({ id: serverId, ...updatedServer });
	return json(myServer);
};
