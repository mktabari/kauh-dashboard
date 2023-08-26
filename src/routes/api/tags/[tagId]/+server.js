import { removeTag } from '$lib/modules/tags.js';
import { json } from '@sveltejs/kit';

export const DELETE = (event) => {
	let { params } = event;
	let { tagId } = params;
	removeTag(tagId);
	return json({});
};
