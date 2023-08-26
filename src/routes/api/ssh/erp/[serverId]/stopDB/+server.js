import SSH2Promise from 'ssh2-promise';
import { getServerConfig } from '$lib/modules/myServers.js';
import { json } from '@sveltejs/kit';
export const GET = async (requwstEvent) => {
	const { params } = requwstEvent;
	const { serverId } = params;
	try {
		let { ip, username, password } = getServerConfig(serverId);
		const sshconfig = {
			host: ip,
			username: username,
			password: password
		};
		const conn = new SSH2Promise(sshconfig);

		const stream = new ReadableStream({
			start(controller) {
				conn.spawn('sh ./ERPstopDB.sh').then((socket) => {
					// conn.spawn('cat test.txt').then((socket) => {
					socket
						.on('data', (data) => {
							controller.enqueue(data.toString('utf-8'));
						})
						.on('end', () => {
							controller.close();
							conn.close();
						});
				});
			}
		});

		return new Response(stream, {
			headers: {
				'content-type': 'text/event-stream'
			}
		});
	} catch (error) {
		console.log(error);
		return json({});
	}
};
