<script>
	import { onMount } from 'svelte';
	import { Button, Toggle, Badge, Indicator, Spinner } from 'flowbite-svelte';
	import { BarLoader } from 'svelte-loading-spinners';
	export let server;
	let pingStatus = false;
	let serverCheckStatus = false;
	let serverStatus;
	let serverStatusInverse;
	let disabled = true;
	let spin = false;
	let color = '#FF3E00';
	let count = 0;

	onMount(async () => {
		pingServer();
	});
	const pingServer = () => {
		fetch('/api/ping/' + server.id)
			.then((response) => response.json())
			.then(({ isAlive }) => {
				if (isAlive) {
					pingStatus = true;
					checkServer();
					disabled = false;
				} else {
					pingStatus = false;
				}
			});
	};
	const checkServer = () => {
		fetch('/api/app/' + server.id)
			.then((response) => response.json())
			.then(({ status }) => {
				if (status === 'ok') {
					serverCheckStatus = true;
					fetch(`/api/app/${server.id}/machines`)
						.then((response) => response.json())
						.then(({ apiData }) => {
							count = apiData.reduce((p, element) => {
								return (p += element.rows[0].C);
							}, 0);
						});
				} else {
					serverCheckStatus = false;
				}
				serverStatus = serverCheckStatus;
				serverStatusInverse = !serverStatus;
				// console.log(status);
			});
	};

	const toggleServer = () => {
		color = serverStatus ? '#0ab23d' : '#FF3E00';
		spin = true;
		disabled = true;
		let action = serverStatus ? 'start' : 'stop';
		fetch(`/api/ssh/app/${server.id}/${action}`)
			.then((response) => response.json())
			.then(() => {
				checkServer();
				disabled = false;
				spin = false;
			});
	};

	const toggleServerInverse = () => {
		serverStatus = !serverStatusInverse;
		toggleServer();
	};
	const restartServer = () => {
		color = '#FF3E00';
		spin = true;
		disabled = true;
		let action = 'reboot';
		fetch(`/api/ssh/app/${server.id}/${action}`)
			.then((response) => response.json())
			.then(async () => {
				await new Promise((resolve) => {
					setTimeout(resolve, 100000);
				});
				spin = false;
				pingServer();
			});
	};
</script>

<div
	class:border-l-red-500={!pingStatus}
	class:border-l-green-500={pingStatus}
	class:border-r-red-500={!serverCheckStatus}
	class:border-r-green-500={serverCheckStatus}
	class="m-0 w-72 overflow-hidden rounded border-l-8 border-r-8 bg-white p-0 shadow-md dark:border-gray-700 dark:bg-gray-800"
>
	<button
		disabled={serverCheckStatus || disabled}
		on:click={restartServer}
		class=" absolute right-0 top-0 -translate-x-1/2 translate-y-0.5"
	>
		<span
			class:hover:text-red-600={!serverCheckStatus && !disabled}
			class="material-symbols-outlined md-18 text-gray-500"
		>
			power_settings_new
		</span>
	</button>
	<button on:click={pingServer} class=" absolute left-0 top-0 translate-x-1/2 translate-y-0.5">
		<span class="material-symbols-outlined md-18 text-gray-500 hover:text-red-600"> sync </span>
	</button>
	<div class="flex flex-row justify-between py-2 dark:text-gray-200">
		<div class="flex flex-col gap-1 pl-3 pt-2">
			<div>
				<span
					class="font-Bruno items-center pr-1 text-xl font-extrabold uppercase text-red-600 underline"
				>
					{server.name}
				</span>
				<Badge color="red" rounded class="px-2.5 py-0.5">
					{count}
				</Badge>
			</div>
			<div class="text-sm font-semibold text-gray-500">
				IP: {server.ip}
				<a href="http://{server.ip}/HIS" target="_blank"
					><span class="material-symbols-outlined md-18 translate-y-1"> open_in_new </span></a
				>
			</div>
		</div>

		<div class=" flex flex-col items-center justify-center">
			{#if serverCheckStatus}
				<Toggle color="green" {disabled} bind:checked={serverStatus} on:change={toggleServer} />
			{:else}
				<Toggle
					color="red"
					{disabled}
					class=" -translate-x-3 rotate-180"
					bind:checked={serverStatusInverse}
					on:change={toggleServerInverse}
				/>
			{/if}
		</div>
	</div>
	<div class="h-2 translate-y-1">
		{#if spin}
			<BarLoader size="136" {color} unit="px" duration="1s" />
		{/if}
	</div>
</div>
