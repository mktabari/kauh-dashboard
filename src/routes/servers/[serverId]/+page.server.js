import { getServer, updateServer } from '$lib/modules/myServers.js';
import { getTags } from '$lib/modules/tags.js';
import { redirect } from '@sveltejs/kit';
export const load = async (serverLoadEvent) => {
	const { params } = serverLoadEvent;
	const { serverId } = params;

	return { server: getServer(serverId), allTags: getTags() };
};
export const actions = {
	updateServer: async ({ request, params }) => {
		const id = params.serverId;
		let {
			ip,
			brand,
			name,
			username,
			password,
			db,
			dbName,
			dbPort,
			dbUser,
			dbPassword,
			dbAlert,
			bkLogDir,
			drInstance,
			tags,
			dbSizeGroup,
			dbMountPoint
		} = Object.fromEntries(await request.formData());

		tags = JSON.parse(tags);

		updateServer({
			id,
			brand,
			name,
			ip,
			username,
			password,
			db,
			dbName,
			dbPort,
			dbUser,
			dbPassword,
			dbAlert,
			bkLogDir,
			drInstance,
			tags,
			dbSizeGroup,
			dbMountPoint
		});
		throw redirect(303, '/servers'); //important to use 303 to change to get
	}
};
