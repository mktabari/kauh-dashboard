//import SSH2Promise from 'ssh2-promise';

const sshShell = (command, response) => {
	const sshconfig = {
		host: '172.30.5.210',
		username: 'root',
		password: 'root123'
	};
	// var ssh = new SSH2Promise(sshconfig);
	// ssh
	// 	.spawn('tail -1000 /u01/PROD/db/9.2.0/admin/PROD_erp-srv/bdump/alert_PROD.log')
	// 	.then((socket) => {
	// 		socket.on('data', (data) => {
	// 			response = response + data.toString('utf-8');
	// 		});
	// 	});
};

export { sshShell };
