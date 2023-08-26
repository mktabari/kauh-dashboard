import { Client } from 'ssh2';
import { getServerConfig } from '$lib/modules/myServers.js';
import { json } from '@sveltejs/kit';
export const GET = async (requwstEvent) => {
	const { params } = requwstEvent;
	const { serverId } = params;
	try {
		let { ip, username, password } = getServerConfig(serverId);
		const conn = new Client();
		let response = '';
		return json({
			apiData: await new Promise((resolve, reject) => {
				conn
					.on('ready', () => {
						//console.log('Client :: ready');
						conn.exec('sh ./ERPstartAPP.sh', (err, stream) => {
							if (err) reject(err);
							stream
								.on('close', (code, signal) => {
									//console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
									conn.end();
								})
								.on('data', (data) => {
									//console.log('STDOUT: ' + data);
									response += data;
								})
								.stderr.on('data', (data) => {
									//console.log('STDERR: ' + data);
								});
						});
					})
					.on('close', () => {
						//console.log(serverUpTime.toString('utf-8'));
						resolve(response.toString('utf-8'));
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
	} catch (error) {
		console.log(error);
		return json({});
	}
};
