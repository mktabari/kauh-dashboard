import { getTags } from '$lib/modules/tags.js';
import { json } from '@sveltejs/kit';

export const GET = () => {
	return json(getTags());
};
