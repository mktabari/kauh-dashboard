<script>
	import {
		contentClass,
		inactiveClasses,
		activeClasses,
		defaultClass
	} from '$lib/generalsStyle/index';
	import { Tabs, TabItem, Skeleton, TextPlaceholder, StepIndicator } from 'flowbite-svelte';
	import { onDestroy } from 'svelte';
	export let data;
	let stop = false;
	let { servers } = data;
	let spin = false;
	let currentStep = 1;
	let steps = [
		'Waiting Restart',
		'Stop ERP APP',
		'Stop ERP DB',
		'Start ERP DB',
		'Start ERP APP',
		'Restart Completed'
	];
	let result = '';
	const scrolDiv = document.querySelector('#scrolDiv');
	let reader;
	const stopReader = () => {
		reader?.cancel();
	};
	const getStream = async (serverId) => {
		result = '';

		stop = false;

		currentStep = 2;
		let response = await fetch(`/api/ssh/erp/${serverId}/stopApp`);
		reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

		// while (true) {
		// 	const { value, done } = await reader.read();
		// 	if (done) break;
		// 	result += `${value}`;
		// 	// result = `${value}`;
		// 	scrolDiv.scrollTop = scrolDiv.scrollHeight;
		// 	console.log(value);
		// 	// if (stop) reader.cancel();
		// }

		reader?.releaseLock();
		currentStep = 3;
		response = await fetch(`/api/ssh/erp/${serverId}/stopDB`);
		reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

		// while (true) {
		// 	const { value, done } = await reader.read();
		// 	if (done) break;
		// 	result += `${value}`;
		// 	// result = `${value}`;
		// 	scrolDiv.scrollTop = scrolDiv.scrollHeight;

		// 	// if (stop) reader.cancel();
		// }

		reader?.releaseLock();
		currentStep = 4;
		response = await fetch(`/api/ssh/erp/${serverId}/startDB`);
		reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

		// while (true) {
		// 	const { value, done } = await reader.read();
		// 	if (done) break;
		// 	result += `${value}`;
		// 	// result = `${value}`;
		// 	scrolDiv.scrollTop = scrolDiv.scrollHeight;

		// 	// if (stop) reader.cancel();
		// }

		reader?.releaseLock();
		currentStep = 5;
		response = await fetch(`/api/ssh/erp/${serverId}/startApp`);
		reader = response.body.pipeThrough(new TextDecoderStream()).getReader();

		// while (true) {
		// 	const { value, done } = await reader.read();
		// 	if (done) break;
		// 	result += `${value}`;
		// 	// result = `${value}`;
		// 	scrolDiv.scrollTop = scrolDiv.scrollHeight;

		// 	// if (stop) reader.cancel();
		// }

		reader?.releaseLock();
		currentStep = 6;
		console.log('end');
	};

	onDestroy(() => {
		stopReader();
	});
</script>

<Tabs style="none" {contentClass} {inactiveClasses} {activeClasses} {defaultClass}>
	<TabItem open>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> save </span>
			Servers List
		</div>
		<div class="flex flex-col gap-2">
			<div class="flex w-full">
				{#each servers as server (server.id)}
					<button
						on:click={() => {
							getStream(server.id);
						}}
						class=" font-Bruno rounded px-5 py-2 text-center font-extrabold uppercase tracking-widest text-red-600 underline hover:cursor-pointer hover:bg-gray-200 hover:text-gray-700"
					>
						restart {server.name}
					</button>
				{/each}
				<button
					on:click={() => {
						stopReader();
					}}
					>Stop Stream
				</button>
			</div>
			<div>
				<StepIndicator {currentStep} {steps} glow />
			</div>
			<div class=" flex-1 overflow-x-auto overflow-y-auto rounded-lg bg-black px-4 pt-4 text-white">
				{#if spin}
					<TextPlaceholder size="xxl" class="my-8" />
					<Skeleton size="xxl" class=" mb-2.5" />
					<TextPlaceholder size="xxl" class="my-8" />
					<Skeleton size="xl" class=" mb-2.5" />
				{:else if result}
					<pre>{result}</pre>
				{:else}
					<div class="pb-10">select a server</div>
				{/if}
			</div>
		</div>
	</TabItem>
</Tabs>
