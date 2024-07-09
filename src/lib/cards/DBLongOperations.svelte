<script>
	import { onMount } from 'svelte';
	import Copy from '$lib/component/Copy.svelte';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Spinner,
		Progressbar
	} from 'flowbite-svelte';

	export let aClass;
	let spin = true;
	let data;

	let exists = false;
	onMount(() => {
		getData();
	});
	const getData = () => {
		spin = true;

		exists = false;
		fetch('/api/DB/long')
			.then((response) => response.json())
			.then(({ apiData }) => {
				data = apiData;
				data.map((server) => {
					exists = exists || server.rows.length > 0;
				});
				spin = false;
			});
	};
</script>

<div class={aClass}>
	<!-- <div class="pb-3 pl-5 text-2xl font-extrabold text-gray-500 dark:text-gray-400">Current SQLs</div> -->
	{#if spin}
		<div class="w-full p-10 text-center">
			<Spinner size={8} />
		</div>
	{:else if !exists}
		<span class=" pb-2 pl-5 pt-3 text-2xl font-semibold text-blue-700">No Long Operations!</span>
	{:else}
		<div class="flex justify-between">
			<div class="pb-2">
				<button
					class=" rounded-md border border-gray-300 bg-white px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
					on:click={getData}
					><span class="material-symbols-outlined translate-y-1"> refresh </span></button
				>
			</div>
		</div>
		<Table striped={true} shadow>
			<TableHead class="bg-gray-200 dark:bg-gray-700">
				<TableHeadCell class="bg-slate-200 text-blue-800">Server</TableHeadCell>
				<TableHeadCell class="bg-slate-200 text-blue-800">SID</TableHeadCell>
				<TableHeadCell class="text-blue-800">User Name</TableHeadCell>
				<TableHeadCell class="text-blue-800">Operation</TableHeadCell>
				<TableHeadCell class="text-blue-800">Target</TableHeadCell>
				<TableHeadCell class="text-blue-800">Percent</TableHeadCell>
				<TableHeadCell class="text-blue-800">Time REMAINING</TableHeadCell>
				<TableHeadCell class="text-blue-800">ID</TableHeadCell>
			</TableHead>

			<TableBody>
				{#key data}
					{#each data as server}
						{#each server.rows as row}
							<TableBodyRow>
								<TableBodyCell>{server.name} - {server.dbName}</TableBodyCell>

								<TableBodyCell>{row.SID}</TableBodyCell>
								<TableBodyCell>{row.USERNAME}</TableBodyCell>
								<TableBodyCell>{row.OPNAME}</TableBodyCell>
								<TableBodyCell>{row.TARGET}</TableBodyCell>
								<TableBodyCell class="w-96"
									><Progressbar
										progress={row.PERCENT}
										size="h-6"
										labelInside
										labelInsideClass="bg-blue-600 text-blue-100 text-base font-medium text-center p-1 leading-none rounded-full w-96"
									/></TableBodyCell
								>
								<TableBodyCell>
									{row.TIME_REMAINING}
								</TableBodyCell>
								<TableBodyCell class="text-center">
									{#if row.SQL_ID}
										<Copy id="hv{row.SQL_ID}" value={row.SQL_ID.toString()} name={'HV'} />
									{/if}
								</TableBodyCell>
							</TableBodyRow>
						{/each}
					{/each}
				{/key}
			</TableBody>
		</Table>
	{/if}
</div>
