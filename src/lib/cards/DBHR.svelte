<script>
	import { onMount } from 'svelte';
	import { WidgetPlaceholder } from 'flowbite-svelte';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';
	export let aClass;
	let spin = true;
	let data;
	onMount(async () => {
		fetch('/api/DB/hit')
			.then((response) => response.json())
			.then(({ apiData }) => {
				data = apiData;
				spin = false;
			});
	});
</script>

<div class={aClass}>
	<div class="pb-3 pl-5 text-2xl font-extrabold text-gray-500 dark:text-gray-400">Hit Ratio</div>
	{#if spin}
		<WidgetPlaceholder />
	{:else}
		<Table striped={true}>
			<TableHead class="bg-gray-200 dark:bg-gray-700">
				<TableHeadCell class="text-gray-800 dark:text-gray-300">Server Name</TableHeadCell>
				<TableHeadCell class="text-gray-800 dark:text-gray-300 ">DB Name</TableHeadCell>
				<TableHeadCell class="text-gray-800 dark:text-gray-300 ">Logical Reads</TableHeadCell>
				<TableHeadCell class="text-gray-800 dark:text-gray-300 ">Phys Reads</TableHeadCell>
				<TableHeadCell class="text-gray-800 dark:text-gray-300 ">Hit Ratio</TableHeadCell>
			</TableHead>
			<TableBody>
				{#key data}
					{#each data as db (db.id)}
						<TableBodyRow>
							<TableBodyCell>{db.name}</TableBodyCell>
							<TableBodyCell>{db.dbName}</TableBodyCell>
							<TableBodyCell>{db.LR.toLocaleString('en-US')}</TableBodyCell>
							<TableBodyCell>{db.PR.toLocaleString('en-US')}</TableBodyCell>
							<TableBodyCell>
								{#if parseFloat(db.HR) < 70}
									<span class="text-red-500">{parseFloat(db.HR).toFixed(2)}</span>
								{:else}
									{parseFloat(db.HR).toFixed(2)}
								{/if}
							</TableBodyCell>
						</TableBodyRow>
					{:else}
						<div class=" font-semibold text-2xl text-blue-700">No Tags Added!</div>
					{/each}
				{/key}
			</TableBody>
		</Table>
	{/if}
</div>
