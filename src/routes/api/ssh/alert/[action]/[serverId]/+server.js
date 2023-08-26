import SSH2Promise from 'ssh2-promise';
import { getServerConfig } from '$lib/modules/myServers.js';
import { json } from '@sveltejs/kit';
export const GET = async (requwstEvent) => {
	const { params } = requwstEvent;
	const { serverId, action } = params;
	try {
		let { ip, username, password, dbAlert } = getServerConfig(serverId);
		if (dbAlert) {
			const sshconfig = {
				host: ip,
				username: username,
				password: password
			};
			const conn = new SSH2Promise(sshconfig);

			if (action === 'realTime') {
				const ac = new AbortController();
				const stream = new ReadableStream({
					start(controller) {
						conn.spawn(`tail -f ${dbAlert}`).then((socket) => {
							socket.on(
								'data',
								(data) => {
									controller.enqueue(data.toString('utf-8'));
								},
								{ signal: ac.signal }
							);
						});
					},
					cancel() {
						ac.abort();
						conn.close();
						controller.close();
					}
				});
				return new Response(stream, {
					headers: {
						'content-type': 'text/event-stream'
					}
				});
			} else {
				return json({
					apiData: await new Promise((resolve, reject) => {
						try {
							conn.exec(`tail -100 ${dbAlert}`).then((data) => {
								conn.close();
								resolve(data.toString('utf-8'));
							});
						} catch (error) {
							reject(error);
						}
					})
				});
			}
		} else {
			return json({
				apiData: `No Alert Log File
			
						`
			});
		}
	} catch (error) {
		console.log(error);
		return json({});
	}
};
