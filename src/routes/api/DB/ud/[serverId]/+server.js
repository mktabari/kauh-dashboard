import { json } from '@sveltejs/kit';
import { fork } from 'child_process';
import { fileURLToPath } from 'url';
import { getServerConfig } from '$lib/modules/myServers.js';
import { dbUpDown } from '$lib/db/index.js';
import oracledb from 'oracledb';
oracledb.initOracleClient();
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
if (process.argv[2] === 'child') {
	if (process.argv[4] === 'true') {
		const connection = await oracledb.getConnection({
			user: process.argv[6],
			password: process.argv[7],
			connectString: `${process.argv[3]}/${process.argv[5]}`
		});

		const result = await connection.execute(dbUpDown);
		const { rows } = result;
		await connection.close();
		process.send(rows);
	}
}
export const GET = async ({ params, setHeaders }) => {
	setHeaders({ 'Cache-Control': 'public, max-age=43200' });
	const { serverId } = params;
	let { ip, db, dbName, dbUser, dbPassword } = getServerConfig(serverId);
	return json({
		apiData: await new Promise((resolve) => {
			const child = fork(fileURLToPath(import.meta.url), [
				'child',
				ip,
				db,
				dbName,
				dbUser,
				dbPassword
			]);
			child.on('message', (data) => {
				resolve(data);
			});
		})
	});
};
