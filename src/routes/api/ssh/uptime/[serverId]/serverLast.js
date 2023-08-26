import SSH2Promise from 'ssh2-promise';
import { getServerConfig } from '$lib/modules/myServers.js';
import { json } from '@sveltejs/kit';
export const GET = async (requwstEvent) => {
	const { params } = requwstEvent;
	const { serverId } = params;
	try {
		let { ip, brand, username, password } = getServerConfig(serverId);
		const sshconfig = {
			host: ip,
			username: username,
			password: password
		};
		const conn = new SSH2Promise(sshconfig);
		let serverUpTime;
		let getDateTime;
		switch (brand) {
			case 'windows':
				getDateTime = 'powershell get-date -format "{dd/MM/yyyy HH:mm:ss}"';
				break;
			default:
				getDateTime = "date '+%d/%m/%Y %H:%M:%S'";
		}
		return json({
			UpTime: await new Promise((resolve, reject) => {
				try {
					conn.exec(getDateTime).then((data) => {
						serverUpTime = data;
						resolve(serverUpTime.toString('utf-8').replace('\n', '').replace('\r', ''));
						conn.close();
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
