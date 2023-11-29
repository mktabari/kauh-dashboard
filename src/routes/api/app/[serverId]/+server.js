import { json } from '@sveltejs/kit';
import { fork } from 'child_process';
import { fileURLToPath } from 'url';
import { getServerConfig } from '$lib/modules/myServers.js';

if (process.argv[2] === 'child') {
	try {
		let response = await fetch(`http://${process.argv[3]}/HIS`);
		response.status === 200 ? process.send('ok') : process.send('notOk');
		process.exit();
	} catch (error) {
		// console.log(error);
		process.send('notOk');
		process.exit();
	}
}
export const GET = async (requwstEvent) => {
	const { params } = requwstEvent;
	const { serverId } = params;
	let { ip, brand } = getServerConfig(serverId);
	if (brand === 'windows') {
		return json({
			status: await new Promise((resolve) => {
				const child = fork(fileURLToPath(import.meta.url), ['child', ip]);
				child.on('message', (data) => {
					resolve(data);
				});
			})
		});
	} else {
		return json({ status: 'not windows' });
	}
};
