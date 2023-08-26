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
	// const { depends, fetch } = LoadEvent;
	// let sResponse = await fetch('/api/servers');
	// let uRespons = await fetch('/api/utilities');
	// if (!sResponse.ok || !uRespons) {
	// 	console.log('problem');
	// 	return;
	// } else {
	// 	let servers = await sResponse.json();
	// 	let utilities = await uRespons.json();

	// 	return { servers, utilities };
	// }

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
			dbSizeGroup
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
			dbSizeGroup
		});
		return { message: 'Done' };
	}
};
