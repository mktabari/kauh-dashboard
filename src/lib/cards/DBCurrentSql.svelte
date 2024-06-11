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
		Button,
		Badge,
		P
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
		getData();
	});
	const getData = () => {
		spin = true;
		fetch('/api/DB/sqlCurrent')
			.then((response) => response.json())
			.then(({ apiData }) => {
				pages = [];
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
	};
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
	<!-- <div class="pb-3 pl-5 text-2xl font-extrabold text-gray-500 dark:text-gray-400">Current SQLs</div> -->
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
			<div class="pb-2">
				<button
					class=" rounded-md border border-gray-300 bg-white px-2 py-1 text-gray-500 hover:bg-gray-100 hover:text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white"
					on:click={getData}
					><span class="material-symbols-outlined translate-y-1"> refresh </span></button
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
				<TableHeadCell colspan="2" />
				<TableHeadCell colspan="2" class=" pb-0 text-center"
					><div class="mx-1 border-b border-gray-700">CPU</div></TableHeadCell
				>
				<TableHeadCell colspan="2" class=" pb-0 text-center"
					><div class="mx-1 border-b border-gray-700">IO</div></TableHeadCell
				>
				<TableHeadCell colspan="2" class=" pb-0 text-center"
					><div class="mx-1 border-b border-gray-700">Elapsed</div></TableHeadCell
				>
				<TableHeadCell />
			</TableHead>
			<TableHead class="bg-gray-200 dark:bg-gray-700">
				<TableHeadCell class="w-1/2 pt-0 text-gray-800 dark:text-gray-300">SQL Text</TableHeadCell>
				<TableHeadCell class=" pt-0   text-center text-gray-800 dark:text-gray-300"
					>Calls</TableHeadCell
				>
				<TableHeadCell class=" pt-0 text-center text-gray-800 dark:text-gray-300">
					Avg</TableHeadCell
				>
				<TableHeadCell class=" pt-0 text-center text-gray-800 dark:text-gray-300">
					Tot</TableHeadCell
				>
				<TableHeadCell class=" pt-0 text-center text-gray-800 dark:text-gray-300">
					Avg</TableHeadCell
				>
				<TableHeadCell class=" pt-0 text-center text-gray-800 dark:text-gray-300">
					Tot</TableHeadCell
				>
				<TableHeadCell class=" pt-0 text-center text-gray-800 dark:text-gray-300">
					Avg</TableHeadCell
				>
				<TableHeadCell class=" pt-0 text-center text-gray-800 dark:text-gray-300">
					Tot</TableHeadCell
				>
				<TableHeadCell class=" pt-0 text-center text-gray-800 dark:text-gray-300">ID</TableHeadCell>
			</TableHead>
			<TableBody>
				{#key rows}
					{#each rows as row, i}
						{#if i >= page * 10 - 10 && i <= page * 10}
							<TableBodyRow>
								<TableBodyCell
									tdClass="w-1/2 px-6 py-4 font-medium"
									on:click={() => (details = row)}
									><p class="line-clamp-1 w-full overflow-hidden" style="word-break: break-all;">
										{row.SQL_TEXT}
									</p></TableBodyCell
								>
								<TableBodyCell class="text-center">{row.EXE}</TableBodyCell>
								<TableBodyCell class="text-center"
									>{#if row.CPU_AVG > 60}
										<Badge large class="font-semibold" color="red">{row.CPU_AVG.toFixed(2)}</Badge>
									{:else}
										{row.CPU_AVG.toFixed(2)}
									{/if}
								</TableBodyCell>
								<TableBodyCell class="text-center">{row.CPU_TOT.toFixed(2)}</TableBodyCell>
								<TableBodyCell class="text-center"
									>{#if row.IO_AVG > 60}
										<Badge large class="font-semibold" color="red">{row.IO_AVG.toFixed(2)}</Badge>
									{:else}
										{row.IO_AVG.toFixed(2)}
									{/if}
								</TableBodyCell>
								<TableBodyCell class="text-center">{row.IO_TOT.toFixed(2)}</TableBodyCell>
								<TableBodyCell class="text-center">
									{#if row.ELA_AVG > 60}
										<Badge large class="font-semibold" color="red">{row.ELA_AVG.toFixed(2)}</Badge>
									{:else}
										{row.ELA_AVG.toFixed(2)}
									{/if}</TableBodyCell
								>
								<TableBodyCell class="text-center">{row.ELA_TOT.toFixed(2)}</TableBodyCell>
								<TableBodyCell class="text-center">
									<Copy id="hv{row.SQL_ID}" value={row.SQL_ID.toString()} name={'HV'} />
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
