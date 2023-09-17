import { Client } from 'ssh2';
import { getServerConfig } from '$lib/modules/myServers.js';
import { json } from '@sveltejs/kit';
export const GET = async (requwstEvent) => {
	const { params, setHeaders } = requwstEvent;
	setHeaders({ 'Cache-Control': 'public, max-age=28800' });
	//8 hours
	const { serverId } = params;
	try {
		let { ip, username, password, bkLogDir } = getServerConfig(serverId);
		if (bkLogDir) {
			const conn = new Client();
			let bkLogFiles;

			return json({
				bkLogFiles: await new Promise((resolve, reject) => {
					conn
						.on('ready', () => {
							//console.log('Client :: ready');
							conn.exec(`ls -rt ${bkLogDir} | tail -7`, (err, stream) => {
								if (err) reject(err);
								stream
									.on('close', (code, signal) => {
										//console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
										conn.end();
									})
									.on('data', (data) => {
										//console.log('STDOUT: ' + data);
										bkLogFiles = data;
									})
									.stderr.on('data', (data) => {
										//console.log('STDERR: ' + data);
									});
							});
						})
						.on('close', () => {
							//console.log(serverUpTime.toString('utf-8'));
							resolve(bkLogFiles.toString('utf-8'));
							//.replace('\n', ''));
						})
						.connect({
							host: ip,
							port: 22,
							username: username,
							password: password,
							readyTimeout: 99999
						});
				})
			});
		} else {
			return json({ bkLogFiles: 'No Backup Log Directory' });
		}
	} catch (error) {
		console.log(error);
		return json({});
	}
};
