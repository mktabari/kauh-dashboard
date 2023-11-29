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
	let command;
	switch (process.argv[3]) {
		case 'start':
			command = `D:\\product\\10.1.3.1\\OracleAS_1\\opmn\\bin\\opmnctl startall`;
			break;
		case 'stop':
			command = `D:\\product\\10.1.3.1\\OracleAS_1\\opmn\\bin\\opmnctl shutdown`;
			break;
		case 'reboot':
			command = `shutdown /r /c "Dashboard Reboot" /t 1`;
			break;
	}

	conn.exec(command).then((data) => {
		conn.close();
		process.send(data);
		process.exit();
	});
}
export const GET = async (requwstEvent) => {
	const { params } = requwstEvent;
	const { serverId, action } = params;
	let { ip, brand, username, password } = getServerConfig(serverId);
	if (brand === 'windows') {
		return json({
			status: await new Promise((resolve) => {
				const child = fork(fileURLToPath(import.meta.url), [
					'child',
					action,
					ip,
					username,
					password
				]);
				child.on('message', (data) => {
					resolve('ok');
				});
			})
		});
	} else {
		return json({ status: 'not windows' });
	}
};
