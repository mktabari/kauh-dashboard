<script>
	import {
		contentClass,
		inactiveClasses,
		activeClasses,
		defaultClass
	} from '$lib/generalsStyle/index';
	import { Tabs, TabItem, Button } from 'flowbite-svelte';
	import ServerTimeCard from '$lib/cards/ServerTimeCard.svelte';
	import { timeChange } from '$lib/stores/timeChange';
	export let data;

	let { servers } = data;
	let doTimeUpdate = false;
	const updateAll = () => {
		doTimeUpdate = true;
	};
</script>

<Tabs style="none" {contentClass} {inactiveClasses} {activeClasses} {defaultClass}>
	<TabItem open>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> overview </span>
			Servers List
		</div>
		<div class="flex flex-row flex-wrap gap-6">
			{#key data}
				{#each servers as server (server.id)}
					<!-- class="relative border border-blue-700 rounded-md p-3 pb-0 dark:text-blue-200 hover:bg-slate-200 hover:shadow-lg w-80" -->
					<ServerTimeCard {server} />
				{:else}
					<div class=" font-semibold text-2xl text-blue-700">No Servers Tagged for Time!</div>
				{/each}
			{/key}
		</div>
	</TabItem>
	<TabItem>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> update </span>
			Change Server Time
		</div>
		<div class=" flex flex-row gap-5 pb-5">
			<Button on:click={updateAll} class="mr-10">Update All</Button>
			<Button color="green" on:click={timeChange.add}
				><span class="material-symbols-outlined"> arrow_circle_up </span></Button
			><Button color="red" on:click={timeChange.subtract}
				><span class="material-symbols-outlined"> expand_circle_down </span></Button
			>
		</div>
		<div class="flex flex-row flex-wrap gap-6">
			{#key data}
				{#each servers as server (server.id)}
					<!-- class="relative border border-blue-700 rounded-md p-3 pb-0 dark:text-blue-200 hover:bg-slate-200 hover:shadow-lg w-80" -->
					<ServerTimeCard {server} timeEditing={true} bind:doTimeUpdate />
				{:else}
					<div class=" font-semibold text-2xl text-blue-700">No Servers Tagged for Time!</div>
				{/each}
			{/key}
		</div>
	</TabItem>
</Tabs>
