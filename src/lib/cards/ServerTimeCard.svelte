<script>
	import { Spinner, Card, Button, Input } from 'flowbite-svelte';
	import { onMount, onDestroy } from 'svelte';
	import { timeChange } from '$lib/stores/timeChange';
	export let server;
	export let timeEditing = false;
	export let doTimeUpdate = false;

	let serverTime = '';
	let serverDate = '';
	let hhOriginel = 0;
	let hh = '';
	let mm = '';
	let ss = '';
	let year = '';
	let month = '';
	let day = '';
	let intervalId;

	$: {
		hh = parseInt(hhOriginel) + $timeChange;
	}

	onMount(() => {
		timeChange.reset;
		fetch('/api/ssh/uptime/' + server.id)
			.then((response) => response.json())
			.then(({ UpTime }) => {
				let serverDateTime = UpTime.split(' ');
				serverTime = serverDateTime[1].split(':');
				hh = serverTime[0];
				hhOriginel = hh;
				mm = serverTime[1];
				ss = serverTime[2];
				serverDate = serverDateTime[0];
				let dateArry = serverDate.split('/');
				day = dateArry[0];
				month = dateArry[1];
				year = dateArry[2];
				intervalId = setInterval(updateTime, 1000);
			});
	});
	const updateTime = () => {
		if (ss >= 59) {
			if (mm >= 59) {
				if (hh >= 23) {
					hh = 0;
					mm = 0;
					ss = 0;
				} else {
					hh++;
					mm = 0;
					ss = 0;
				}
			} else {
				mm++;
				ss = 0;
			}
		} else {
			ss++;
		}
	};

	const enableTimeEdit = () => {
		timeEditing = true;
	};
	const saveTimeEdit = () => {
		timeEditing = false;
		doTimeUpdate = false;
		fetch(
			`/api/ssh/setTime/${server.id}/${month}${day}${hh.toString().padStart(2, '0')}${mm
				.toString()
				.padStart(2, '0')}`
		)
			.then((response) => response.json())
			.then(({ UpTime }) => {
				console.log(UpTime);
			});
	};
	onDestroy(() => clearInterval(intervalId));

	$: fontSize = server.name.length >= 15 ? 'text-lg' : 'text-xl';

	$: if (doTimeUpdate) {
		saveTimeEdit();
	}
</script>

<Card class="h-full  w-80  hover:shadow-2xl" padding="none" rounded={false}
	><div class="w-full px-6 pt-6">
		<div class="flex justify-between">
			<span
				class="flex h-full w-max items-center justify-center font-extrabold uppercase {fontSize} font-Bruno text-red-600 underline"
			>
				{server.name}
			</span>

			<div class=" pr-5">
				<span class="material-symbols-outlined md-36 md-dark dark:text-blue-200">tab_recent</span>
			</div>
		</div>
		<div class="flex flex-col justify-end">
			{#if serverTime === ''}
				<span
					class="font-Orbitron mt-4 flex h-full w-full justify-center text-xl font-extrabold uppercase text-gray-400"
				>
					<Spinner size={8} color="blue" />
				</span>
			{:else}
				<div class="flex flex-row justify-between pb-1">
					{#if !timeEditing}
						<Button btnClass=" " on:click={enableTimeEdit}
							><span class="material-symbols-outlined hover:text-red-500"> edit </span></Button
						>
					{:else}
						<Button btnClass=" " on:click={saveTimeEdit}
							><span class="material-symbols-outlined hover:text-red-500"> save </span></Button
						>
					{/if}
					<span
						class="text-md font-digital mx-3 flex justify-end font-extrabold uppercase text-gray-400"
					>
						{serverDate}
					</span>
				</div>

				<span
					class=" font-digital mx-3 flex justify-center rounded bg-gray-100 bg-gradient-to-b from-transparent to-gray-100 text-5xl font-extrabold uppercase text-gray-400 shadow-inner animate-in zoom-in duration-700 dark:bg-gray-800 dark:to-gray-900"
					>{#if !timeEditing}
						{hh.toString().padStart(2, '0')}:{mm.toString().padStart(2, '0')}:{ss
							.toString()
							.padStart(2, '0')}
					{:else}
						<input
							name="hh"
							type="number"
							bind:value={hh}
							class=" font-digital mt-1 h-full w-16 border-0 bg-transparent text-2xl font-extrabold ring-0 focus:ring-0"
						/>:<input
							name="mm"
							type="number"
							bind:value={mm}
							class=" font-digital mt-1 h-full w-16 border-0 bg-transparent text-2xl font-extrabold ring-0 focus:ring-0"
						/>:<input
							name="ss"
							type="number"
							bind:value={ss}
							class=" font-digital mt-1 h-full w-16 border-0 bg-transparent text-2xl font-extrabold ring-0 focus:ring-0"
						/>
					{/if}
				</span>
			{/if}
		</div>
		<div class="text-sm opacity-0">
			<span class=" pb-1 text-xs">id:{server.id}</span>
		</div>
	</div>
</Card>
