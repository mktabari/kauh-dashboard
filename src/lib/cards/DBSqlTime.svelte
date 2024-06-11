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
		Pagination,
		Modal,
		ButtonGroup,
		Button
	} from 'flowbite-svelte';

	export let aClass;
	let spin = true;
	let data;
	let page = 1;
	let pages = [];
	let rows = [];
	let server;
	let db;
	let details;
	let colorList = [];

	onMount(() => {
		fetch('/api/DB/sqlTime')
			.then((response) => response.json())
			.then(({ apiData }) => {
				data = apiData;
				rows = data[0].rows;
				server = data[0].name;
				db = data[0].dbName;
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
	});
	const setActivePage = () => {
		pages.forEach((element, i) => {
			if (page === i + 1) element.active = true;
			else element.active = false;
		});
		pages = pages;
	};
	const previous = () => {
		if (page !== 1) page--;
		setActivePage();
	};
	const next = () => {
		let temp = data.filter((row) => row.name === server && row.dbName === db);
		if (page < Math.ceil(temp[0].rows.length / 10)) page++;
		setActivePage();
	};
	const handleClick = (e) => {
		page = parseInt(e.target.innerHTML);
		setActivePage();
	};

	const changeServer = (_server, _db, _i) => {
		server = _server;
		db = _db;
		rows = data.filter((row) => row.name === server && row.dbName === db)[0].rows;
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
		setActivePage();
	};
</script>

<div class={aClass}>
	<!-- <div class="pb-3 pl-5 text-2xl font-extrabold text-gray-500 dark:text-gray-400">SQL Waits</div> -->
	{#if spin}
		<div class="w-full p-10 text-center">
			<Spinner size={8} />
		</div>
	{:else}
		<div class="flex justify-between">
			<div class=" pb-2">
				<ButtonGroup>
					{#each data as server, i}
						<Button
							color={colorList[i]}
							on:click={() => changeServer(server.name, server.dbName, i)}
							>{server.name}({server.dbName})</Button
						>
					{/each}</ButtonGroup
				>
			</div>
			<div class="flex justify-end">
				<Pagination
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
		<Table striped={true} shadow>
			<TableHead class="bg-gray-200 dark:bg-gray-700">
				<TableHeadCell class="text-gray-800 dark:text-gray-300">SQL Text</TableHeadCell>
				<TableHeadCell class="text-gray-800 dark:text-gray-300 ">Calls</TableHeadCell>
				<TableHeadCell class="text-gray-800 dark:text-gray-300 ">Time/Call</TableHeadCell>
				<TableHeadCell class="text-gray-800 dark:text-gray-300 ">Cost</TableHeadCell>
				<TableHeadCell class="text-gray-800 dark:text-gray-300 ">Hash Value</TableHeadCell>
			</TableHead>
			<TableBody>
				{#key rows}
					{#each rows as row, i}
						{#if i >= page * 10 - 10 && i <= page * 10}
							<TableBodyRow>
								<TableBodyCell on:click={() => (details = row)}
									>{row.SQL_TEXT.substring(0, 130)}</TableBodyCell
								>
								<TableBodyCell>{row.CALLS}</TableBodyCell>
								<TableBodyCell>{row.TIME}</TableBodyCell>
								<TableBodyCell>{row.COST}</TableBodyCell>
								<TableBodyCell
									>{row.HASH_VALUE}
									<Copy id="hv{row.HASH_VALUE}" value={row.HASH_VALUE.toString()} name={'HV'} />
								</TableBodyCell>
							</TableBodyRow>
						{/if}
					{:else}
						<div class=" font-semibold text-2xl text-blue-700 pl-5 pt-3 pb-2">No Data!</div>
					{/each}
				{/key}
			</TableBody>
		</Table>
		<Modal title="Complete SQL text" open={!!details} autoclose outsideclose>
			{details.SQL_TEXT}
		</Modal>
	{/if}
</div>
