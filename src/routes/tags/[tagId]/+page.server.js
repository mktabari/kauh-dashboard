import { getTag, updateTag as update } from '$lib/modules/tags.js';
import { redirect } from '@sveltejs/kit';
export const load = async (serverLoadEvent) => {
	const { params } = serverLoadEvent;
	const { tagId } = params;
	return { tag: getTag(tagId) };
};
export const actions = {
	updateTag: async ({ request, params }) => {
		const { tagId } = params;
		let { name, description, color } = Object.fromEntries(await request.formData());
		update({ id: tagId, name, description, color });
		throw redirect(303, '/tags');
	}
};
