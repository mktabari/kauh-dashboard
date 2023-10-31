let t = {
	tags: [
		{ name: 'ILOM', done: false },
		{ name: 'aa', done: false }
	]
};
if (
	!t.tags.find((tag) => {
		return tag.name === 'ILOM' && tag.done === true;
	})
) {
	console.log(true);
}
const a = 'asdfgh';
console.log(a[1]);
