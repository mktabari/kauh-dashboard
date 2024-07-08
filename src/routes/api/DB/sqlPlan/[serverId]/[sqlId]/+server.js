import { json } from '@sveltejs/kit';
import { fork } from 'child_process';
import { fileURLToPath } from 'url';
import { getServer } from '$lib/modules/myServers.js';
import oracledb from 'oracledb';
oracledb.initOracleClient();
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
if (process.argv[2] === 'child') {
	let db = getServer(process.argv[3]);
	const checkSql = async (dbObj, sqlId) => {
		let { ip, dbName, dbUser, dbPassword } = dbObj;
		try {
			const connection = await oracledb.getConnection({
				user: dbUser,
				password: dbPassword,
				connectString: `${ip}/${dbName}`
			});

			const customPromise = new Promise(async (resolve) => {
				try {
					const result =
						await connection.execute(`SELECT a.HASH_VALUE,a.ADDRESS,a.PLAN_HASH_VALUE,a.SQL_ID,a.ID, lpad(' ',7*(a.DEPTH-1))||a.OPERATION||' '||OPTIONs OPERATION , object_name,a.COST,a.CARDINALITY,a.CPU_COST,a.IO_COST,a.ACCESS_PREDICATES,a.FILTER_PREDICATES
                           FROM V$SQL_PLAN a 
                           WHERE 
                           a.SQL_ID='${sqlId}'`);
					const { rows } = result;
					await connection.close();
					resolve(rows);
				} catch (error) {
					await connection.close();
					resolve([]);
				}
			});
			return await customPromise;
		} catch (error) {
			return [];
		}
	};
	let sqlPlan = await checkSql(db, process.argv[4]);
	process.send(sqlPlan);
}
export const GET = async (requwstEvent) => {
	const { params } = requwstEvent;
	const { serverId, sqlId } = params;
	return json({
		apiData: await new Promise((resolve) => {
			const child = fork(fileURLToPath(import.meta.url), ['child', serverId, sqlId]);
			child.on('message', (data) => {
				resolve(data);
			});
		})
	});
};
