<script>
	import { onMount } from 'svelte';
	import { Spinner } from 'flowbite-svelte';
	import DBMountChart from '$lib/cards/DBMountChart.svelte';
	export let aClass;
	let data = [];
	let spin = true;

	onMount(() => {
		fetch('/api/ssh/space')
			.then((response) => response.json())
			.then(({ apiData }) => {
				data = apiData;
				spin = false;
			});
	});
</script>

<div class={aClass}>
	<div class="pb-3 pl-5 text-2xl font-extrabold text-gray-500 dark:text-gray-400">
		Mount Points Usage
	</div>
	<div class="flex w-full flex-row flex-wrap gap-2">
		{#if spin}
			<div class="w-full p-10 text-center">
				<Spinner size={8} />
			</div>
		{:else}
			{#each data as server}
				<div
					class=" text-md flex flex-col overflow-hidden rounded-xl bg-gray-200 text-center font-extrabold text-gray-500 dark:bg-gray-800 dark:text-gray-400"
					class:order-first={server.mountPints.length >= 4}
				>
					<div class=" bg-gray-200 dark:bg-gray-700 dark:text-gray-300">{server.name}</div>
					<div class="flex flex-row gap-0 bg-gray-50 dark:bg-gray-800">
						{#each server.mountPints as mount}
							<DBMountChart data={mount} />
						{/each}
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
