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
		let serverMem;
		let getMem;
		switch (brand) {
			case 'windows':
				getMem = 'systeminfo | findstr /C:"Total Physical Memory"';
				break;
			case 'linux':
				getMem = 'grep MemTotal /proc/meminfo';
				break;
			default:
				getMem = 'prtconf | grep Mem';
		}
		return json({
			mem: await new Promise((resolve, reject) => {
				try {
					conn.exec(getMem).then((data) => {
						serverMem = data.toString('utf-8').trim().replace('\n', '').replace('\r', '');
						switch (brand) {
							case 'windows':
								serverMem = serverMem.split(' ');
								serverMem = serverMem[serverMem.length - 2];
								conn.close();
								resolve(
									(parseInt(serverMem.replace(',', '')) / 1024).toFixed(2).replace('.00', '')
								);

								break;
							case 'linux':
								serverMem = serverMem.split(' ');
								serverMem = serverMem[serverMem.length - 2];
								conn.close();
								resolve((parseInt(serverMem) / 1024 / 1024).toFixed(2).replace('.00', ''));

								break;
							default:
								serverMem = serverMem.split(' ')[2];
								conn.close();

								resolve((serverMem / 1024).toFixed(2).replace('.00', ''));
						}
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
