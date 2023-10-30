import SSH2Promise from 'ssh2-promise';
import { Client } from 'ssh2';
const conn = new Client();
conn
	// .on('ready', () => {
	// 	//console.log('Client :: ready');
	// 	conn.exec(`uptime`, (err, stream) => {
	// 		if (err) console.log(err);
	// 		stream
	// 			.on('close', (code, signal) => {
	// 				console.log('Stream :: close :: code: ' + code + ', signal: ' + signal);
	// 				conn.end();
	// 			})
	// 			.on('data', (data) => {
	// 				console.log('STDOUT: ' + data);
	// 				// alertLog = data;
	// 			})
	// 			.stderr.on('data', (data) => {
	// 				console.log('STDERR: ' + data);
	// 			});
	// 	});
	// })
	// .on('close', () => {
	// 	//console.log(serverUpTime.toString('utf-8'));
	// 	// resolve(alertLog.toString('utf-8'));
	// 	//.replace('\n', ''));
	// })
	.connect({
		host: '172.30.5.184',
		username: 'root',
		password: 'changeme'
	});

const sshconfig = {
	host: '172.30.5.183',
	username: 'root',
	password: 'changeme'
};
// const conn = new SSH2Promise(sshconfig);

// conn.exec('ls').then((data) => {
// conn.exec('fmadm faulty').then((data) => {
// conn.exec('start /SP/faultmgmt/shell').then((data) => {
// 	conn.close();
// 	console.log(data.toString('utf-8').replace('\n', '').replace('\r', ''));
// });
