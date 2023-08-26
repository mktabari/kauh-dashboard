<script>
	import { fly } from 'svelte/transition';
	import { circInOut } from 'svelte/easing';
	import { onDestroy } from 'svelte';
	import Chart from 'chart.js/auto';
	import {
		Tabs,
		TabItem,
		Skeleton,
		Table,
		TextPlaceholder,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Button,
		TableSearch,
		ButtonGroup,
		Progressbar,
		Accordion,
		AccordionItem,
		Toast,
		Toggle
	} from 'flowbite-svelte';
	import { v4 as uuid } from 'uuid';
	import BackupLogList from '$lib/cards/BackupLogList.svelte';
	import {
		contentClass,
		inactiveClasses,
		activeClasses,
		defaultClass
	} from '$lib/generalsStyle/index';
	import DbCard from '$lib/cards/DBCard.svelte';

	import ServerBG from '$lib/buttonGroup/ServerBG.svelte';
	export let data;

	let { servers, lockServers } = data;
	let returnedServerId;
	let serverData;
	let serverLockData;
	let serverAlertData;
	let serverDrData;
	let serverChartData;
	let bkLog = '';
	let currentFile = '';
	let spin = false;
	let searchTerm = '';
	let filteredItems = [];
	let allColor = 'light';
	let blockingColor = 'blue';
	let userColor = 'blue';
	let lockType = 'all';
	let sortKey = 'SID';
	let sortDirection = 1;
	let displayItems = [...filteredItems];
	let tableSpaceAdd = false;
	let tablespaceButtonClicked = [];
	$: if (serverData) {
		tablespaceButtonClicked = [];
		tableSpaceAdd = false;
	}
	$: if (serverLockData) {
		filteredItems = serverLockData.filter(
			(item) =>
				(item.OBJECT_NAME.indexOf(searchTerm.toUpperCase()) !== -1 ||
					item.USERNAME.indexOf(searchTerm.toUpperCase()) !== -1) &&
				((lockType === 'blocking' && item.BLOCKED_USERNAME !== null) ||
					(lockType === 'user' && item.BLOCKED_USERNAME === null) ||
					lockType === 'all')
		);

		displayItems = [...filteredItems];
	}
	const handleKillSession = async (e, SID, SERIAL, INST_ID, SERVERID) => {
		const response = await fetch(`/api/DB/locks/${SERVERID}/${SID}/${SERIAL}/${INST_ID}`);
		if (!response.ok) {
			console.log('problem');
			return;
		} else {
			e.currentTarget.disabled = true;
			e.currentTarget.parentElement.parentElement.classList.add(
				'line-through',
				'text-red-600',
				'decoration-2'
			);
		}
	};
	const handleAddDatafile = async (ts, SERVERID) => {
		// console.log(`/api/DB/ts/${SERVERID}/${ts}`);
		// const response = { ok: true };
		const response = await fetch(`/api/DB/ts/${SERVERID}/${ts}`);
		if (!response.ok) {
			console.log('problem');

			return;
		} else {
			try {
				toastTrigger();
			} catch (error) {
				console.log(error);
			}
		}
	};

	let toastShow = false;
	let toastCounter = 0;
	const toastTrigger = () => {
		toastShow = true;
		toastCounter = 6;
		toastTimeout();
	};

	const toastTimeout = () => {
		if (--toastCounter > 0) return setTimeout(toastTimeout, 1000);
		toastShow = false;
	};

	const sortTable = (key) => {
		if (sortKey === key) {
			sortDirection = -sortDirection;
		} else {
			sortKey = key;
			sortDirection = 1;
		}
	};

	$: {
		const sorted = [...displayItems].sort((a, b) => {
			const aVal = a[sortKey];
			const bVal = b[sortKey];
			if (aVal < bVal) {
				return -sortDirection;
			} else if (aVal > bVal) {
				return sortDirection;
			}
			return 0;
		});
		displayItems = sorted;
	}
	let reader;
	const getAlertStream = async (serverId) => {
		serverAlertData = '';
		stopReader();
		const response = await fetch(`/api/ssh/alert/realTime/${serverId}`);
		reader = response.body.pipeThrough(new TextDecoderStream()).getReader();
		while (true) {
			const { value, done } = await reader.read();
			if (done) break;
			spin = false;
			serverAlertData += `${value}`;
		}
	};
	onDestroy(() => {
		stopReader();
		tablespaceButtonClicked = [];
	});
	const stopReader = () => {
		reader?.cancel();
	};
	let chart;
	let charCanvas;
	let chartPeriod = 'year';
	let yearColor = 'light';
	let months6Color = 'blue';
	let monthColor = 'blue';
	let periodGrowthRate = 0;
	const chartDB = async () => {
		if (chart) chart.destroy();

		let dbname = serverChartData[0].dbName;
		let multiplier = serverChartData[0].size > 1000 ? 1000 : 1;
		let growthRate = multiplier === 1000 ? 'growth rate in MB' : 'growth rate in GB';
		periodGrowthRate =
			serverChartData[serverChartData.length - 1].size -
			serverChartData[0].size /
				(new Date(serverChartData[serverChartData.length - 1].date).getTime() -
					new Date(serverChartData[0].date).getTime()) /
				(1000 * 3600 * 24);
		chart = new Chart(charCanvas, {
			data: {
				labels: serverChartData.map((row) => new Date(row.date).toLocaleDateString()),
				datasets: [
					{
						type: 'line',
						label: `${dbname} size (GB)`,
						data: serverChartData.map((row) => row.size)
					},
					{
						type: 'bar',
						label: growthRate,
						data: serverChartData
							.map((row) => row.size)
							.map(
								(row, i) =>
									multiplier *
									(row -
										(i === 0
											? serverChartData.map((row) => row.size)[i]
											: serverChartData.map((row) => row.size)[i - 1]))
							)
					}
				]
			}
		});
	};

	const updateChart = () => {
		if (chart) {
			let refrenceDate = new Date();
			refrenceDate.setHours(0, 0);
			switch (chartPeriod) {
				case 'month':
					refrenceDate.setDate(refrenceDate.getDate() - 31);
					break;
				case '6months':
					refrenceDate.setDate(refrenceDate.getDate() - 6 * 30);
					break;
				default:
					refrenceDate.setDate(refrenceDate.getDate() - 365);
			}
			data = serverChartData.filter((row) => new Date(row.date) >= refrenceDate);
			chart.config.data.labels = data.map((row) => new Date(row.date).toLocaleDateString());
			chart.data.datasets[0].data = data.map((row) => row.size);
			chart.data.datasets[1].data = chart.data.datasets[0].data.map(
				(row, i) =>
					row - (i === 0 ? chart.data.datasets[0].data[i] : chart.data.datasets[0].data[i - 1])
			);
			periodGrowthRate =
				data[data.length - 1].size -
				data[0].size /
					(new Date(data[data.length - 1].date).getTime() - new Date(data[0].date).getTime()) /
					(1000 * 3600 * 24);
			chart.update();
		}
	};
	$: if (serverChartData) chartDB();
</script>

<Toast
	class="z-50"
	transition={fly}
	params={{ y: 200 }}
	color="green"
	position="bottom-right"
	bind:open={toastShow}
>
	<svelte:fragment slot="icon">
		<svg
			aria-hidden="true"
			class="h-5 w-5"
			fill="currentColor"
			viewBox="0 0 20 20"
			xmlns="http://www.w3.org/2000/svg"
			><path
				fill-rule="evenodd"
				d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
				clip-rule="evenodd"
			/></svg
		>
		<span class="sr-only">Check icon</span>
	</svelte:fragment>
	Data File Added successfully.
</Toast>
<Tabs style="none" {contentClass} {inactiveClasses} {activeClasses} {defaultClass}>
	<TabItem open>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> database </span>
			Database List
		</div>
		<div class="flex w-full flex-row flex-wrap gap-2">
			{#each servers as server, i}
				<div class="w-full" in:fly={{ x: 500, easing: circInOut, delay: 150 * i }}>
					<DbCard {server} />
				</div>
			{/each}
		</div>
	</TabItem>
	<TabItem>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> lock </span>
			Database Locks
		</div>
		<div class="flex flex-col gap-2">
			<div class="flex w-full">
				<ServerBG
					servers={lockServers}
					label="select a server for Locks:"
					bind:serverData={serverLockData}
					bind:spin
					apiName="DB/locks"
				/>
			</div>
			<div class=" relative">
				{#if spin}
					<TextPlaceholder size="xxl" class="my-8" />
					<Skeleton size="xl" class=" mb-2.5" />
					<TextPlaceholder size="xxl" class="my-8" />
					<Skeleton size="xl" class=" mb-2.5" />
					<TextPlaceholder size="xl" class="my-8" />
				{:else if serverLockData}
					<ButtonGroup
						class=" absolute right-0 top-0 z-40 -translate-x-1/4 translate-y-1/2 space-x-px"
					>
						<Button
							color={allColor}
							class="bg-gray-700"
							on:click={() => {
								allColor = 'light';
								blockingColor = 'blue';
								userColor = 'blue';
								lockType = 'all';
							}}>All</Button
						>
						<Button
							color={blockingColor}
							class="bg-gray-700"
							on:click={() => {
								allColor = 'blue';
								blockingColor = 'light';
								userColor = 'blue';
								lockType = 'blocking';
							}}>Blocking</Button
						>
						<Button
							color={userColor}
							class="bg-gray-700"
							on:click={() => {
								allColor = 'blue';
								blockingColor = 'blue';
								userColor = 'light';
								lockType = 'user';
							}}>User</Button
						>
					</ButtonGroup>
					<TableSearch
						placeholder="Search by object name"
						hoverable={true}
						bind:inputValue={searchTerm}
						striped={true}
						shadow
						divClass="relative overflow-x-auto shadow-md sm:rounded-lg bg-slate-200 p-0"
					>
						<TableHead class="bg-slate-200">
							<TableHeadCell
								class="text-blue-800 hover:cursor-pointer"
								on:click={() => sortTable('USERNAME')}>username</TableHeadCell
							>
							<TableHeadCell
								class="text-blue-800 hover:cursor-pointer"
								on:click={() => sortTable('SID')}>sid</TableHeadCell
							>
							<TableHeadCell
								class="text-blue-800 hover:cursor-pointer"
								on:click={() => sortTable('SERIAL')}>SERIAL#</TableHeadCell
							>
							<TableHeadCell
								class="text-blue-800 hover:cursor-pointer"
								on:click={() => sortTable('OBJECT_NAME')}>locked object</TableHeadCell
							>
							<TableHeadCell
								class="text-blue-800 hover:cursor-pointer"
								on:click={() => sortTable('SECONDS_IN_WAIT')}>siw</TableHeadCell
							>
							<TableHeadCell
								class="text-blue-800 hover:cursor-pointer"
								on:click={() => sortTable('TYPE')}>lock type</TableHeadCell
							>
							<TableHeadCell
								class="text-blue-800 hover:cursor-pointer"
								on:click={() => sortTable('LOCK_MODE')}>lock_mode</TableHeadCell
							>
							<TableHeadCell
								class="text-blue-800 hover:cursor-pointer"
								on:click={() => sortTable('INSTANCE')}>instance</TableHeadCell
							>
							<TableHeadCell
								class="text-blue-800 hover:cursor-pointer"
								on:click={() => sortTable('MACHINE')}>MACHINE</TableHeadCell
							>
							<TableHeadCell
								class="text-blue-800 hover:cursor-pointer"
								on:click={() => sortTable('BLOCKED_INSTANCE')}>blocked instance</TableHeadCell
							>
							<TableHeadCell
								class="text-blue-800 hover:cursor-pointer"
								on:click={() => sortTable('BLOCKED_USERNAME')}>blocked USERNAME</TableHeadCell
							>
							<TableHeadCell
								class="text-blue-800 hover:cursor-pointer"
								on:click={() => sortTable('SECONDS_BLOCKED')}>sib</TableHeadCell
							>
							<TableHeadCell class="text-blue-800 hover:cursor-pointer"
								><span class="sr-only"> Kill </span></TableHeadCell
							>
						</TableHead>
						<TableBody>
							{#key serverLockData}
								{#each displayItems as row (uuid())}
									<TableBodyRow>
										<TableBodyCell>{row.USERNAME}</TableBodyCell>
										<TableBodyCell>{row.SID}</TableBodyCell>
										<TableBodyCell>{row.SERIAL}</TableBodyCell>
										<TableBodyCell>{row.OBJECT_NAME === null ? '' : row.OBJECT_NAME}</TableBodyCell>
										<TableBodyCell>{row.SECONDS_IN_WAIT}</TableBodyCell>
										<TableBodyCell>{row.TYPE}</TableBodyCell>
										<TableBodyCell>{row.LOCK_MODE}</TableBodyCell>
										<TableBodyCell>{row.INSTANCE}</TableBodyCell>
										<TableBodyCell>{row.MACHINE.replace('\x00', '')}</TableBodyCell>
										<TableBodyCell
											>{row.BLOCKED_INSTANCE === null ? '' : row.BLOCKED_INSTANCE}</TableBodyCell
										>
										<TableBodyCell
											>{row.BLOCKED_USERNAME === null ? '' : row.BLOCKED_USERNAME}</TableBodyCell
										>
										<TableBodyCell
											>{row.SECONDS_BLOCKED === null ? '' : row.SECONDS_BLOCKED}</TableBodyCell
										>
										<TableBodyCell
											><Button
												size="xs"
												class=" bg-red-600 hover:bg-red-800 disabled:bg-gray-500 dark:bg-red-500  dark:hover:bg-red-700  disabled:dark:bg-cyan-500"
												on:click={(e) => {
													handleKillSession(e, row.SID, row.SERIAL, row.INST_ID, row.SERVERID);
												}}>Kill</Button
											></TableBodyCell
										>
									</TableBodyRow>
								{:else}
									<TableBodyRow>
										<TableBodyCell colspan="13"
											><span class="font-semibold text-lg">No Match!</span></TableBodyCell
										>
									</TableBodyRow>
								{/each}
							{/key}
						</TableBody>
					</TableSearch>
				{/if}
			</div>
		</div>
	</TabItem>
	<TabItem>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> full_stacked_bar_chart </span>
			Tablespaces
		</div>
		<div class="flex flex-col gap-2">
			<div class="flex w-full">
				<ServerBG
					{servers}
					label="select a server for Tablespace:"
					bind:serverData
					bind:spin
					apiName="DB/ts"
				/>
			</div>
			<div class="flex flex-row flex-wrap gap-6">
				{#if spin}
					<div>
						<TextPlaceholder size="xxl" class="my-8" />
						<Skeleton size="xl" class=" mb-2.5" />
						<TextPlaceholder size="xxl" class="my-8" />
						<Skeleton size="xl" class=" mb-2.5" />
						<TextPlaceholder size="xl" class="my-8" />
					</div>
				{:else if serverData}
					<Table striped={true} shadow>
						<TableHead class="bg-slate-200">
							<TableHeadCell class="bg-slate-200 text-blue-800">tablespace</TableHeadCell>
							<TableHeadCell class="text-blue-800">nof</TableHeadCell>
							<TableHeadCell class="text-blue-800">bytes(GB)</TableHeadCell>
							<TableHeadCell class="text-blue-800">max bytes(gb)</TableHeadCell>
							<TableHeadCell class="text-blue-800">percent</TableHeadCell>
							<TableHeadCell class="text-blue-800">
								<Toggle
									size="small"
									name="ts"
									bind:value={tableSpaceAdd}
									checked={tableSpaceAdd}
									class="mb-1 text-primary-800 dark:text-primary-800"
									on:change={() => {
										tableSpaceAdd = !tableSpaceAdd;
									}}>Enable</Toggle
								></TableHeadCell
							>
						</TableHead>
						<TableBody>
							{#key serverData}
								{#each serverData as row (uuid())}
									<TableBodyRow>
										<TableBodyCell>{row.TABLESPACE_NAME}</TableBodyCell>
										<TableBodyCell>{row.NOF}</TableBodyCell>
										<TableBodyCell>{row.BYTES}</TableBodyCell>
										<TableBodyCell>{row.MAXBYTES}</TableBodyCell>
										<TableBodyCell class="w-96"
											><Progressbar
												progress={row.PERCENT}
												size="h-6"
												labelInside
												labelInsideClass="bg-blue-600 text-blue-100 text-base font-medium text-center p-1 leading-none rounded-full w-96"
											/></TableBodyCell
										>
										<TableBodyCell
											>{#if row.REMAINING < 3}
												<button
													disabled={!tableSpaceAdd ||
														tablespaceButtonClicked.filter((item) => {
															return item === row.TABLESPACE_NAME;
														}).length > 0}
													size="xs"
													class=" rounded-lg bg-cyan-500 px-5 py-2 hover:bg-cyan-800 hover:text-cyan-100 disabled:bg-gray-500 dark:bg-cyan-500 dark:hover:bg-cyan-700 disabled:dark:bg-cyan-500"
													on:click={(e) => {
														e.currentTarget.disabled = true;
														tablespaceButtonClicked.push(row.TABLESPACE_NAME);
														// tablespaceButtonClicked = [...tablespaceButtonClicked];
														handleAddDatafile(row.TABLESPACE_NAME, row.SERVERID);
													}}
													>Add Data File
												</button>
											{/if}</TableBodyCell
										>
									</TableBodyRow>
								{:else}
									<div class=" font-semibold text-blue-700 p-5 w-full">No Match!</div>
								{/each}
							{/key}
						</TableBody>
					</Table>
				{/if}
			</div>
		</div>
	</TabItem>
	<TabItem>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> info </span>
			Alert Log
		</div>
		<div class="flex flex-col gap-2">
			<div class="flex w-full">
				<ServerBG
					{servers}
					label="select a server for alert log file:"
					bind:serverData={serverAlertData}
					bind:spin
					apiName="ssh/alert/lastLines"
					check="dbAlert"
					bind:returnedServerId
				/>{#if returnedServerId}
					<div class="flex flex-row items-center align-middle font-bold text-gray-500">
						<span>Alert log real time:</span>
						<button
							on:click={() => {
								spin = true;
								getAlertStream(returnedServerId);
							}}
							><span
								style="
			font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48"
								class="material-symbols-outlined md-48 hover:cursor-pointer hover:text-green-500"
							>
								play_arrow
							</span></button
						><button
							on:click={() => {
								stopReader();
								spin = false;
								serverAlertData = null;
							}}
							><span
								style="
			font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48"
								class="material-symbols-outlined md-48 hover:cursor-pointer hover:text-red-500"
							>
								stop
							</span></button
						>
					</div>
				{/if}
			</div>
			<div class=" overflow-x-auto overflow-y-auto rounded-lg bg-black px-4 pt-4 text-white">
				{#if spin}
					<TextPlaceholder size="xxl" class="my-8" />
					<Skeleton size="xl" class=" mb-2.5" />
					<TextPlaceholder size="xxl" class="my-8" />
					<Skeleton size="xl" class=" mb-2.5" />
					<TextPlaceholder size="xl" class="my-8" />
				{:else if serverAlertData}
					<pre>{serverAlertData}</pre>
				{:else}
					<div class="pb-10">no alert log file selected</div>
				{/if}
			</div>
		</div>
	</TabItem>
	<TabItem>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> file_copy </span>
			Backups
		</div>
		<div class="flex flex-row flex-wrap gap-6">
			<div class="flex flex-col gap-3">
				<Accordion multiple flush defaultClass=" w-72 py-0">
					{#key servers}
						{#each servers as server (server.id)}
							{#if server.bkLogDir}
								<AccordionItem>
									<span
										slot="header"
										class="font-Bruno font-extrabold uppercase tracking-widest text-red-600 underline"
										>{server.name}</span
									>
									<!-- class="relative border border-blue-700 rounded-md p-3 pb-0 dark:text-blue-200 hover:bg-slate-200 hover:shadow-lg w-80" -->
									<BackupLogList {server} bind:bkLog bind:spin bind:currentFile />
								</AccordionItem>
							{/if}
						{:else}
							<div class=" font-semibold text-2xl text-blue-700">No Servers Tagged for Backup!</div>
						{/each}
					{/key}</Accordion
				>
			</div>
			<div class=" flex-1 overflow-x-auto overflow-y-auto rounded-lg bg-black px-4 pt-4 text-white">
				{#if spin}
					<TextPlaceholder size="xxl" class="my-8" />
					<Skeleton size="xxl" class=" mb-2.5" />
					<TextPlaceholder size="xxl" class="my-8" />
					<Skeleton size="xl" class=" mb-2.5" />
					<TextPlaceholder size="xxl" class="my-8" />
				{:else if bkLog}
					<pre>
						{bkLog}</pre>
				{:else}
					no backup log file selected
				{/if}
			</div>
		</div>
	</TabItem>
	<TabItem>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> security </span>
			DR
		</div>
		<div class="flex flex-col gap-2">
			<div class="flex w-full">
				<ServerBG
					{servers}
					label="select a server for DR commands:"
					bind:serverData={serverDrData}
					bind:spin
					apiName="ssh/dr/status"
					check="drInstance"
				/>
				{#if serverDrData}
					<div class="flex flex-row items-center gap-5 pl-5 align-middle font-bold text-gray-500">
						<span>DR transport actions:</span>
						<span
							style="
				font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48"
							class="material-symbols-outlined md-48 hover:cursor-pointer hover:text-green-500"
						>
							play_arrow
						</span>
						<span
							style="
				font-variation-settings: 'FILL' 1, 'wght' 400, 'GRAD' 0, 'opsz' 48"
							class="material-symbols-outlined md-48 hover:cursor-pointer hover:text-red-500"
						>
							stop
						</span>
					</div>
				{/if}
			</div>

			<div class=" overflow-x-auto overflow-y-auto rounded-lg bg-black px-4 pt-4 text-white">
				{#if spin}
					<TextPlaceholder size="xxl" class="my-8" />
					<Skeleton size="xl" class=" mb-2.5" />
					<TextPlaceholder size="xxl" class="my-8" />
					<Skeleton size="xl" class=" mb-2.5" />
				{:else if serverDrData}
					<pre>{serverDrData}</pre>
				{:else}
					<div class="pb-10">no server selected</div>
				{/if}
			</div>
		</div>
	</TabItem>
	<TabItem>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> monitoring </span>
			Growth Rate
		</div>
		<div class="flex flex-col gap-2">
			<div class="flex w-full">
				<ServerBG
					{servers}
					label="select a server for growth rate chart:"
					bind:serverData={serverChartData}
					bind:spin
					apiName="DB/size/chart"
					bind:returnedServerId
				/>
			</div>
			<div class=" relative overflow-x-auto overflow-y-auto rounded-lg">
				{#if spin}
					<TextPlaceholder size="xxl" class="my-8" />
					<Skeleton size="xl" class=" mb-2.5" />
					<TextPlaceholder size="xxl" class="my-8" />
					<Skeleton size="xl" class=" mb-2.5" />
					<TextPlaceholder size="xl" class="my-8" />
				{:else if serverChartData}
					<ButtonGroup
						class=" absolute right-0 top-0 z-40 -translate-x-1/4 translate-y-1/2 space-x-px"
					>
						<Button
							color={yearColor}
							class="bg-gray-700"
							on:click={() => {
								yearColor = 'light';
								months6Color = 'blue';
								monthColor = 'blue';
								chartPeriod = 'year';
								updateChart();
								// chartDB();
							}}>Year</Button
						>
						<Button
							color={months6Color}
							class="bg-gray-700"
							on:click={() => {
								yearColor = 'blue';
								months6Color = 'light';
								monthColor = 'blue';
								chartPeriod = '6months';
								updateChart();
								// chartDB();
							}}>6 Months</Button
						>
						<Button
							color={monthColor}
							class="bg-gray-700"
							on:click={() => {
								yearColor = 'blue';
								months6Color = 'blue';
								monthColor = 'light';
								chartPeriod = 'month';
								updateChart();
								// chartDB();
							}}>Month</Button
						>
					</ButtonGroup>
					<div class=" py-2 font-bold text-gray-500">
						Growth Rate for the period is:{periodGrowthRate} GB/Day
					</div>
				{:else}
					<div class="pb-10">no alert log file selected</div>
				{/if}
				<canvas bind:this={charCanvas} />
			</div>
		</div>
	</TabItem>
</Tabs>
