import { fork } from 'child_process';
import { json } from '@sveltejs/kit';
export const GET = async (requwstEvent) => {
	const { params } = requwstEvent;
	const { serverId } = params;

	return json({
		UpTime: await new Promise((resolve, reject) => {
			const child = fork('src/lib/modules/getTime.js');
			child.send(serverId);
			child.on('message', (time) => {
				resolve(time);
			});
		})
	});
};
