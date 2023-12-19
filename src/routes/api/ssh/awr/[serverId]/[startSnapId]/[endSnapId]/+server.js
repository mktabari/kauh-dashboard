import SSH2Promise from 'ssh2-promise';
import { getServerConfig } from '$lib/modules/myServers.js';
import { json } from '@sveltejs/kit';
export const GET = async (requwstEvent) => {
	const { params } = requwstEvent;
	const { serverId, startSnapId, endSnapId } = params;
	try {
		let { ip, username, password, dbName, name } = getServerConfig(serverId);
		const sshconfig = {
			host: ip,
			username: username,
			password: password
		};
		const conn = new SSH2Promise(sshconfig);

		return json({
			name,
			dbName,
			report: await new Promise((resolve, reject) => {
				try {
					conn
						.exec(`su - oracle -c "/export/oracle/awr_generate.sh ${startSnapId} ${endSnapId}"`)
						.then((data) => {
							conn.exec(`cat /export/oracle/awr-rep.html`).then((data) => {
								conn.close();
								resolve(data.toString('utf-8').trim().replace('\n', '').replace('\r', ''));
							});
						});
				} catch (error) {
					reject(error);
				}
			})
		});
	} catch (error) {
		console.log(error);
		return json({});
	}
};
