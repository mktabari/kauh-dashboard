import { getServerConfig } from '$lib/modules/myServers.js';
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
export const GET = async (requwstEvent) => {
	const { params, setHeaders } = requwstEvent;
	setHeaders({ 'Cache-Control': 'public, max-age=86400' });
	const { serverId } = params;
	let { dbName, dbSizeGroup } = getServerConfig(serverId);
	if (dbName && dbSizeGroup) {
		return json({
			apiData: await prisma.DbSize.findMany({
				where: { dbName, dbSizeGroup }
			})
		});
	}
};
