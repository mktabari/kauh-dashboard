import { getServerConfig } from '$lib/modules/myServers.js';
import { json } from '@sveltejs/kit';
import { dbTablespace } from '$lib/db/index.js';
import oracledb from 'oracledb';
oracledb.initOracleClient();
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
export const GET = async (requwstEvent) => {
	const { params } = requwstEvent;
	const { serverId } = params;
	try {
		let { ip, db, dbName, dbPort, dbUser, dbPassword } = getServerConfig(serverId);
		if (db === 'true') {
			const connection = await oracledb.getConnection({
				user: dbUser,
				password: dbPassword,
				connectString: `${ip}/${dbName}`
			});

			return json({
				apiData: await new Promise(async (resolve, reject) => {
					const result = await connection.execute(dbTablespace.replace('server_id', serverId));
					const { rows } = result;
					await connection.close();
					resolve(rows);
				})
			});
		}
	} catch (error) {
		console.log(error);
		return json({});
	}
};
