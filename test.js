const apiData = [
	{
		id: 'e10318e8-b663-475f-9919-ea928c3c913d',
		name: 'KAUH2',
		dbName: 'isoft',
		rows: []
	},
	{
		id: '6484aa7e-6c5a-4b55-8047-b1cee1ae6b87',
		name: 'KAUH1',
		dbName: 'isoft',
		rows: []
	},
	{
		id: 'ba189fab-aa40-4789-b9b6-ca80a32aab1a',
		name: 'KAUH',
		dbName: 'kauh',
		rows: []
	},
	{
		id: 'e9d75fe7-d968-4d15-bf2d-172300ef8649',
		name: 'ERP',
		dbName: 'prod',
		rows: []
	}
];
let exists = false;
apiData.map((server) => {
	console.log(server.rows.length == 0, server.rows.length);
	exists = exists || server.rows.lenth == 0;
});
