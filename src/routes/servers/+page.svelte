<script>
	import ServerCard from '$lib/cards/ServerCard.svelte';
	import {
		contentClass,
		activeClasses,
		defaultClass,
		inactiveClasses
	} from '$lib/generalsStyle/index';
	import { invalidateAll } from '$app/navigation';
	import { fade, fly } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { Tabs, TabItem, Button, Toggle, Modal, Toast } from 'flowbite-svelte';
	import ServerForm from '$lib/forms/ServerForm.svelte';
	//load data
	export let data;

	let { servers, allTags } = data;

	//form submit data
	//export let form;
	//form data

	//page logic

	let deleteServerToggle = true;

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

	const handleDeleteServerToggle = () => {
		deleteServerToggle = !deleteServerToggle;
	};
	let popupModal = false;
	$: serverID = '';
	$: serverName = '';
	const handleDeleteServer = (id, name) => {
		popupModal = true;
		serverID = id;
		serverName = name.toUpperCase();
	};
	const deletServer = async () => {
		let response = await fetch('/api/servers/' + serverID, {
			method: 'DELETE'
		});
		if (!response.ok) {
			console.log('problem');
			return;
		} else {
			try {
				let deletedServer = await response.json();
				serverName = deletedServer.name;
				await invalidateAll();
				servers = data.servers;

				toastTrigger();
			} catch (error) {
				console, log(error);
			}
		}
	};
</script>

<Toast
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
	Server {serverName} removed successfully.
</Toast>
<Modal bind:open={popupModal} size="xs" autoclose color="red">
	<div class="text-center">
		<span class="material-symbols-outlined md-48 font-extrabold text-red-700 dark:text-red-500">
			error
		</span>
		<h3 class="mb-5 text-lg font-normal text-gray-500 dark:text-gray-400">
			Are you sure you want to delete this Server <span class=" font-bold text-red-600"
				>{serverName}</span
			>?
		</h3>
		<Button color="red" class="mr-2" on:click={() => deletServer()}>Yes, I'm sure</Button>
		<Button color="alternative">No, cancel</Button>
	</div>
</Modal>
<Tabs style="none" {contentClass} {inactiveClasses} {activeClasses} {defaultClass}>
	<TabItem open>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> library_books </span>
			Servers List
		</div>
		<div class="mb-3 flex justify-end border-blue-800 text-gray-800">
			<div class="flex">
				Delete Server
				<Toggle
					color="red"
					size="small"
					bind:value={deleteServerToggle}
					class="ml-2 text-gray-800"
					on:change={handleDeleteServerToggle}
				/>
			</div>
		</div>
		<div class="flex flex-row flex-wrap gap-6">
			{#key data}
				{#each servers as server, i (server.id)}
					<div
						in:fade={{ duartion: 500, delay: 200 * i }}
						out:fade|local
						animate:flip={{ duration: 500, delay: 500 }}
						class="relative"
					>
						<!-- class="relative border border-blue-700 rounded-md p-3 pb-0 dark:text-blue-200 hover:bg-slate-200 hover:shadow-lg w-80" -->
						<ServerCard
							{server}
							{deleteServerToggle}
							on:click={() => handleDeleteServer(server.id, server.name)}
						/>
					</div>
				{:else}
					<div class=" font-semibold text-2xl text-blue-700">No Servers Added!</div>
				{/each}
			{/key}
		</div>
	</TabItem>
	<TabItem>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> library_add </span>
			Add Server
		</div>
		<div>
			<form method="POST">
				<ServerForm {allTags} />
				<div class=" mt-5">
					<Button type="submit" formaction="?/createServer">Add Server</Button>
				</div>
			</form>
		</div>
	</TabItem>
</Tabs>
