// let t = {
// 	tags: [
// 		{ name: 'ILOM', done: false },
// 		{ name: 'aa', done: false }
// 	]
// };
// if (
// 	!t.tags.find((tag) => {
// 		return tag.name === 'ILOM' && tag.done === true;
// 	})
// ) {
// 	console.log(true);
// }
// const a = 'asdfgh';
// console.log(a[1]);

// try {
// 	fetch(`http://172.30.5.113/HIS`).then((response) => {
// 		console.log(response.ok);
// 	});
// } catch (error) {
// 	console.log('error');
// }

(async () => {
	try {
		let response = await fetch(`http://172.30.5.113/HIS`);
		console.log(response.status);
	} catch (error) {
		console.log('error');
	}
})();
