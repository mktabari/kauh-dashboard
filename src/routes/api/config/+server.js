import fs from 'fs';
import { json } from '@sveltejs/kit';
// ----- GET -----
export const GET = async ({ params }) => {
	//console.log(params.file) -> ABC
	var config = fs.readFileSync('./src/lib/config/servers/serversList.json');

	return new Response({
		status: 200,
		headers: {
			'Content-type': 'application/json',
			'Content-Disposition': 'attachment; filename=serversList.json'
		},
		body: config
	});
};
