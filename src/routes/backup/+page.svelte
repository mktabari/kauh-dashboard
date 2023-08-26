<script>
	import {
		contentClass,
		inactiveClasses,
		activeClasses,
		defaultClass
	} from '$lib/generalsStyle/index';
	import {
		Tabs,
		TabItem,
		Skeleton,
		TextPlaceholder,
		Accordion,
		AccordionItem
	} from 'flowbite-svelte';
	import BackupLogList from '$lib/cards/BackupLogList.svelte';
	export let data;

	let { servers } = data;
	let bkLog = '';
	let currentFile = '';
	let spin = false;
</script>

<Tabs style="none" {contentClass} {inactiveClasses} {activeClasses} {defaultClass}>
	<TabItem open>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> file_copy </span>
			Servers List
		</div>
		<div class="flex flex-row flex-wrap gap-6">
			<div class="flex flex-col gap-3">
				<Accordion multiple flush defaultClass="text-gray-500 dark:text-gray-400 w-64 py-0">
					{#key data}
						{#each servers as server (server.id)}
							<AccordionItem>
								<span
									slot="header"
									class="uppercase font-extrabold font-Bruno text-red-600 underline tracking-widest"
									>{server.name}</span
								>
								<!-- class="relative border border-blue-700 rounded-md p-3 pb-0 dark:text-blue-200 hover:bg-slate-200 hover:shadow-lg w-80" -->
								<BackupLogList {server} bind:bkLog bind:spin bind:currentFile />
							</AccordionItem>
						{:else}
							<div class=" font-semibold text-2xl text-blue-700">No Servers Tagged for Backup!</div>
						{/each}
					{/key}</Accordion
				>
			</div>
			<div class=" px-4 pt-4 rounded-lg bg-black text-white overflow-y-auto overflow-x-auto flex-1">
				{#if spin}
					<TextPlaceholder size="xxl" class="my-8" />
					<Skeleton size="xxl" class=" mb-2.5" />
					<TextPlaceholder size="xxl" class="my-8" />
					<Skeleton size="xl" class=" mb-2.5" />
					<TextPlaceholder size="xxl" class="my-8" />
				{:else if bkLog}
					<pre>
						{bkLog}</pre>
				{:else}
					select a backup log file
				{/if}
			</div>
		</div>
	</TabItem>
</Tabs>
