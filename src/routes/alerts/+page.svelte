<script>
	import { onMount } from 'svelte';
	import { Tabs, TabItem, Skeleton, TextPlaceholder } from 'flowbite-svelte';
	import {
		contentClass,
		inactiveClasses,
		activeClasses,
		defaultClass
	} from '$lib/generalsStyle/index';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Spinner,
		Pagination,
		ButtonGroup,
		Button,
		Badge
	} from 'flowbite-svelte';
	let root;
	let spin = true;
	let serverSpin = true;
	let data;
	let serverData;
	let page = 1;
	let pages = [];
	let rows = [];
	let serverRows;
	let san;
	let server;
	let colorList = [];
	let colorListServer = [];

	onMount(async () => {
		fetch('/api/san/alert')
			.then((response) => response.json())
			.then(({ apiData }) => {
				data = apiData;
				san = data[0].name;
				// alert = data[0].alert;
				rows = data[0].alert;
				for (let i = 1; i <= Math.ceil(rows.length / 10); i++) {
					if (i === 1) {
						pages.push({ name: i, active: true });
					} else {
						pages.push({ name: i, active: false });
					}
				}
				spin = false;
				data.forEach((element, i) => {
					if (i === 0) colorList[i] = 'dark';
					else colorList[i] = 'light';
				});
			});
		fetch('/api/servers/alert')
			.then((response) => response.json())
			.then(({ apiData }) => {
				serverData = apiData;
				server = serverData[0].name;
				// alert = data[0].alert;
				serverRows = serverData[0].alert;
				serverSpin = false;
				serverData.forEach((element, i) => {
					if (i === 0) colorListServer[i] = 'dark';
					else colorListServer[i] = 'light';
				});
			});
	});
	const previous = () => {
		if (page !== 1) page--;
		setActivePage();
	};
	const next = () => {
		let temp = data.filter((row) => row.name === san);
		if (page < Math.ceil(temp[0].alert.length / 10)) page++;
		setActivePage();
	};
	const handleClick = (x) => {
		page = parseInt(x.target.innerHTML);
		setActivePage();
	};
	const setActivePage = () => {
		pages.forEach((element, i) => {
			if (page === i + 1) element.active = true;
			else element.active = false;
		});
		pages = pages;
	};
	const changeSan = (_san, _i) => {
		san = _san;
		rows = data.filter((row) => row.name === san)[0].alert;
		pages = [];
		for (let i = 1; i <= Math.ceil(rows.length / 10); i++) {
			if (i === 1) {
				pages.push({ name: i, active: true });
			} else {
				pages.push({ name: i, active: false });
			}
		}
		page = 1;
		colorList = colorList.map((element, i) => {
			if (i === _i) return 'dark';
			else return 'light';
		});
	};
	const changeServer = (_server, _i) => {
		server = _server;
		serverRows = serverData.filter((row) => row.name === server)[0].alert;
		colorListServer = colorListServer.map((element, i) => {
			if (i === _i) return 'dark';
			else return 'light';
		});
	};
</script>

<Tabs style="none" {contentClass} {inactiveClasses} {activeClasses} {defaultClass}>
	<TabItem open>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> storage </span>
			San Alerts
		</div>
		{#if spin}
			<div class="w-full p-10 text-center">
				<Spinner size={8} />
			</div>
		{:else}
			<div class="flex justify-between">
				<div class=" pb-2">
					<ButtonGroup>
						{#each data as san, i}
							<Button color={colorList[i]} on:click={() => changeSan(san.name, i)}
								>{san.name}</Button
							>
						{/each}</ButtonGroup
					>
				</div>
				<div class="flex justify-end">
					<Pagination
						bind:this={root}
						{pages}
						on:previous={previous}
						on:next={next}
						on:click={handleClick}
						class="pb-1 "
						activeClass="text-gray-100 border border-gray-300 bg-gray-700 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-700 dark:text-white"
						normalClass="text-gray-500 bg-white hover:bg-gray-100 hover:text-gray-700 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
					/>
				</div>
			</div>
			<Table striped={true} shadow class="w-full">
				<TableHead class="bg-gray-200 dark:bg-gray-700">
					<TableHeadCell class="text-gray-800 dark:text-gray-300">Alert Serverity</TableHeadCell>
					<TableHeadCell class="text-gray-800 dark:text-gray-300">Date</TableHeadCell>
					<TableHeadCell class="text-gray-800 dark:text-gray-300">Alert Component</TableHeadCell>
					<TableHeadCell class="text-gray-800 dark:text-gray-300 ">Message</TableHeadCell>
					<!-- <TableHeadCell class="text-gray-800 dark:text-gray-300 ">Description</TableHeadCell> -->
				</TableHead>
				<TableBody>
					{#each rows as row, i}
						{#if i >= page * 10 - 10 && i <= page * 10}
							<TableBodyRow>
								<TableBodyCell>
									{#if row.content.severity == '1' || row.content.severity == '2'}
										<Badge color="red" border large>{row.content.severity}</Badge>
									{:else if row.content.severity == '3' || row.content.severity == '4'}
										<Badge color="yellow" border large>{row.content.severity}</Badge>
									{:else}
										<Badge color="green" border large>{row.content.severity}</Badge>
									{/if}
								</TableBodyCell>
								<TableBodyCell>{new Date(row.content.timestamp).toLocaleString()}</TableBodyCell>
								<TableBodyCell>{row.content.id}</TableBodyCell>
								<TableBodyCell tdClass="px-6 py-4 font-medium "
									><p>{row.content.message}</p></TableBodyCell
								>
							</TableBodyRow>
						{/if}
					{:else}
						<div class=" font-semibold text-xl text-blue-700 pl-5 pt-3 pb-2">No Alerts!</div>
					{/each}
				</TableBody>
			</Table>
		{/if}
	</TabItem>
	<TabItem>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> computer </span>
			Server Alerts
		</div>
		{#if serverSpin}
			<div class="w-full p-10 text-center">
				<Spinner size={8} />
			</div>
		{:else}
			<div class="flex justify-between">
				<div class=" pb-2">
					<ButtonGroup>
						{#each serverData as server, i}
							<Button color={colorListServer[i]} on:click={() => changeServer(server.name, i)}
								>{server.name}</Button
							>
						{/each}</ButtonGroup
					>
				</div>
			</div>
			<div class=" overflow-x-auto overflow-y-auto rounded-lg bg-black px-4 py-4 text-white">
				{#if spin}
					<TextPlaceholder size="xxl" class="my-8" />
					<Skeleton size="xl" class=" mb-2.5" />
					<TextPlaceholder size="xxl" class="my-8" />
					<Skeleton size="xl" class=" mb-2.5" />
					<TextPlaceholder size="xl" class="my-8" />
				{:else if serverRows}
					<pre>{serverRows}</pre>
				{:else}
					<div class="pb-10">select alerts</div>
				{/if}
			</div>
		{/if}
	</TabItem>
</Tabs>
