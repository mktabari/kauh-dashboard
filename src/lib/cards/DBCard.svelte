<script>
	import { onMount } from 'svelte';
	import { slide } from 'svelte/transition';
	import { quintOut } from 'svelte/easing';
	export let server;
	let sga = '';
	let banner = '';
	let active = 0;
	let inactive = 0;
	let machines;
	let bytes;
	let status = false;
	let sessionMax = '';

	onMount(async () => {
		fetch('/api/DB/sga/' + server.id)
			.then((response) => response.json())
			.then(({ apiData }) => {
				let { SGA } = apiData[0];

				sga = SGA;
			});
		fetch('/api/DB/size/' + server.id)
			.then((response) => response.json())
			.then(({ apiData }) => {
				let { BYTES } = apiData[0];
				bytes = BYTES;

				fetch('/api/DB/size/' + server.id + '/' + bytes);
			});
		fetch('/api/DB/version/' + server.id)
			.then((response) => response.json())
			.then(({ apiData }) => {
				let { BANNER } = apiData[0];

				banner = BANNER;
			});
		fetch('/api/DB/sm/' + server.id)
			.then((response) => response.json())
			.then(({ apiData }) => {
				let { SESSIONS } = apiData[0];

				sessionMax = SESSIONS;
			});
		fetch('/api/DB/sessions/' + server.id)
			.then((response) => response.json())
			.then(({ apiData }) => {
				if ((apiData[0].STATUS = 'ACTIVE')) {
					active = apiData[0].C;
					inactive = apiData[1].C;
				} else {
					active = apiData[1].C;
					inactive = apiData[0].C;
				}
			});
	});
	const getMachines = async () => {
		if (!machines) {
			fetch('/api/DB/machine/' + server.id)
				.then((response) => response.json())
				.then(({ apiData }) => {
					machines = apiData;
					status = !status;
				});
		} else {
			status = !status;
		}
	};
</script>

<div class=" w-full rounded border px-5 pb-1 pt-5 shadow-md dark:border-0 dark:bg-gray-800">
	<div class="flex flex-row justify-between dark:text-gray-200">
		<div class="flex flex-row gap-5">
			<span
				class="font-Bruno flex w-56 items-center text-xl font-extrabold uppercase text-red-600 underline"
			>
				{server.name}
			</span>
			<span
				class=" font-Bruno flex items-center text-xl font-extrabold uppercase text-gray-600 underline dark:text-gray-400"
			>
				{server.dbName}
			</span>
		</div>
		<span class=" font-semibold"> MAX Sessions: {sessionMax}</span>
		<span class=" font-semibold">Sessions: {active + inactive} ({active})</span>
		<span class=" font-semibold"> Size: {bytes}GB</span>
		<span class=" font-semibold"> SGA: {sga}GB</span>
	</div>
	<span class="inline-block py-1 align-baseline text-sm dark:text-gray-200">{banner}</span>
	<div class="flex w-full justify-center">
		<button
			class="m-1 w-full rounded border from-white to-yellow-50 hover:bg-gradient-to-br dark:border-0 dark:bg-gray-700 dark:from-gray-700 dark:to-gray-900"
			on:click={getMachines}
			><span class="material-symbols-outlined" class:rotate-180={status}>
				expand_more
			</span></button
		>
	</div>
	{#if status}
		<div
			transition:slide={{ delay: 200, duration: 300, easing: quintOut }}
			class="mb-2 flex flex-row flex-wrap gap-2 bg-slate-100 p-3 shadow-inner dark:bg-gray-700"
		>
			{#key machines}
				{#each machines as machine (machine.MACHINE)}
					<div
						class=" flex flex-col justify-center overflow-hidden rounded-md border dark:border-gray-900"
					>
						<span class="bg-gray-600 px-2 font-semibold text-gray-100 dark:bg-gray-800"
							>{machine.MACHINE}</span
						>
						<span class="bg-white px-2 dark:bg-gray-700 dark:text-gray-400">{machine.C}</span>
					</div>
				{/each}
			{/key}
		</div>
	{/if}
</div>
