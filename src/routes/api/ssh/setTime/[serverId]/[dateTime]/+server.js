import SSH2Promise from 'ssh2-promise';
import { getServerConfig } from '$lib/modules/myServers.js';
import { json } from '@sveltejs/kit';
export const GET = async (requwstEvent) => {
	const { params } = requwstEvent;
	const { serverId, dateTime } = params;
	try {
		let { ip, brand, username, password } = getServerConfig(serverId);
		const sshconfig = {
			host: ip,
			username: username,
			password: password
		};
		const conn = new SSH2Promise(sshconfig);
		let serverUpTime;
		let setDateTime;
		switch (brand) {
			case 'windows':
				setDateTime = `c:/Windows/System32/WindowsPowerShell/v1.0/powershell Set-Date -Date "${new Date().getFullYear()}-${
					dateTime[0]
				}${dateTime[1]}-${dateTime[2]}${dateTime[3]}T${dateTime[4]}${dateTime[5]}:${dateTime[6]}${
					dateTime[7]
				}"`;
				break;
			default:
				setDateTime = 'date ' + dateTime;
		}
		return json({
			UpTime: await new Promise((resolve, reject) => {
				try {
					conn.exec(setDateTime).then((data) => {
						serverUpTime = data;
						conn.close();
						resolve(serverUpTime.toString('utf-8').replace('\n', '').replace('\r', ''));
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
