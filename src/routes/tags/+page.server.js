/** @type {import('./$types').PageServerLoad} */
import { getTags, addTag } from '$lib/modules/tags.js';
export const load = async () => {
	return { allTags: getTags() };
};
export const actions = {
	createTag: async ({ request }) => {
		let { name, description, color } = Object.fromEntries(await request.formData());
		addTag({ name, description, color });
		return { message: 'Done' };
	}
};
