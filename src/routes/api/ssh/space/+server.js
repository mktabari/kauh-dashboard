import { getTagServers } from '$lib/modules/myServers.js';
import { json } from '@sveltejs/kit';
import { Client } from 'ssh2';
export const GET = async ({ setHeaders }) => {
	setHeaders({ 'Cache-Control': 'public, max-age=300' });
	let dbs = getTagServers('DB');

	const checkPercent = async (dbObj) => {
		let { ip, username, password, dbMountPoint, name } = dbObj;

		try {
			const conn = new Client();
			const customPromise = new Promise(async (resolve, reject) => {
				try {
					let pct = '';
					let pctArr = [];
					conn
						.on('ready', () => {
							//console.log('Client :: ready');
							conn.exec(
								`df -h ${dbMountPoint} |grep -v Filesystem|tr -s ' '|cut -d" " -f 1,2,5,6`,
								(err, stream) => {
									if (err) reject(err);
									stream
										.on('close', (code, signal) => {
											//console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
											conn.end();
										})
										.on('data', (data) => {
											//console.log('STDOUT: ' + data);
											pct = data;
										})
										.stderr.on('data', (data) => {
											//console.log('STDERR: ' + data);
										});
								}
							);
						})
						.on('close', () => {
							pctArr = pct.toString('utf-8').split('\n');
							pctArr.pop();
							pctArr = pctArr.map((line) => {
								return line.split(' ');
							});
							resolve({ mountPints: pctArr });
						})
						.connect({
							host: ip,
							port: 22,
							username: username,
							password: password,
							readyTimeout: 99999
						});
				} catch (error) {
					await connection.close();
					resolve({ mountPints: [] });
				}
			});
			let { mountPints } = await customPromise;
			return { name, mountPints };
		} catch (error) {
			return { name, mountPints: [] };
		}
	};
	let myDBs = [];
	dbs.forEach((db) => {
		if (db.dbMountPoint) myDBs.push(checkPercent(db));
	});
	let mySshPromis = await Promise.all(myDBs);
	return json({ apiData: mySshPromis });
};
