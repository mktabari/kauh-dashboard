<script>
	import { onMount } from 'svelte';
	import { Spinner } from 'flowbite-svelte';
	import DBMountChartNew from '$lib/cards/DBMountChartNew.svelte';
	export let aClass;
	let data = [];
	let spin = true;

	onMount(() => {
		// fetch('/api/ssh/space')
		// 	.then((response) => response.json())
		// 	.then(({ apiData }) => {
		// 		data = apiData;
		// 		spin = false;
		// 	});
		let { apiData } = {
			apiData: [
				{ name: 'KAUH2', mountPints: [['rpool/ROOT/solaris-1', '147G', '78%', '/']] },
				{
					name: 'KAUH',
					mountPints: [
						['oradata', '99G', '78%', '/oradata'],
						['rpool/ROOT/solaris', '98G', '22%', '/']
					]
				},
				{
					name: 'KAUH1',
					mountPints: [
						['ORADATA2', '5.0T', '50%', '/oradata2'],
						['ORADATA', '5.0T', '98%', '/oradata'],
						['new-backup', '15T', '63%', '/new-backup'],
						['backup-dump:/backup', '4.8T', '100%', '/backup-dump'],
						['rpool/ROOT/solaris-1', '147G', '82%', '/']
					]
				},
				{
					name: 'ERP',
					mountPints: [
						['erp-u01/u01', '488G', '60%', '/u01'],
						['rpool/ROOT/s10s_u11wos_24a', '98G', '21%', '/']
					]
				}
			]
		};
		data = [
			{ name: 'KAUH2', mountPints: [['rpool/ROOT/solaris-1', '147G', '78%', '/']] },
			{
				name: 'KAUH',
				mountPints: [
					['oradata', '99G', '78%', '/oradata'],
					['rpool/ROOT/solaris', '98G', '22%', '/']
				]
			},
			{
				name: 'KAUH1',
				mountPints: [
					['ORADATA2', '5.0T', '50%', '/oradata2'],
					['ORADATA', '5.0T', '98%', '/oradata'],
					['new-backup', '15T', '63%', '/new-backup'],
					['backup-dump:/backup', '4.8T', '100%', '/backup-dump'],
					['rpool/ROOT/solaris-1', '147G', '82%', '/']
				]
			},
			{
				name: 'ERP',
				mountPints: [
					['erp-u01/u01', '488G', '60%', '/u01'],
					['rpool/ROOT/s10s_u11wos_24a', '98G', '21%', '/']
				]
			}
		];
		console.log(data);
		spin = false;
	});
</script>

<div class={aClass}>
	<div class="pb-3 pl-5 text-2xl font-extrabold text-gray-500 dark:text-gray-400">
		Mount Points Usage
	</div>
	<div class="flex w-full flex-row flex-wrap gap-1">
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
					<div class=" bg-gray-300 pt-1">{server.name}</div>
					<div class="flex flex-row gap-0">
						<DBMountChartNew data={server} />
					</div>
				</div>
			{/each}
		{/if}
	</div>
</div>
