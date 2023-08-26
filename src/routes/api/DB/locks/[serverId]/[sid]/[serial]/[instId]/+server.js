import { getServerConfig } from '$lib/modules/myServers.js';
import { json } from '@sveltejs/kit';
import oracledb from 'oracledb';
oracledb.initOracleClient();
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
export const GET = async (requwstEvent) => {
	const { params } = requwstEvent;
	const { serverId, sid, serial, instId } = params;
	try {
		let { ip, db, dbName, dbPort, dbUser, dbPassword } = getServerConfig(serverId);
		if (db === 'true') {
			const killCommand = `ALTER SYSTEM KILL SESSION '${sid},${serial},@${instId}' IMMEDIATE`;

			const connection = await oracledb.getConnection({
				user: dbUser,
				password: dbPassword,
				connectString: `${ip}/${dbName}`
			});

			return json({
				apiData: await new Promise(async (resolve, reject) => {
					await connection.execute(killCommand);
					await connection.close();
					resolve('ok');
				})
			});
		}
	} catch (error) {
		console.log(error);
		return json({});
	}
};
