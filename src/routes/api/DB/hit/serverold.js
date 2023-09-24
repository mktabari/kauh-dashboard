import { getTagServers } from '$lib/modules/myServers.js';
import { json } from '@sveltejs/kit';
import { v4 as uuid } from 'uuid';
import { dbHitRatio } from '$lib/db/index.js';
import oracledb from 'oracledb';
oracledb.initOracleClient();
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
export const GET = async ({ setHeaders }) => {
	setHeaders({ 'Cache-Control': 'public, max-age=86400' });
	let dbs = getTagServers('DB');

	const checkDB = async (dbObj) => {
		let { ip, name, dbName, dbUser, dbPassword } = dbObj;
		try {
			const connection = await oracledb.getConnection({
				user: dbUser,
				password: dbPassword,
				connectString: `${ip}/${dbName}`
			});

			const customPromise = new Promise(async (resolve, reject) => {
				try {
					const result = await connection.execute(dbHitRatio);
					const { rows } = result;
					await connection.close();
					resolve(rows[0]);
				} catch (error) {
					await connection.close();
					resolve({ LR: '', PR: '', HR: '' });
				}
			});
			let { LR, PR, HR } = await customPromise;
			return { id: uuid(), name, dbName, LR, PR, HR };
		} catch (error) {
			return { id: uuid(), name, dbName, LR: '', PR: '', HR: '' };
		}
	};
	let myDBs = [];
	dbs.forEach((db) => myDBs.push(checkDB(db)));
	let mySshPromis = await Promise.all(myDBs);
	return json({ apiData: mySshPromis });
};
