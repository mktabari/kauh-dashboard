<script>
	import { onMount } from 'svelte';
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
	let root;
	let bt = [];
	let spin = true;
	let data;
	let page = 1;
	let pages = [];
	let rows = [];
	let server;
	let db;
	let details;
	onMount(async () => {
		fetch('/api/DB/sqlTime')
			.then((response) => response.json())
			.then(({ apiData }) => {
				data = apiData;
				rows = data[0].rows;
				server = data[0].name;
				db = data[0].dbName;
				for (let i = 1; i <= Math.ceil(rows.length / 10); i++) {
					pages.push({ name: i });
				}
				spin = false;
			});
	});
	const previous = () => {
		if (page !== 1) page--;
	};
	const next = () => {
		let temp = data.filter((row) => row.name === server && row.dbName === db);
		if (page < Math.ceil(temp[0].rows.length / 10)) page++;
	};
	const handleClick = (x) => {
		page = parseInt(x.target.innerHTML);
	};

	const changeServer = (_server, _db) => {
		server = _server;
		db = _db;
		rows = data.filter((row) => row.name === server && row.dbName === db)[0].rows;
		pages = [];
		for (let i = 1; i <= Math.ceil(rows.length / 10); i++) {
			pages.push({ name: i });
		}
		page = 1;
	};
</script>

<div class={aClass}>
	<div class="pb-3 pl-5 text-2xl font-extrabold text-gray-500 dark:text-gray-400">SQL Waits</div>
	{#if spin}
		<div class="w-full p-10 text-center">
			<Spinner size={8} />
		</div>
	{:else}
		<div class="flex justify-between">
			<div>
				<ButtonGroup>
					{#each data as server}
						<Button on:click={() => changeServer(server.name, server.dbName)}
							>{server.name}({server.dbName})</Button
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
				/>
			</div>
		</div>
		<Table striped={true} shadow>
			<TableHead class="bg-gray-200 dark:bg-gray-700">
				<TableHeadCell class="text-gray-800 dark:text-gray-300">SQL Text</TableHeadCell>
				<TableHeadCell class="text-gray-800 dark:text-gray-300 ">Calls</TableHeadCell>
				<TableHeadCell class="text-gray-800 dark:text-gray-300 ">Time/Call</TableHeadCell>
				<TableHeadCell class="text-gray-800 dark:text-gray-300 ">Hash Value</TableHeadCell>
			</TableHead>
			<TableBody>
				{#key rows}
					{#each rows as row, i}
						{#if i >= page * 10 - 10 && i <= page * 10}
							<TableBodyRow on:click={() => (details = row)}>
								<TableBodyCell>{row.SQL_TEXT.substring(0, 150)}</TableBodyCell>
								<TableBodyCell>{row.CALLS}</TableBodyCell>
								<TableBodyCell>{row.TIME}</TableBodyCell>
								<TableBodyCell>{row.HASH_VALUE}</TableBodyCell>
							</TableBodyRow>
						{/if}
					{:else}
						<div class=" font-semibold text-2xl text-blue-700">No Data!</div>
					{/each}
				{/key}
			</TableBody>
		</Table>
		<Modal title="Complete SQL text" open={!!details} autoclose outsideclose>
			{details.SQL_TEXT}
		</Modal>
	{/if}
</div>
