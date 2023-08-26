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
		let serverCpu;
		let getCpu;
		switch (brand) {
			case 'windows':
				getCpu = 'wmic cpu get  numberofcores';
				break;
			case 'linux':
				getCpu = 'grep -c ^processor /proc/cpuinfo';
				//getCpu = 'whoami';
				break;
			default:
				getCpu = 'prtdiag|grep on-line|wc -l';
		}
		try {
			return json({
				cpu: await new Promise((resolve, reject) => {
					conn.exec(getCpu).then((data) => {
						serverCpu = data.toString('utf-8');
						serverCpu = serverCpu.replace('\n', '');
						switch (brand) {
							case 'windows':
								serverCpu = serverCpu.split('\r');
								serverCpu = serverCpu[2].trim();
								conn.close();
								resolve(serverCpu);
								break;
							default:
								conn.close();
								resolve(serverCpu);
						}

						// serverCpu = data.toString('utf-8').trim().replace('\n', '').replace('\r', '');
					});
				})
			});
		} catch (error) {
			reject(error);
		}
	} catch (error) {
		console.log(error);
		return json({});
	}
};
