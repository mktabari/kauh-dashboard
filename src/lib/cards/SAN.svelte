<script>
	import { onMount } from 'svelte';
	import { Spinner } from 'flowbite-svelte';
	import SANChart from '$lib/cards/SANChart.svelte';
	export let aClass;
	let data = [];
	let spin = true;
	onMount(() => {
		fetch('/api/san/size')
			.then((response) => response.json())
			.then(({ apiData }) => {
				data = apiData;
				console.log(data);
				spin = false;
			});
	});
</script>

<div class={aClass}>
	<div class="pb-3 pl-5 text-2xl font-extrabold text-gray-500 dark:text-gray-400">SAN Usage</div>
	<div class="flex w-full flex-row flex-wrap gap-1">
		{#if spin}
			<div class="w-full p-10 text-center">
				<Spinner size={8} />
			</div>
		{:else}
			{#each data as san}
				<div
					class="text-md flex w-2/5 flex-col overflow-hidden rounded-xl bg-gray-200 text-center font-extrabold text-gray-500 dark:bg-gray-800 dark:text-gray-400"
				>
					<div class=" bg-gray-300 pt-1 dark:bg-gray-500 dark:text-gray-300">{san.name}</div>
					<div class="flex flex-row gap-0">
						<SANChart data={san} />
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
