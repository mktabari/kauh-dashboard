import SSH2Promise from 'ssh2-promise';
import { getServerConfig } from '$lib/modules/myServers.js';
import { json } from '@sveltejs/kit';
export const GET = async (requwstEvent) => {
	const { params } = requwstEvent;
	const { serverId } = params;
	try {
		let { ip, username, password } = getServerConfig(serverId);
		const sshconfig = {
			host: ip,
			username: username,
			password: password
		};
		const conn = new SSH2Promise(sshconfig);

		await conn
			.exec(
				`tail -50 /u01/PROD/db/9.2.0/admin/PROD_erp-srv/bdump/alert_PROD.log | grep "Active call for process"|awk '{ print $5}'`
			)
			.then((data) => {
				let processlist = data.toString('utf-8').split(/\r?\n/).join(' ');

				if (processlist) {
					conn.exec(`kill -9 ${processlist}`);
					// console.log(processlist);
				}
			});

		conn.close();
		return json({
			apiData: 'done'
		});
	} catch (error) {
		console.log(error);
		return json({});
	}
};
