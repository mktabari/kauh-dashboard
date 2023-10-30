import { json } from '@sveltejs/kit';
import { fork } from 'child_process';
import { fileURLToPath } from 'url';
import { getTagServers } from '$lib/modules/myServers.js';
// import makeFetchCookie from 'fetch-cookie';
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

if (process.argv[2] === 'child') {
	const checkDB = async (sanObj) => {
		let { ip, name, username, password } = sanObj;
		try {
			const customPromise = new Promise(async (resolve) => {
				// const fetchCookie = makeFetchCookie(fetch);
				var myHeaders = new Headers();
				myHeaders.append(
					'Authorization',
					'Basic ' + new Buffer.from(username + ':' + password, 'utf8').toString('base64')
				);
				// myHeaders.append('Content-type', 'application/json');
				myHeaders.append('Accept', 'application/json');

				var requestOptions = {
					method: 'GET',
					headers: myHeaders,
					redirect: 'follow'
				};

				fetch(`https://${ip}/rest/v1/System/Open_Problems`, requestOptions)
					// fetch(`https://${ip}/rest/v1`, requestOptions)
					.then((response) => response.json())
					.then((result) => resolve(result.OpenProblems))
					// .then((result) => resolve(result.Targets))
					.catch((error) => console.log('error', error));
			});

			return { name, alert: await customPromise };
		} catch (error) {
			return { name, alert: {} };
		}
	};
	let servers = getTagServers('ILOM');
	let myServers = servers.map((server) => checkDB(server));
	let mySshPromis = await Promise.all(myServers);
	process.send(mySshPromis);
}
export const GET = async ({ setHeaders }) => {
	setHeaders({ 'Cache-Control': 'public, max-age=300' });
	return json({
		apiData: await new Promise((resolve) => {
			const child = fork(fileURLToPath(import.meta.url), ['child']);
			child.on('message', (data) => {
				resolve(data);
			});
		})
	});
};
