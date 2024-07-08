<script>
	import {
		Tabs,
		TabItem,
		MultiSelect,
		Spinner,
		Radio,
		Button,
		Input,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	import {
		contentClass,
		inactiveClasses,
		activeClasses,
		defaultClass
	} from '$lib/generalsStyle/index';
	import { GoogleSpin } from 'svelte-loading-spinners';
	import DBCurrentSql from '$lib/cards/DBCurrentSql.svelte';
	import DBSqlTime from '$lib/cards/DBSqlTime.svelte';
	import DBTrans from '$lib/cards/DBTrans.svelte';

	import ServerBG from '$lib/buttonGroup/ServerBG.svelte';
	import DbLongOperations from '$lib//cards/DBLongOperations.svelte';
	let aClass = 'h-full rounded-xl  p-3 ';
	export let data;

	let { lockServers } = data;
	let awrSpin = false;
	$: {
		if (serverAWRtData) {
			multiSelect = serverAWRtData.map((item) => {
				return { value: item.SNAPID, name: `${item.SNAPID} - ${item.BEGIN}` };
			});
		}
	}
	$: {
		returnedServerId ? (selected = []) : null;
	}
	let returnedServerId;
	let serverAWRtData;
	let awrReport;
	let repName;
	let serverName;
	let startSnapId;
	let endSnapId;
	let repType = 'awr';
	$: if (repType) awrReport = '';
	let selected = [];
	let multiSelect = [];
	let spin = false;
	let sqlID;
	let planSpin = false;
	let planData;
	let serverLongOps;
</script>

<Tabs style="none" {contentClass} {inactiveClasses} {activeClasses} {defaultClass}>
	<TabItem open>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> bolt </span> Current SQLs
		</div>
		<div class="flex flex-col gap-2">
			<DBCurrentSql {aClass} />
		</div>
	</TabItem>
	<TabItem>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> hourglass_top </span> SQL Time
		</div>
		<div class="flex flex-col gap-2">
			<DBSqlTime {aClass} />
		</div>
	</TabItem>
	<TabItem>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> swap_horizontal_circle </span> Transactions
		</div>
		<div class="flex flex-col gap-2">
			<DBTrans {aClass} />
		</div>
	</TabItem>
	<TabItem>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> manage_search </span>
			Execution Plan
		</div>
		<div class="flex flex-col gap-2">
			<div class="flex w-full">
				<ServerBG
					servers={lockServers}
					label="select a server for SQL Execution Plan:"
					bind:spin
					apiName=""
					bind:returnedServerId
				/>
			</div>
			<div class=" relative mt-5">
				{#if spin}
					<div class=" flex w-full justify-center">
						<Spinner />
					</div>
				{:else if returnedServerId}
					<div class="flex w-full flex-row gap-2">
						<div class="grow">
							<Input bind:value={sqlID} size="lg" />
						</div>

						<Button
							disabled={!sqlID || !returnedServerId}
							on:click={() => {
								planSpin = true;
								planData = undefined;
								fetch(`/api/DB/sqlPlan/${returnedServerId}/${sqlID}`)
									.then((response) => response.json())
									.then(({ apiData }) => {
										planData = apiData;
										planSpin = false;
									});
							}}>Show</Button
						>
					</div>
					{#if planSpin}
						<div class=" mb-5 mt-10 flex w-full justify-center">
							<GoogleSpin duration="2.5s" size="70px" />
						</div>
					{/if}
					{#if planData}
						<div class=" mt-5 w-full">
							<Table striped={true} shadow>
								<TableHead class="bg-gray-200 dark:bg-gray-700">
									<TableHeadCell class="text-center text-gray-800 dark:text-gray-300"
										>ID</TableHeadCell
									>
									<TableHeadCell class="text-left text-gray-800 dark:text-gray-300 "
										>OPERATION</TableHeadCell
									>
									<TableHeadCell class="text-left text-gray-800 dark:text-gray-300 "
										>OBJECT NAME</TableHeadCell
									>
									<TableHeadCell class="text-center text-gray-800 dark:text-gray-300 "
										>COST</TableHeadCell
									>
									<TableHeadCell class="text-center text-gray-800 dark:text-gray-300 "
										>CARDINALITY</TableHeadCell
									>
									<TableHeadCell class="text-center text-gray-800 dark:text-gray-300 "
										>CPU COST</TableHeadCell
									>
									<TableHeadCell class="text-center text-gray-800 dark:text-gray-300 "
										>IO COST</TableHeadCell
									>
									<TableHeadCell class="text-left text-gray-800 dark:text-gray-300 "
										>ACCESS</TableHeadCell
									>
									<TableHeadCell class="text-left text-gray-800 dark:text-gray-300 "
										>FILTER</TableHeadCell
									>
								</TableHead>
								<TableBody>
									{#each planData as row, i}
										<TableBodyRow>
											<TableBodyCell
												tdClass="px-3 py-1 whitespace-nowrap font-medium"
												class="text-center">{row.ID}</TableBodyCell
											>
											<TableBodyCell
												tdClass="px-3 py-1 whitespace-nowrap font-medium"
												class="text-left"><pre class="w-full">{row.OPERATION}</pre></TableBodyCell
											>
											<TableBodyCell
												tdClass="px-3 py-1 whitespace-nowrap font-medium"
												class="text-left">{row.OBJECT_NAME || ''}</TableBodyCell
											>
											<TableBodyCell
												tdClass="px-3 py-1 whitespace-nowrap font-medium"
												class="text-center"
												>{row.COST
													? new Intl.NumberFormat('en-GB').format(row.COST.toFixed(0))
													: ''}</TableBodyCell
											>
											<TableBodyCell
												tdClass="px-3 py-1 whitespace-nowrap font-medium"
												class="text-center"
												>{row.CARDINALITY
													? new Intl.NumberFormat('en-GB').format(row.CARDINALITY.toFixed(0))
													: ''}</TableBodyCell
											>
											<TableBodyCell
												tdClass="px-3 py-1 whitespace-nowrap font-medium"
												class="text-center"
												>{row.CPU_COST
													? new Intl.NumberFormat('en-GB').format(row.CPU_COST.toFixed(0))
													: ''}</TableBodyCell
											>
											<TableBodyCell
												tdClass="px-3 py-1 whitespace-nowrap font-medium"
												class="text-center"
												>{row.IO_COST
													? new Intl.NumberFormat('en-GB').format(row.IO_COST.toFixed(0))
													: ''}</TableBodyCell
											>
											<TableBodyCell
												tdClass="px-3 py-1 whitespace-nowrap font-medium"
												class="text-left">{row.ACCESS_PREDICATES || ''}</TableBodyCell
											>
											<TableBodyCell
												tdClass="px-3 py-1 whitespace-nowrap font-medium"
												class="text-left">{row.FILTER_PREDICATES || ''}</TableBodyCell
											>
										</TableBodyRow>
									{/each}
								</TableBody>
							</Table>

							<pre class="w-full" />
						</div>
					{/if}
				{/if}
			</div>
		</div>
	</TabItem>
	<TabItem>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> scan </span>
			Long Operations
		</div>
		<div class="flex flex-col gap-2">
			<DbLongOperations {aClass} />
		</div>
	</TabItem>
	<TabItem>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> description </span>
			AWR Report
		</div>
		<div class="flex flex-col gap-2">
			<div class="flex w-full">
				<ServerBG
					servers={lockServers}
					label="select a server for AWR report:"
					bind:serverData={serverAWRtData}
					bind:spin
					apiName="DB/awr"
					bind:returnedServerId
				/>
			</div>
			<div class=" relative mt-5">
				{#if spin}
					<div class=" flex w-full justify-center">
						<Spinner />
					</div>
				{:else if serverAWRtData}
					<div class="flex w-full flex-row gap-2">
						<div class="grow">
							<MultiSelect items={multiSelect} bind:value={selected} size="lg" />
						</div>
						<Radio name="repType" custom value="awr" bind:group={repType}>
							<div
								class="inline-flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-primary-600 peer-checked:text-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:border-primary-300 dark:peer-checked:text-primary-300"
							>
								<div class=" text-lg font-semibold">AWR</div>
							</div>
						</Radio>
						<Radio name="repType" custom value="addm" bind:group={repType}>
							<div
								class="inline-flex cursor-pointer items-center justify-between rounded-lg border border-gray-200 bg-white p-3 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-primary-600 peer-checked:text-primary-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:border-primary-300 dark:peer-checked:text-primary-300"
							>
								<div class=" text-lg font-semibold">ADDM</div>
							</div>
						</Radio>
						<Button
							disabled={selected.length < 2}
							on:click={() => {
								awrSpin = true;
								awrReport = undefined;
								startSnapId = Math.min(
									...selected.map((item) => {
										return parseInt(item);
									})
								);
								endSnapId = Math.max(
									...selected.map((item) => {
										return parseInt(item);
									})
								);

								fetch(`/api/ssh/${repType}/${returnedServerId}/${startSnapId}/${endSnapId}`)
									.then((response) => response.json())
									.then(({ report, dbName, name }) => {
										repName = dbName;
										serverName = name;
										awrSpin = false;
										awrReport = report;
									});
							}}>Generate</Button
						>
						<Button
							disabled={!awrReport}
							on:click={() => {
								let a = document.createElement('a');
								document.body.append(a);
								if (repType === 'awr') {
									a.download = `${serverName}-${repName}-${startSnapId}-${endSnapId}.html`;
									a.href = URL.createObjectURL(new Blob([awrReport], { type: 'text/html' }));
								} else {
									a.download = `${serverName}-${repName}-${startSnapId}-${endSnapId}.txt`;
									a.href = URL.createObjectURL(new Blob([awrReport], { type: 'text/text' }));
								}
								a.click();
								a.remove();
							}}>Dpwnload</Button
						>
					</div>
					{#if awrSpin}
						<div class=" mb-5 mt-10 flex w-full justify-center">
							<GoogleSpin duration="2.5s" size="70px" />
						</div>
					{/if}
					{#if awrReport}
						{#if repType === 'awr'}
							<div class=" mt-5">
								{@html awrReport}
							</div>
						{:else}
							<div class=" mt-5 w-full">
								<pre class="w-full">
{awrReport}
</pre>
							</div>
						{/if}
					{/if}
				{/if}
			</div>
		</div>
	</TabItem>
</Tabs>
