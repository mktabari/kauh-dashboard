import { json } from '@sveltejs/kit';
import SSH2Promise from 'ssh2-promise';
import { fork } from 'child_process';
import { fileURLToPath } from 'url';
import { getServerConfig } from '$lib/modules/myServers.js';
if (process.argv[2] === 'child') {
	const sshconfig = {
		host: process.argv[4],
		username: process.argv[5],
		password: process.argv[6]
	};
	const conn = new SSH2Promise(sshconfig);
	let getDateTime;
	switch (process.argv[3]) {
		case 'windows':
			getDateTime = 'powershell get-date -format "{dd/MM/yyyy HH:mm:ss}"';
			break;
		default:
			getDateTime = "date '+%d/%m/%Y %H:%M:%S'";
	}
	conn.exec(getDateTime).then((data) => {
		conn.close();
		process.send(data.toString('utf-8').replace('\n', '').replace('\r', ''));
		process.exit();
	});
}
export const GET = async (requwstEvent) => {
	const { params } = requwstEvent;
	const { serverId } = params;
	let { ip, brand, username, password } = getServerConfig(serverId);
	return json({
		UpTime: await new Promise((resolve, reject) => {
			const child = fork(fileURLToPath(import.meta.url), ['child', brand, ip, username, password]);
			child.on('message', (time) => {
				resolve(time);
			});
		})
	});
};
