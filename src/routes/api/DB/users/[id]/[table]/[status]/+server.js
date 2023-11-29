import { getServerConfig } from '$lib/modules/myServers.js';
import { json } from '@sveltejs/kit';
import oracledb from 'oracledb';
oracledb.initOracleClient();
oracledb.outFormat = oracledb.OUT_FORMAT_OBJECT;
export const GET = async (requwstEvent) => {
	const { params } = requwstEvent;
	const { id, table, status } = params;
	const column_name = table === 'sm_appl_user' ? 'appl_user_id' : 'practitioner_id';
	try {
		let { ip, db, dbName, dbPort, dbUser, dbPassword } = getServerConfig(
			'6484aa7e-6c5a-4b55-8047-b1cee1ae6b87'
			// 'b3409711-1208-4ac0-9f6e-95472d694425'
		);
		if (db === 'true') {
			const connection = await oracledb.getConnection({
				user: dbUser,
				password: dbPassword,
				connectString: `${ip}/${dbName}`
			});

			return json({
				status: await new Promise(async (resolve) => {
					try {
						// const result =
						await connection.execute(
							`update ${table} set eff_status='${status}' where ${column_name}='${id}'`
						);
						connection.commit();
						// console.log(result);
						// console.log(`update ${table} set eff_status='${status}' where ${column_name}='${id}'`);
						await connection.close();
						resolve('ok');
					} catch (error) {
						await connection.close();
						resolve('error');
					}
				})
			});
		}
	} catch (error) {
		console.log(error);
		return json({ status: 'error' });
	}
};
