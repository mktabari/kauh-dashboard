<script>
	import AppCard from './AppCard.svelte';
	import {
		contentClass,
		activeClasses,
		defaultClass,
		inactiveClasses
	} from '$lib/generalsStyle/index';
	import { fade } from 'svelte/transition';
	import { flip } from 'svelte/animate';
	import { Tabs, TabItem } from 'flowbite-svelte';

	export let data;

	let { servers } = data;
</script>

<Tabs style="none" {contentClass} {inactiveClasses} {activeClasses} {defaultClass}>
	<TabItem open>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> dns </span>
			Application Servers List
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
						<AppCard {server} />
					</div>
				{:else}
					<div class=" font-semibold text-2xl text-blue-700">No Servers Added!</div>
				{/each}
			{/key}
		</div>
	</TabItem>
</Tabs>
