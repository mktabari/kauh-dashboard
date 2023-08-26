import SSH2Promise from 'ssh2-promise';
import { getServerConfig } from './myServers.js';

process.on('message', async (serverId) => {
	let { ip, brand, username, password } = getServerConfig(serverId);
	const sshconfig = {
		host: ip,
		username: username,
		password: password
	};
	const conn = new SSH2Promise(sshconfig);
	let getDateTime;
	switch (brand) {
		case 'windows':
			getDateTime = 'powershell get-date -format "{dd/MM/yyyy HH:mm:ss}"';
			break;
		default:
			getDateTime = "date '+%d/%m/%Y %H:%M:%S'";
	}
	await conn.exec(getDateTime).then((data) => {
		conn.close();
		process.send(data.toString('utf-8').replace('\n', '').replace('\r', ''));
		process.exit();
	});
});
