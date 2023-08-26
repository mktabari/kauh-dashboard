import { getServerConfig } from '$lib/modules/myServers.js';
import { json } from '@sveltejs/kit';
import ping from 'ping';
export const GET = async (requwstEvent) => {
	const { params } = requwstEvent;
	const { serverId } = params;
	let { ip } = getServerConfig(serverId);
	if (ip) {
		return json({
			isAlive: await new Promise((resolve) => {
				try {
					ping.sys.probe(ip, function (isAlive) {
						resolve(isAlive);
					});
				} catch (err) {
					reject(err);
				}
			})
		});
	}
	return json({ isAlive: 'No Ip Address' });
};
