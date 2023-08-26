import { json } from '@sveltejs/kit';

export const GET = async ({ params, fetch }) => {
	const { serverId } = params;
	const serverPing = async () => {
		let response = await fetch('/api/ping/' + serverId);

		return await response.json();
	};
	const serverMem = async () => {
		let response = await fetch('/api/ssh/mem/' + serverId);

		return await response.json();
	};
	const serverCpu = async () => {
		let response = await fetch('/api/ssh/cpu/' + serverId);

		return await response.json();
	};
	try {
		return json({
			serverPing: await serverPing(),
			serverMem: await serverMem(),
			serverCpu: await serverCpu()
		});
	} catch (error) {
		console.log(error);
		return json({});
	}
};
