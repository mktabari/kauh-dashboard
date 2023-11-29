import { getServerConfig } from '$lib/modules/myServers.js';
import { json } from '@sveltejs/kit';
// import { dbTablespace } from '$lib/db/index.js';
import oracledb from 'oracledb';
oracledb.initOracleClient();
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
export const GET = async (requwstEvent) => {
	const { params } = requwstEvent;
	const { serverId, tsName } = params;
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
					const result = await connection.execute(
						'select FILE_ID+1 id, file_name fileName from dba_data_files where FILE_ID = (select max(FILE_ID) from dba_data_files)'
					);
					const { rows } = result;
					let fileId = rows[0].ID;
					let fileName = rows[0].FILENAME;
					// console.log(fileId, fileName);
					let pathArray = fileName.split('/');
					let i = 1;
					let path = '';
					while (i < pathArray.length - 1) {
						path = path + '/' + pathArray[i];
						i++;
					}
					try {
						await connection.execute(
							`ALTER TABLESPACE ${tsName} ADD DATAFILE '${path}/${tsName}_${fileId}.dbf' SIZE 1024M autoextend on`
						);
						await connection.close();
						resolve('ok');
					} catch (error) {
						// console.log(
						// 	`ALTER TABLESPACE ${tsName} ADD DATAFILE '${path}/${tsName}_${fileId}.dbf' SIZE 1024M autoextend on`
						// );
						await connection.close();
						resolve('error');
					}
				})
			});
		}
	} catch (error) {
		console.log(error);
		return json({});
	}
};
