import { Client } from 'ssh2';
import { getServerConfig } from '$lib/modules/myServers.js';
import { json } from '@sveltejs/kit';
export const GET = async (requwstEvent) => {
	const { params, setHeaders } = requwstEvent;
	setHeaders({ 'Cache-Control': 'public, max-age=28800' });
	//8 hours
	const { serverId, logFile } = params;
	try {
		let { ip, username, password, bkLogDir } = getServerConfig(serverId);
		if (bkLogDir) {
			const conn = new Client();
			let bkLogFile = '';

			return json({
				bkLogFile: await new Promise((resolve, reject) => {
					conn
						.on('ready', () => {
							//console.log('Client :: ready');
							conn.exec(`cat ${bkLogDir}/${logFile}`, (err, stream) => {
								if (err) reject(err);
								stream
									.on('close', (code, signal) => {
										//console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
										conn.end();
									})
									.on('data', (data) => {
										//console.log('STDOUT: ' + data);
										bkLogFile = bkLogFile + data;
									})
									.stderr.on('data', (data) => {
										//console.log('STDERR: ' + data);
									});
							});
						})
						.on('close', () => {
							//console.log(serverUpTime.toString('utf-8'));
							resolve(bkLogFile.toString('utf-8'));
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
			return json({ bkLogFile: 'No Backup Log Directory' });
		}
	} catch (error) {
		console.log(error);
		return json({});
	}
};
