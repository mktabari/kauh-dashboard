<script>
	import { onMount } from 'svelte';
	import { fly } from 'svelte/transition';
	import { circInOut } from 'svelte/easing';
	import { Badge } from 'flowbite-svelte';
	let data;
	let spin = true;
	onMount(() => {
		fetch('/api/DB/up')
			.then((response) => response.json())
			.then(({ apiData }) => {
				data = apiData;
				spin = false;
			});
	});
</script>

<div class=" h-18 -mt-3 flex w-full flex-row gap-4 py-3">
	{#if !spin}
		{#each data as db, i (db.id)}
			<div
				class=" flex w-60 items-center justify-between rounded-xl bg-gray-100 px-4 py-2 delay-200 hover:bg-gray-200 dark:bg-gray-900 dark:text-white hover:dark:bg-gray-700"
				in:fly={{ x: 800, easing: circInOut, delay: 130 * i }}
			>
				{db.dbName} ({db.INSTANCE_NAME})
				{#if db.STATUS === 'OPEN'}<Badge color="green"
						><span class="material-symbols-outlined"> arrow_upward </span></Badge
					>
				{:else}<Badge color="red"
						><span class="material-symbols-outlined"> arrow_downward </span></Badge
					>{/if}
			</div>
		{/each}
	{/if}
</div>
