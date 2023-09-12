<script>
	import { onMount } from 'svelte';
	import { WidgetPlaceholder } from 'flowbite-svelte';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Badge
	} from 'flowbite-svelte';
	export let aClass;
	let spin = true;
	let data;
	onMount(async () => {
		fetch('/api/DB/up')
			.then((response) => response.json())
			.then(({ apiData }) => {
				data = apiData;
				spin = false;
			});
	});
</script>

<div class={aClass}>
	<div class="pb-3 pl-5 text-2xl font-extrabold text-gray-500 dark:text-gray-400">DB Status</div>
	{#if spin}
		<WidgetPlaceholder />
	{:else}
		<Table striped={true}>
			<TableBody>
				{#key data}
					{#each data as db (db.id)}
						<TableBodyRow>
							<TableBodyCell>{db.dbName}</TableBodyCell>
							<TableBodyCell>{db.INSTANCE_NAME}</TableBodyCell>
							<TableBodyCell
								>{#if db.STATUS === 'OPEN'}<Badge color="green"
										><span class="material-symbols-outlined my-1"> arrow_upward </span></Badge
									>
								{:else}<Badge color="red"
										><span class="material-symbols-outlined my-1"> arrow_downward </span></Badge
									>{/if}</TableBodyCell
							>
						</TableBodyRow>
					{:else}
						<div class=" font-semibold text-2xl text-blue-700">No Tags Added!</div>
					{/each}
				{/key}
			</TableBody>
		</Table>
	{/if}
</div>
