import SSH2Promise from 'ssh2-promise';
import { getServerConfig } from '$lib/modules/myServers.js';
import { json } from '@sveltejs/kit';
export const GET = async (requwstEvent) => {
	const { params } = requwstEvent;
	const { serverId, action } = params;
	try {
		let { ip, username, password, drInstance } = getServerConfig(serverId);
		if (drInstance) {
			const sshconfig = {
				host: ip,
				username: username,
				password: password
			};
			const conn = new SSH2Promise(sshconfig);
			let drResponse;
			let drAction;
			switch (action) {
				case 'start':
					drAction = `su - oracle -c "echo EDIT DATABASE ${dbName} SET STATE=TRANSPORT-ON | /oracle/app/oracle/product/11.2.0/bin/dgmgrl / "`;
					break;
				case 'stop':
					drAction = `su - oracle -c "echo EDIT DATABASE ${dbName} SET STATE=TRANSPORT-OFF | /oracle/app/oracle/product/11.2.0/bin/dgmgrl / "`;
					break;
				default:
					drAction = `su - oracle -c "echo show database ${drInstance} | /oracle/app/oracle/product/11.2.0/bin/dgmgrl /"`;
			}
			return json({
				apiData: await new Promise((resolve, reject) => {
					try {
						conn.exec(drAction).then((data) => {
							drResponse = data.toString('utf-8');
							conn.close();
							resolve(drResponse);
						});
					} catch (error) {
						reject(error);
					}
				})
			});
		}
	} catch (error) {
		console.log(error);
		return json({});
	}
};
