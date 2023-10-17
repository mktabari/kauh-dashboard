import { json } from '@sveltejs/kit';
import { v4 as uuid } from 'uuid';
import { fork } from 'child_process';
import { fileURLToPath } from 'url';
import { getTagServers } from '$lib/modules/myServers.js';
import oracledb from 'oracledb';
oracledb.initOracleClient();
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
if (process.argv[2] === 'child') {
	const checkDB = async (dbObj) => {
		let { ip, dbName, dbUser, dbPassword } = dbObj;
		try {
			const connection = await oracledb.getConnection({
				user: dbUser,
				password: dbPassword,
				connectString: `${ip}/${dbName}`
			});

			const customPromise = new Promise(async (resolve, reject) => {
				try {
					const result = await connection.execute('select status,INSTANCE_NAME from V$instance');
					const { rows } = result;
					await connection.close();
					resolve(rows[0]);
				} catch (error) {
					await connection.close();
					resolve({ INSTANCE_NAME: '', STATUS: 'DOWN' });
				}
			});
			let { INSTANCE_NAME, STATUS } = await customPromise;
			return { id: uuid(), dbName, INSTANCE_NAME, STATUS };
		} catch (error) {
			return { id: uuid(), dbName, INSTANCE_NAME: '', STATUS: 'DOWN' };
		}
	};
	let dbs = getTagServers('DB');
	let myDBs = dbs.map((db) => checkDB(db));
	let mySshPromis = await Promise.all(myDBs);
	process.send(mySshPromis);
}
export const GET = async ({ setHeaders }) => {
	setHeaders({ 'Cache-Control': 'public, max-age=300' });
	return json({
		apiData: await new Promise((resolve) => {
			const child = fork(fileURLToPath(import.meta.url), ['child']);
			child.on('message', (data) => {
				resolve(data);
			});
		})
	});
};
