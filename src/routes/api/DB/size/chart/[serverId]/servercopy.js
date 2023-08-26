import { getServerConfig } from '$lib/modules/myServers.js';
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
export const GET = async (requwstEvent) => {
	const { params } = requwstEvent;
	const { serverId } = params;

	let { dbName } = getServerConfig(serverId);
	if (dbName) {
		return json({
			apiData: await new Promise(async (resolve) => {
				try {
					const data = await prisma.DbSize.findMany({
						where: { dbName }
					});
					resolve(data);
				} catch (error) {
					console.log(error);
					return json({});
				}
			})
		});
	}
};
