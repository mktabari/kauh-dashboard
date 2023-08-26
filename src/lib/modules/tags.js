import { wrightConfig, readConfig } from '$lib/modules/myFs.js';
import { v4 as uuid } from 'uuid';
import { allTags } from '$lib/config/env.js';

const getTags = () => {
	return readConfig(allTags);
};
const addTag = (Tag) => {
	const Tags = getTags();
	let id = uuid();

	if (!Tags) {
		wrightConfig(allTags, [{ id, ...Tag }]);
	} else if (!Tags.find((myTag) => myTag.name === Tag.name)) {
		wrightConfig(allTags, [...Tags, { id, ...Tag }]);
	} else console.log('Tag with same name exists!');
};
const getTag = (id) => {
	const Tags = getTags();
	const Tag = Tags.find((Tag) => Tag.id == id);
	return Tag;
};
const removeTag = (id) => {
	let Tags = getTags();
	Tags = Tags.filter((Tag) => Tag.id !== id);
	wrightConfig(allTags, Tags);
	return {};
};
const updateTag = (tag) => {
	//console.log(server);
	let myTags = getTags().filter((myTag) => myTag.id !== tag.id);
	wrightConfig(allTags, [...myTags, tag]);
};

export { getTags, addTag, getTag, removeTag, updateTag };
