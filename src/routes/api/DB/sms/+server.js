import { getServerConfig } from '$lib/modules/myServers.js';
import { json } from '@sveltejs/kit';
import { smsHeat } from '$lib/db/index.js';
import oracledb from 'oracledb';
oracledb.initOracleClient();
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
export const GET = async (requwstEvent) => {
	const { setHeaders } = requwstEvent;
	setHeaders({ 'Cache-Control': 'public, max-age=43200' });

	try {
		let { ip, db, dbName, dbPort, dbUser, dbPassword } = getServerConfig(
			'6484aa7e-6c5a-4b55-8047-b1cee1ae6b87'
		);
		if (db === 'true') {
			const connection = await oracledb.getConnection({
				user: dbUser,
				password: dbPassword,
				connectString: `${ip}/${dbName}`
			});

			return json({
				apiData: await new Promise(async (resolve, reject) => {
					const result = await connection.execute(smsHeat);
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
