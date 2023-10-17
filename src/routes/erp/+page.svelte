<script>
	import { onDestroy, afterUpdate } from 'svelte';
	import {
		contentClass,
		inactiveClasses,
		activeClasses,
		defaultClass
	} from '$lib/generalsStyle/index';
	import {
		Tabs,
		TabItem,
		Skeleton,
		TextPlaceholder,
		StepIndicator,
		Spinner
	} from 'flowbite-svelte';
	export let data;
	let { servers } = data;
	let spin = false;
	let skeleton = false;
	let currentStep = 1;
	let steps = [
		'Waiting for Restart',
		'Stop ERP APP',
		'Stop ERP DB',
		'Server Reboot',
		'Start ERP DB',
		'Start ERP APP',
		'Restart Completed'
	];
	let result = '';
	let reader;
	let scrolpre;
	let intervalId;
	let rebootIntervalId;
	let waitIntervalId;
	let rebooting;
	let gServerId;
	const getStream = async (serverId) => {
		if (spin === false) {
			spin = true;
			result = '';
			skeleton = true;
			currentStep = 2;

			result += `

Stop ERP APP log
================

`;
			let response = await fetch(`/api/ssh/erp/${serverId}/stopApp`);
			reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
			while (true) {
				const { value, done } = await reader.read();
				skeleton = false;
				result += `${value}`;
				if (done) break;
			}
			reader?.releaseLock();

			currentStep = 3;

			gServerId = serverId;
			result += `

Stop ERP DB log
===============

`;
			intervalId = setInterval(checkActiveProcess, 350000);
			response = await fetch(`/api/ssh/erp/${serverId}/stopDB`);
			reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
			while (true) {
				const { value, done } = await reader.read();
				result += `${value}`;
				if (done) break;
			}
			reader?.releaseLock();
			clearInterval(intervalId);

			currentStep = 4;

			rebooting = true;
			result += `

Rebooting Server
================

`;
			fetch(`/api/ssh/erp/${serverId}/rebootServer`);
			waitIntervalId = setInterval(waitForMinute, 20000);
			while (rebooting) {
				await new Promise((resolve) => {
					setTimeout(resolve, 10000);
				});
			}
			await new Promise((resolve) => {
				setTimeout(resolve, 10000);
			});
			clearInterval(rebootIntervalId);

			currentStep = 5;

			result += `

Start ERP DB log
================

`;
			response = await fetch(`/api/ssh/erp/${serverId}/startDB`);
			reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
			while (true) {
				const { value, done } = await reader.read();
				result += `${value}`;
				if (done) break;
			}
			reader?.releaseLock();

			currentStep = 6;

			result += `

Start ERP APP log
=================

`;
			response = await fetch(`/api/ssh/erp/${serverId}/startApp`);
			reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
			while (true) {
				const { value, done } = await reader.read();
				result += `${value}`;
				if (done) break;
			}
			reader?.releaseLock();

			currentStep = 7;
			result += `

Restart ERP Completed
=====================

`;
			spin = false;
		}
	};

	const checkActiveProcess = () => {
		if (currentStep === 3) fetch(`/api/ssh/erp/${gServerId}/killActiveProcess`);
	};
	const waitForMinute = () => {
		console.log('waitForMinute excuted' + new Date());
		rebootIntervalId = setInterval(checkServerReboot, 10000);
		if (waitIntervalId) clearInterval(waitIntervalId);
	};
	const checkServerReboot = () => {
		console.log('checkServerReboot excuted' + new Date());
		fetch(`/api/ping/${gServerId}`)
			.then((response) => response.json())
			.then(({ isAlive }) => {
				if (isAlive) {
					rebooting = false;
				}
			});
	};
	onDestroy(() => {
		if (intervalId) clearInterval(intervalId);
		if (rebootIntervalId) clearInterval(rebootIntervalId);
		if (waitIntervalId) clearInterval(waitIntervalId);
	});
	afterUpdate(() => {
		scrolpre.scrollTo(0, scrolpre.scrollHeight);
	});
	const getStream1 = async (serverId) => {
		result = '';
		skeleton = true;
		spin = true;

		currentStep = 2;
		let response = await fetch(`/api/ssh/erp/${serverId}/stopApp`)
			.then((response) => response.json())
			.then(({ apiData }) => {
				skeleton = false;
				result = `Stop ERP APP log
`;
				result += `================
				
`;
				result += apiData;
			});

		currentStep = 3;
		response = await fetch(`/api/ssh/erp/${serverId}/stopDB`)
			.then((response) => response.json())
			.then(({ apiData }) => {
				result += `

Stop ERP DB log
`;
				result += `===============

`;
				result += apiData;
			});

		currentStep = 4;
		response = await fetch(`/api/ssh/erp/${serverId}/startDB`)
			.then((response) => response.json())
			.then(({ apiData }) => {
				result += `

Start ERP DB log
`;
				result += `================

`;
				result += apiData;
			});

		currentStep = 5;
		response = await fetch(`/api/ssh/erp/${serverId}/startApp`)
			.then((response) => response.json())
			.then(({ apiData }) => {
				result += `

Start ERP APP log
`;
				result += `=================

`;
				result += apiData;
			});
		currentStep = 6;
		spin = false;
	};
</script>

<Tabs
	style="none"
	contentClass={contentClass + ' h-full'}
	{inactiveClasses}
	{activeClasses}
	{defaultClass}
>
	<TabItem open>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> extension </span>
			ERP Servers
		</div>
		<div class=" h-200">
			<div class="flex">
				<div class=" py-2 pr-4 font-bold text-gray-500">Restart :</div>
				{#each servers as server (server.id)}
					<button
						on:click={() => {
							getStream(server.id);
						}}
						class=" font-Bruno rounded bg-gray-200 px-5 py-2 text-center font-extrabold uppercase tracking-widest text-red-600 underline ring-1 hover:cursor-pointer hover:bg-gray-300 hover:text-gray-700"
					>
						{server.name}
					</button>
				{/each}
				{#if currentStep === 6 || currentStep === 3}
					<span class="mt-1 -translate-x-12 translate-y-12 text-xs font-bold text-red-500"
						>this step may take a long time</span
					>
				{/if}
				{#if spin}
					<span class="ml-4 mt-1 text-xl">
						<Spinner size={8} color="blue" />
					</span>
				{/if}
			</div>
			<div class="mt-2 pr-4">
				<StepIndicator {currentStep} {steps} glow size="h-4" />
			</div>
			<div
				bind:this={scrolpre}
				class="m-4 ml-0 h-full overflow-x-auto overflow-y-auto rounded-lg bg-black px-4 pt-4 text-white"
			>
				{#if skeleton}
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
