<script>
	import { createEventDispatcher } from 'svelte';
	const dispatch = createEventDispatcher();
	export let servers;
	export let label;
	export let serverData;
	export let spin;
	export let apiName = '';
	export let check;
	export let returnedServerId;

	let current;
	const getData = (serverId) => {
		serverData = '';
		spin = true;

		if (apiName !== '') {
			fetch(`/api/${apiName}/${serverId}`)
				.then((response) => response.json())
				.then(({ apiData }) => {
					spin = false;
					returnedServerId = serverId;
					serverData = apiData;
				});
		} else {
			spin = false;
			returnedServerId = serverId;
		}
	};
</script>

<div class=" flex flex-row gap-3">
	<div class=" py-2 font-bold text-gray-500">{label}</div>
	{#each servers as server (server.id)}
		{#if !check || server[check]}
			<button
				on:click={() => {
					current = server.id;
					getData(server.id);
				}}
				class=" font-Bruno rounded px-5 py-2 text-center font-extrabold uppercase tracking-widest text-red-600 underline hover:cursor-pointer hover:bg-gray-200 hover:text-gray-700 dark:hover:bg-gray-800 dark:hover:text-gray-300 {current ===
				server.id
					? 'bg-slate-200 ring-1 ring-gray-400 dark:bg-slate-800 dark:ring-gray-600'
					: ''}"
			>
				{server.name}
			</button>
			<div class="border-r-2 border-gray-300 last:border-r-0" />
		{/if}
	{:else}
		<div class=" font-semibold text-2xl text-blue-700">No Servers Tagged!</div>
	{/each}
</div>
