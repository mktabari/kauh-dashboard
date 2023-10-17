import { json } from '@sveltejs/kit';
import { v4 as uuid } from 'uuid';
import { fork } from 'child_process';
import { fileURLToPath } from 'url';
import { getTagServers } from '$lib/modules/myServers.js';
import makeFetchCookie from 'fetch-cookie';
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

if (process.argv[2] === 'child') {
	const checkDB = async (sanObj) => {
		let { ip, name, username, password } = sanObj;
		try {
			const customPromise = new Promise(async (resolve) => {
				const fetchCookie = makeFetchCookie(fetch);
				var myHeaders = new Headers();
				myHeaders.append(
					'Authorization',
					'Basic ' + new Buffer.from(username + ':' + password, 'utf8').toString('base64')
				);
				myHeaders.append('Content-type', 'application/json');
				myHeaders.append('Accept', 'application/json');
				myHeaders.append('X-EMC-REST-CLIENT', 'true');

				var requestOptions = {
					method: 'GET',
					headers: myHeaders,
					redirect: 'follow'
				};

				fetchCookie(
					`https://${ip}/api/types/alert/instances?fields=severity,component,message,description,timestamp`,
					requestOptions
				)
					.then((response) => response.json())
					.then((result) => resolve(result.entries))
					.catch((error) => console.log('error', error));
			});

			return { id: uuid(), name, alert: await customPromise };
		} catch (error) {
			return { id: uuid(), name, alert: {} };
		}
	};
	let sans = getTagServers('SAN');
	let mySans = sans.map((san) => checkDB(san));
	let mySshPromis = await Promise.all(mySans);
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
