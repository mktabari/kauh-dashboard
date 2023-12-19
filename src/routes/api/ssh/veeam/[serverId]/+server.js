// import SSH2Promise from 'ssh2-promise';
// import { getServerConfig } from '$lib/modules/myServers.js';
// import { json } from '@sveltejs/kit';
// export const GET = async (requwstEvent) => {
// 	const { params, setHeaders } = requwstEvent;
// 	const { serverId } = params;
// 	setHeaders({ 'Cache-Control': 'public, max-age=43200' });
// 	try {
// 		let { ip, username, password } = getServerConfig(serverId);

// 		const sshconfig = {
// 			host: ip,
// 			username: username,
// 			password: password
// 		};
// 		const conn = new SSH2Promise(sshconfig);
// 		return json({
// 			apiData: await new Promise((resolve, reject) => {
// 				try {
// 					conn.connect().then(() => {
// 						conn.exec(`powershell;Get-VBRComputerBackupJobSession`).then((data) => {
// 							conn.close();
// 							let d = '';
// 							d = data.toString('utf-8');
// 							let dd = d.split('\r\n');
// 							let output = [];
// 							let tempCount = 0;
// 							let tempObject = {};
// 							for (var i = 0; i < dd.length; ++i) {
// 								if (dd[i] !== '') {
// 									let temp = dd[i].split(' : ');
// 									tempObject[temp[0].replaceAll(' ', '')] = temp[1];
// 									++tempCount;
// 									if (tempCount === 6) {
// 										tempCount = 0;
// 										output.push(tempObject);
// 										tempObject = {};
// 									}
// 								}
// 							}
// 							resolve(output);
// 						});
// 					});
// 				} catch (error) {
// 					conn.close();
// 					reject(error);
// 				}
// 			})
// 		});
// 	} catch (error) {
// 		console.log(error);
// 		return json({});
// 	}
// };

import { json } from '@sveltejs/kit';
import SSH2Promise from 'ssh2-promise';
import { fork } from 'child_process';
import { fileURLToPath } from 'url';
import { getServerConfig } from '$lib/modules/myServers.js';
if (process.argv[2] === 'child') {
	const sshconfig = {
		host: process.argv[3],
		username: process.argv[4],
		password: process.argv[5]
	};
	const conn = new SSH2Promise(sshconfig);
	conn.connect().then(() => {
		conn.exec(`powershell;Get-VBRComputerBackupJobSession`).then((data) => {
			conn.close();
			let d = '';
			d = data.toString('utf-8');
			let dd = d.split('\r\n');
			let output = [];
			let tempCount = 0;
			let tempObject = {};
			for (var i = 0; i < dd.length; ++i) {
				if (dd[i] !== '') {
					let temp = dd[i].split(' : ');
					tempObject[temp[0].replaceAll(' ', '')] = temp[1];
					++tempCount;
					if (tempCount === 6) {
						tempCount = 0;
						output.push(tempObject);
						tempObject = {};
					}
				}
			}
			process.send(output);
			process.exit();
		});
	});
}
export const GET = async (requwstEvent) => {
	const { params, setHeaders } = requwstEvent;
	setHeaders({ 'Cache-Control': 'public, max-age=300' });
	const { serverId } = params;
	let { ip, username, password } = getServerConfig(serverId);
	return json({
		apiData: await new Promise((resolve) => {
			const child = fork(fileURLToPath(import.meta.url), ['child', ip, username, password]);
			child.on('message', (output) => {
				resolve(output);
			});
		})
	});
};
