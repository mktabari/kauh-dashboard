import { getTagServers } from '$lib/modules/myServers.js';
import { json } from '@sveltejs/kit';
import { v4 as uuid } from 'uuid';
import oracledb from 'oracledb';
oracledb.initOracleClient();
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
export const GET = async ({ setHeaders }) => {
	setHeaders({ 'Cache-Control': 'public, max-age=300' });
	let dbs = getTagServers('DB');

	const checkDB = async (dbObj) => {
		let { ip, db, dbName, dbPort, dbUser, dbPassword } = dbObj;
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
	let myDBs = [];
	dbs.forEach((db) => myDBs.push(checkDB(db)));
	let mySshPromis = await Promise.all(myDBs);
	return json({ apiData: mySshPromis });
};
