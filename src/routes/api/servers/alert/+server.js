import { json } from '@sveltejs/kit';
import SSH2Promise from 'ssh2-promise';
import { fork } from 'child_process';
import { fileURLToPath } from 'url';
import { getTagServers } from '$lib/modules/myServers.js';
process.env['NODE_TLS_REJECT_UNAUTHORIZED'] = 0;

if (process.argv[2] === 'child') {
	const checkDB = async (ovsObj) => {
		let { ip, name, username, password } = ovsObj;
		try {
			const customPromise = new Promise(async (resolve) => {
				const sshconfig = {
					host: ip,
					username: username,
					password: password
				};
				const conn = new SSH2Promise(sshconfig);

				// conn.exec('ls').then((data) => {
				conn.exec('fmadm faulty').then((data) => {
					conn.close();
					resolve(data.toString('utf-8').replace('\n', '').replace('\r', ''));
				});
			});

			return { name, alert: await customPromise };
		} catch (error) {
			return { name, alert: [] };
		}
	};
	let ovs = getTagServers('OVS');
	let myOvs = ovs.map((s) => checkDB(s));
	let mySshPromis = await Promise.all(myOvs);
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
