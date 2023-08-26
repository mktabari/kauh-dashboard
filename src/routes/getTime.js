import SSH2Promise from 'ssh2-promise';
import { getServerConfig } from '$lib/modules/myServers.js';

process.on('message', (serverId) => {
	const result = getTime(serverId);
	process.send(result);
});
const getTime = async (serverId) => {
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
		try {
			await conn.exec(getDateTime).then((data) => {
				serverUpTime = data;
				conn.close();
				return serverUpTime.toString('utf-8').replace('\n', '').replace('\r', '');
			});
		} catch (error) {
			return -1;
		}
	} catch (error) {
		console.log(error);
		return -1;
	}
};
