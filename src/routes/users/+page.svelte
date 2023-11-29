<script>
	/** @type {import('./$types').PageData} */
	import { fly } from 'svelte/transition';
	import { onMount } from 'svelte';
	import Copy from '$lib/component/Copy.svelte';
	import {
		contentClass,
		inactiveClasses,
		activeClasses,
		defaultClass
	} from '$lib/generalsStyle/index';
	import {
		Tabs,
		TabItem,
		Button,
		Badge,
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		TextPlaceholder,
		Toast
	} from 'flowbite-svelte';
	import { CloseCircleSolid } from 'flowbite-svelte-icons';
	let spin = true;
	let spinInactive = true;
	let users;
	let usersInactive;
	let practitionerToastShow = false;
	let userToastShow = false;
	let ts_tost_message;
	onMount(() => {
		fetch('/api/DB/users')
			.then((response) => response.json())
			.then(({ apiData }) => {
				users = apiData;
				spin = false;
			});
		fetch('/api/DB/users/inactive')
			.then((response) => response.json())
			.then(({ apiData }) => {
				usersInactive = apiData;
				spinInactive = false;
			});
	});
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
	let deactivatedUsers = [];
	const deactivateUser = (UI, PI, AC) => {
		fetch(`/api/DB/users/${PI}/am_practitioner/${AC}`)
			.then((response) => response.json())
			.then(({ status }) => {
				if (status === 'ok') {
					fetch(`/api/DB/users/${UI}/sm_appl_user/${AC}`)
						.then((response) => response.json())
						.then(({ status }) => {
							if (status === 'ok') {
								deactivatedUsers.push(UI);
								deactivatedUsers = [...deactivatedUsers];
							} else {
								if (AC === 'D') {
									ts_tost_message = 'Unable To Diactivate User.';
								} else {
									ts_tost_message = 'Unable To Activate User.';
								}
								toastTrigger();
							}
						});
				} else {
					if (AC === 'D') {
						ts_tost_message = 'Unable To Diactivate Practitioner.';
					} else {
						ts_tost_message = 'Unable To Activate Practitioner.';
					}
					toastTrigger();
				}
			});
	};
</script>

<Toast
	class="z-50"
	transition={fly}
	params={{ y: 200 }}
	color="red"
	position="bottom-right"
	bind:open={toastShow}
	><svelte:fragment slot="icon">
		<CloseCircleSolid class="h-5 w-5" />
		<span class="sr-only">Error icon</span>
	</svelte:fragment>
	{ts_tost_message}
</Toast>
<Toast
	class="z-50"
	transition={fly}
	params={{ y: 200 }}
	color="red"
	position="bottom-right"
	bind:open={userToastShow}
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
	Unable to Disable User.
</Toast>
<Toast
	class="z-50"
	transition={fly}
	params={{ y: 200 }}
	color="red"
	position="bottom-right"
	bind:open={practitionerToastShow}
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
	Unable to Disable Practitioner.
</Toast>
<Tabs style="none" {contentClass} {inactiveClasses} {activeClasses} {defaultClass}>
	<TabItem open>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> person </span>
			Active Users
		</div>

		<div class="flex flex-row flex-wrap gap-6">
			<Table striped={true} shadow>
				<TableHead class="bg-slate-200">
					<TableHeadCell class="text-blue-800">Employee Number</TableHeadCell>
					<TableHeadCell class="text-right text-blue-800">Full Name</TableHeadCell>
					<TableHeadCell class="text-right text-blue-800">Job</TableHeadCell>
					<TableHeadCell class="text-blue-800">Appl User Id</TableHeadCell>
					<TableHeadCell class="text-blue-800">Practitioner Id</TableHeadCell>
					<TableHeadCell class="text-blue-800">
						<span class="sr-only"> Edit </span>
					</TableHeadCell>
				</TableHead>
				<TableBody>
					{#if spin}
						<TextPlaceholder size="xxl" class="my-8" />
						<TextPlaceholder size="xxl" class="my-8" />
					{:else if users}
						{#each users as user}
							<TableBodyRow>
								<TableBodyCell class="text-center">{user.EMPNUM}</TableBodyCell>
								<TableBodyCell class=" text-right text-lg ">{user.FN}</TableBodyCell>
								<TableBodyCell class=" text-right text-lg ">{user.JOB}</TableBodyCell>
								<TableBodyCell class="text-center"
									>{user.AUI}
									<Copy id="id{user.AUI}" value={user.AUI} name="Appl User ID" /></TableBodyCell
								>
								<TableBodyCell class="text-center"
									>{user.PI}
									<Copy id="id{user.PI}" value={user.PI} name="Practitioner ID" /></TableBodyCell
								>

								<TableBodyCell
									><Button
										disabled={user.AP > 0 ||
											deactivatedUsers.filter((item) => {
												return item === user.AUI;
											}).length > 0}
										size="xs"
										class=" bg-red-500 hover:bg-red-800 dark:bg-red-500 dark:hover:bg-red-700  "
										on:click={() => {
											deactivateUser(user.AUI, user.PI, 'D');
										}}>Deactivate</Button
									></TableBodyCell
								>
							</TableBodyRow>
						{:else}
							<div class=" font-semibold text-2xl text-blue-700">No Users Needs Action!</div>
						{/each}
					{/if}
				</TableBody>
			</Table>
		</div>
	</TabItem>
	<TabItem>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> person_add </span>
			Inactive Users
		</div>
		<div class="flex flex-row flex-wrap gap-6">
			<Table striped={true} shadow>
				<TableHead class="bg-slate-200">
					<TableHeadCell class="text-blue-800">Employee Number</TableHeadCell>
					<TableHeadCell class="text-right text-blue-800">Full Name</TableHeadCell>
					<TableHeadCell class="text-right text-blue-800">Job</TableHeadCell>
					<TableHeadCell class="text-blue-800">Appl User Id</TableHeadCell>
					<TableHeadCell class="text-blue-800">Practitioner Id</TableHeadCell>
					<TableHeadCell class="text-blue-800">
						<span class="sr-only"> Edit </span>
					</TableHeadCell>
				</TableHead>
				<TableBody>
					{#if spinInactive}
						<TextPlaceholder size="xxl" class="my-8" />
						<TextPlaceholder size="xxl" class="my-8" />
					{:else if usersInactive}
						{#each usersInactive as user}
							<TableBodyRow>
								<TableBodyCell class="text-center">{user.EMPNUM}</TableBodyCell>
								<TableBodyCell class=" text-right text-lg ">{user.FN}</TableBodyCell>
								<TableBodyCell class=" text-right text-lg ">{user.JOB}</TableBodyCell>
								<TableBodyCell class="text-center"
									>{user.AUI}
									<Copy id="id{user.AUI}" value={user.AUI} name="Appl User ID" /></TableBodyCell
								>
								<TableBodyCell class="text-center"
									>{user.PI}
									<Copy id="id{user.PI}" value={user.PI} name="Practitioner ID" /></TableBodyCell
								>

								<TableBodyCell
									><Button
										disabled={deactivatedUsers.filter((item) => {
											return item === user.AUI;
										}).length > 0}
										size="xs"
										class=" bg-green-500 hover:bg-green-800 dark:bg-green-500 dark:hover:bg-green-700  "
										on:click={() => {
											deactivateUser(user.AUI, user.PI, 'E');
										}}>Activate</Button
									></TableBodyCell
								>
							</TableBodyRow>
						{:else}
							<div class=" font-semibold text-2xl text-blue-700">No Users Needs Action!</div>
						{/each}
					{/if}
				</TableBody>
			</Table>
		</div>
	</TabItem>
</Tabs>
