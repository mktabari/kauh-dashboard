<script>
	import { onMount } from 'svelte';

	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Spinner
	} from 'flowbite-svelte';

	export let serverId, sqlID;
	let planData = [];
	let planSpin = false;
	onMount(() => {
		planSpin = true;
		planData = [];
		fetch(`/api/DB/sqlPlan/${serverId}/${sqlID}`)
			.then((response) => response.json())
			.then(({ apiData }) => {
				planSpin = false;
				planData = apiData[0];
			});
	});
</script>

{#if planSpin}
	<div class="flex w-full justify-center p-1"><Spinner /></div>
{/if}
{#if planData.length > 0}
	<div class="w-full">
		<Table striped={true} shadow>
			<TableHead class="bg-gray-200 dark:bg-gray-700">
				<TableHeadCell class="text-center text-gray-800 dark:text-gray-300">ID</TableHeadCell>
				<TableHeadCell class="text-left text-gray-800 dark:text-gray-300 ">OPERATION</TableHeadCell>
				<TableHeadCell class="text-left text-gray-800 dark:text-gray-300 "
					>OBJECT NAME</TableHeadCell
				>
				<TableHeadCell class="text-center text-gray-800 dark:text-gray-300 ">COST</TableHeadCell>
				<TableHeadCell class="text-center text-gray-800 dark:text-gray-300 "
					>CARDINALITY</TableHeadCell
				>
				<TableHeadCell class="text-center text-gray-800 dark:text-gray-300 ">CPU COST</TableHeadCell
				>
				<TableHeadCell class="text-center text-gray-800 dark:text-gray-300 ">IO COST</TableHeadCell>
				<TableHeadCell class="text-left text-gray-800 dark:text-gray-300 ">ACCESS</TableHeadCell>
				<TableHeadCell class="text-left text-gray-800 dark:text-gray-300 ">FILTER</TableHeadCell>
			</TableHead>
			<TableBody>
				{#each planData as row}
					<TableBodyRow>
						<TableBodyCell tdClass="px-3 py-1 whitespace-nowrap font-medium" class="text-center"
							>{row.ID}</TableBodyCell
						>
						<TableBodyCell tdClass="px-3 py-1 whitespace-nowrap font-medium" class="text-left"
							><pre class="w-full">{row.OPERATION}</pre></TableBodyCell
						>
						<TableBodyCell tdClass="px-3 py-1 whitespace-nowrap font-medium" class="text-left"
							>{row.OBJECT_NAME || ''}</TableBodyCell
						>
						<TableBodyCell tdClass="px-3 py-1 whitespace-nowrap font-medium" class="text-center"
							>{row.COST
								? new Intl.NumberFormat('en-GB').format(row.COST.toFixed(0))
								: ''}</TableBodyCell
						>
						<TableBodyCell tdClass="px-3 py-1 whitespace-nowrap font-medium" class="text-center"
							>{row.CARDINALITY
								? new Intl.NumberFormat('en-GB').format(row.CARDINALITY.toFixed(0))
								: ''}</TableBodyCell
						>
						<TableBodyCell tdClass="px-3 py-1 whitespace-nowrap font-medium" class="text-center"
							>{row.CPU_COST
								? new Intl.NumberFormat('en-GB').format(row.CPU_COST.toFixed(0))
								: ''}</TableBodyCell
						>
						<TableBodyCell tdClass="px-3 py-1 whitespace-nowrap font-medium" class="text-center"
							>{row.IO_COST
								? new Intl.NumberFormat('en-GB').format(row.IO_COST.toFixed(0))
								: ''}</TableBodyCell
						>
						<TableBodyCell tdClass="px-3 py-1 whitespace-nowrap font-medium" class="text-left"
							>{row.ACCESS_PREDICATES || ''}</TableBodyCell
						>
						<TableBodyCell tdClass="px-3 py-1 whitespace-nowrap font-medium" class="text-left"
							>{row.FILTER_PREDICATES || ''}</TableBodyCell
						>
					</TableBodyRow>
				{/each}
			</TableBody>
		</Table>

		<pre class="w-full" />
	</div>
{/if}
