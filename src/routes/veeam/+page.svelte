<script>
	/** @type {import('./$types').PageData} */
	import { onMount } from 'svelte';
	import { Clock } from 'svelte-loading-spinners';
	import {
		contentClass,
		inactiveClasses,
		activeClasses,
		defaultClass
	} from '$lib/generalsStyle/index';
	import {
		Tabs,
		TabItem,
		Button,
		Badge,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TextPlaceholder,
		Toast
	} from 'flowbite-svelte';
	import { CloseCircleSolid } from 'flowbite-svelte-icons';
	export let data;
	let { servers } = data;
	let backupJobs;
	let spin = true;
	onMount(() => {
		fetch(`/api/ssh/veeam/${servers[0].id}`)
			.then((response) => response.json())
			.then(({ apiData }) => {
				backupJobs = apiData;
				spin = false;
			});
	});
	const duration = (startDate, endDate) => {
		if (endDate !== '1/1/1900 12:00:00 AM')
			return ((Date.parse(endDate) - Date.parse(startDate)) / (1000 * 3600)).toFixed(0);
		return '';
	};
</script>

<Tabs style="none" {contentClass} {inactiveClasses} {activeClasses} {defaultClass}>
	<TabItem open>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> backup </span>
			Cloud Backups
		</div>

		<div class="flex flex-row flex-wrap gap-6">
			{#if spin}
				<div class="flex w-full justify-center p-10">
					<Clock />
				</div>
			{:else if backupJobs}
				<Table striped={true} shadow>
					<TableHead class="bg-slate-200">
						<TableHeadCell class="text-center text-blue-800">Creation Time</TableHeadCell>
						<TableHeadCell class="text-center text-blue-800">End Time</TableHeadCell>
						<TableHeadCell class="text-center text-blue-800">Result</TableHeadCell>
						<TableHeadCell class="text-center text-blue-800">State</TableHeadCell>
						<TableHeadCell class="text-center text-blue-800">Duration (Hour)</TableHeadCell>
					</TableHead>
					<TableBody>
						{#each backupJobs as backupJob}
							<TableBodyRow>
								<TableBodyCell class="text-center">{backupJob.CreationTime}</TableBodyCell>
								<TableBodyCell class="text-center">{backupJob.EndTime}</TableBodyCell>
								<TableBodyCell class="text-center"
									>{#if backupJob.Result === 'Success'}<Badge color="green" class="p-2"
											>{backupJob.Result}</Badge
										>
									{:else if backupJob.Result === 'None'}
										<div />
									{:else}<Badge color="yellow" class="p-2">{backupJob.Result}</Badge>
									{/if}</TableBodyCell
								>
								<TableBodyCell class="text-center">{backupJob.State}</TableBodyCell>
								<TableBodyCell class="text-center"
									>{duration(backupJob.CreationTime, backupJob.EndTime)}</TableBodyCell
								>
							</TableBodyRow>
						{:else}
							<div class=" font-semibold text-2xl text-blue-700 p-10">No Output!</div>
						{/each}
					</TableBody>
				</Table>{/if}
		</div>
	</TabItem>
</Tabs>
