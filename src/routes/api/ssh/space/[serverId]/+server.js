import { Client } from 'ssh2';
import { getServerConfig } from '$lib/modules/myServers.js';
import { json } from '@sveltejs/kit';
export const GET = async (requwstEvent) => {
	const { params } = requwstEvent;
	const { serverId } = params;
	try {
		let { ip, username, password } = getServerConfig(serverId);
		const conn = new Client();
		let pct = '';
		let pctArr = [];
		return json({
			apiData: await new Promise(async (resolve, reject) => {
				try {
					conn
						.on('ready', () => {
							//console.log('Client :: ready');
							conn.exec(
								`df -h|grep -v Filesystem|tr -s ' '|cut -d" " -f 2,3,4,5,6`,
								(err, stream) => {
									if (err) reject(err);
									stream
										.on('close', (code, signal) => {
											//console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
											conn.end();
										})
										.on('data', (data) => {
											//console.log('STDOUT: ' + data);
											pct = data;
										})
										.stderr.on('data', (data) => {
											//console.log('STDERR: ' + data);
										});
								}
							);
						})
						.on('close', () => {
							pctArr = pct.toString('utf-8').split('\n');
							pctArr.pop();
							pctArr = pctArr.map((line) => {
								return line.split(' ');
							});
							resolve(pctArr);
						})
						.connect({
							host: ip,
							port: 22,
							username: username,
							password: password,
							readyTimeout: 99999
						});
				} catch (error) {
					await connection.close();
					resolve([]);
				}
			})
		});
	} catch (error) {
		console.log(error);
		return json({});
	}
};
