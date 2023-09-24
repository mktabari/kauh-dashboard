import { json } from '@sveltejs/kit';
import { v4 as uuid } from 'uuid';
import { fork } from 'child_process';
import { fileURLToPath } from 'url';
import { getTagServers } from '$lib/modules/myServers.js';
import { dbTrans } from '$lib/db/index.js';
import oracledb from 'oracledb';
oracledb.initOracleClient();
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
if (process.argv[2] === 'child') {
	let dbs = getTagServers('DB');
	const checkDB = async (dbObj) => {
		let { ip, name, dbName, dbUser, dbPassword } = dbObj;
		try {
			const connection = await oracledb.getConnection({
				user: dbUser,
				password: dbPassword,
				connectString: `${ip}/${dbName}`
			});

			const customPromise = new Promise(async (resolve) => {
				try {
					const result = await connection.execute(dbTrans);
					const { rows } = result;
					await connection.close();
					resolve(rows);
				} catch (error) {
					await connection.close();
					resolve([]);
				}
			});
			return { id: uuid(), name, dbName, rows: await customPromise };
		} catch (error) {
			return { id: uuid(), name, dbName, rows: [] };
		}
	};
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
