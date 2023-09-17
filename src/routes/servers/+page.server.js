import { getServers, addServer } from '$lib/modules/myServers.js';
import { getTags } from '$lib/modules/tags.js';
import { error } from '@sveltejs/kit';
// export const load = async (serverLoadEvent) => {
// 	const servers = () => {
// 		let config = getServers();
// 		if (config === undefined) {
// 			console.log('config === undefined');
// 			throw error(404, 'No Configuration file');
// 		} else {
// 			return config;
// 		}
// 	};
// 	console.log({ servers: servers() });
// 	return { servers: servers() };
// };
export const load = async () => {
	return { servers: getServers(), allTags: getTags() };
};

export const actions = {
	createServer: async ({ request }) => {
		let {
			brand,
			name,
			ip,
			username,
			password,
			db,
			dbName,
			dbport,
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
		addServer({
			brand,
			name,
			ip,
			username,
			password,
			db,
			dbName,
			dbport,
			dbUser,
			dbPassword,
			dbAlert,
			bkLogDir,
			drInstance,
			tags,
			dbSizeGroup,
			dbMountPoint
		});
		return { message: 'Done' };
	}
};
