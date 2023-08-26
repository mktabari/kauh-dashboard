<script>
	import {
		contentClass,
		inactiveClasses,
		activeClasses,
		defaultClass
	} from '$lib/generalsStyle/index';
	import { Tabs, TabItem, Skeleton, TextPlaceholder } from 'flowbite-svelte';
	import ServerBG from '$lib/buttonGroup/ServerBG.svelte';
	export let data;

	let { servers } = data;
	let serverData = '';

	let spin = false;
</script>

<Tabs style="none" {contentClass} {inactiveClasses} {activeClasses} {defaultClass}>
	<TabItem open>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> save </span>
			Servers List
		</div>
		<div class="flex flex-col gap-2">
			<div class="flex w-full">
				<ServerBG
					{servers}
					label="select a server for space:"
					bind:serverData
					bind:spin
					apiName="ssh/space"
				/>
			</div>
			<div class=" flex-1 overflow-x-auto overflow-y-auto rounded-lg bg-black px-4 pt-4 text-white">
				{#if spin}
					<TextPlaceholder size="xxl" class="my-8" />
					<Skeleton size="xxl" class=" mb-2.5" />
					<TextPlaceholder size="xxl" class="my-8" />
					<Skeleton size="xl" class=" mb-2.5" />
				{:else if serverData}
					<pre>{serverData}</pre>
				{:else}
					<div class="pb-10">select a server</div>
				{/if}
			</div>
		</div>
	</TabItem>
</Tabs>
