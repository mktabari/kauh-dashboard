<script>
	import { Button, Tooltip, Badge, Card, A, Indicator, Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import Copy from '$lib/component/Copy.svelte';
	import oracle from '$lib/assets/oracle.png';
	import linux from '$lib/assets/linux.png';
	import windows from '$lib/assets/windows.png';
	import emc from '$lib/assets/emc.png';
	export let server;
	export let deleteServerToggle;

	$: memorySpinner = !server.memory ? true : false;
	$: cpuSpinner = !server.cpu ? true : false;
	let status = false;
	let serverUpdated = false;
	onMount(async () => {
		fetch('/api/ping/' + server.id)
			.then((response) => response.json())
			.then(({ isAlive }) => {
				if (isAlive) {
					status = true;
				} else {
					status = false;
				}
			});
		if (
			!server.tags.find((tag) => {
				return tag.name === 'ILOM' && tag.done === true;
			})
		) {
			if (!server.memory) {
				serverUpdated = true;
				await getMemory();
			}
			if (!server.cpu) {
				serverUpdated = true;
				await getCpu();
			}
		}
		if (serverUpdated) {
			updateServer();
		}
	});
	const getMemory = async () => {
		if (server.brand === 'emc') {
			server.memory = ' ';
		} else {
			let response = await fetch(`/api/ssh/mem/${server.id}`);
			let { mem } = await response.json();
			server.memory = mem + 'GB';
		}
	};
	const getCpu = async () => {
		if (server.brand === 'emc') {
			server.cpu = ' ';
		} else {
			let response = await fetch(`/api/ssh/cpu/${server.id}`);
			let { cpu } = await response.json();
			server.cpu = cpu;
		}
	};
	const updateServer = async () => {
		const res = await fetch(`/api/servers/${server.id}`, {
			method: 'PATCH',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(server)
		});
	};
	const refreshServer = async () => {
		server.memory = null;
		server.cpu = null;
		await getMemory();
		await getCpu();
		updateServer();
	};
</script>

<div
	class="absolute right-0 top-0 -translate-y-1/2 translate-x-1/2"
	class:hidden={deleteServerToggle}
>
	<Button pill color="alternative" class="!p-1" size="md" on:click
		><span class="material-symbols-outlined font-bold text-red-700 dark:text-blue-200">
			cancel
		</span></Button
	><Tooltip defaultClass="py-2 px-3 text-sm font-medium w-28 bg-red-400">Delete Server</Tooltip>
</div>
<div class="absolute left-0 top-0 translate-x-1/4 translate-y-1/4">
	{#if status}
		<Badge color="green" rounded class="px-2.5 py-0.5">
			<Indicator color="green" size="xs" class="mr-1" />Up
		</Badge>
	{:else}
		<Badge color="red" rounded class="px-2.5 py-0.5">
			<Indicator color="red" size="xs" class="mr-1" />Down
		</Badge>
	{/if}
</div>

<Card class="h-full px-6 pt-6  hover:shadow-lg hover:ring-1 hover:ring-gray-400" padding="none">
	<div class="flex justify-between">
		<span
			class=" font-Bruno flex h-full w-max items-center justify-center text-xl font-extrabold uppercase text-red-600 underline"
		>
			{server.name}
		</span>

		<div class=" relative text-center">
			{#if server.brand === 'oracle'}
				<img alt="logo" src={oracle} class=" h-10 w-24 object-cover dark:invert" />
			{:else if server.brand === 'windows'}
				<img alt="logo" src={windows} class=" h-10 w-24 object-contain dark:invert" />
			{:else if server.brand === 'linux'}
				<img alt="logo" src={linux} class=" h-10 w-24 object-contain dark:invert" />
			{:else if server.brand === 'emc'}
				<img alt="logo" src={emc} class=" h-10 w-24 object-contain dark:invert" />
			{:else}
				<span class="material-symbols-outlined md-48 md-dark dark:text-blue-200">computer</span>
			{/if}
		</div>
	</div>

	{#if server.tags}
		<div class="flex flex-wrap gap-1 pt-2 font-semibold">
			{#each server.tags.filter((u) => u.done) as tag (tag.id)}
				<Badge border color={tag.color}>{tag.name}</Badge>
			{/each}
		</div>
	{/if}
	<div class="flex justify-between gap-0">
		<div class=" pt-2 text-sm font-semibold">
			IP: {server.ip}
			<Copy id="ip{server.id}" value={server.ip} name="IP" />
		</div>
		{#if server.brand !== 'emc' && !server.tags.find((s) => {
				return s.name === 'ILOM' && s.done === true;
			})}
			<div class="relative flex flex-row pt-2 font-semibold">
				<div class=" h-6 w-6">
					<span class="material-symbols-outlined absolute"> memory </span>
				</div>
				{#if memorySpinner}
					<div class=" h-4 w-4">
						<Spinner size="small" />
					</div>
				{:else}
					{server.memory}
				{/if}
			</div>

			<div class="relative flex flex-row pt-2 font-semibold">
				<div class=" h-6 w-6">
					<span class="material-symbols-outlined absolute"> memory_alt </span>
				</div>
				{#if cpuSpinner}
					<div class=" h-4 w-4">
						<Spinner size="small" />
					</div>
				{:else}
					{server.cpu}
				{/if}
			</div>
			<button Class=" pt-3 " on:click={refreshServer}>
				<span class="material-symbols-outlined md-18 text-gray-500 hover:text-red-500"> sync </span>
			</button>
		{/if}
	</div>

	<A
		href="/servers/{server.id}"
		class="  text-center"
		color="text-gray-500 hover:text-red-500"
		aClass="inline-flex hover:underline"
		><span
			class="material-symbols-outlined absolute right-0 top-0 -translate-x-1/2 translate-y-1/2"
		>
			tune
		</span>
	</A>
	<div class="flex h-full w-full items-end justify-end pt-1">
		<span class="pb-1 text-xs opacity-40">id:{server.id}</span>
		<Copy id="id{server.id}" value={server.id} name="ID" />
	</div>
</Card>
