import { getServerConfig } from '$lib/modules/myServers.js';
import { json } from '@sveltejs/kit';
import { prisma } from '$lib/server/prisma';
export const GET = async (requwstEvent) => {
	const { params } = requwstEvent;
	const { serverId, size } = params;
	try {
		let { dbName, dbSizeGroup } = getServerConfig(serverId);
		let dbSize = parseInt(size);

		if (dbName && dbSizeGroup) {
			let gte = new Date();
			gte.setDate(gte.getDate() - gte.getDay());
			gte.setHours(0, 0);
			if (
				!(await prisma.DbSize.count({
					where: {
						date: {
							gte
							// ,lte
						},
						dbName: { equals: dbName },
						dbSizeGroup: { equals: dbSizeGroup }
					}
				}))
			) {
				await prisma.DbSize.create({
					data: {
						dbName,
						size: dbSize,
						dbSizeGroup
					}
				});
				return json({
					status: 201
				});
			}
			return json({ status: 500, message: 'record exists for the month' });
		}
		return json({ status: 500, message: 'no database' });
	} catch (error) {
		console.log(error);
		return json({ status: 500, message: 'could not create record' });
	}
};
