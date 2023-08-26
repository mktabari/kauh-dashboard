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
			<span class="material-symbols-outlined"> info </span>
			Servers List
		</div>
		<div class="flex flex-col gap-2">
			<div class="flex w-full">
				<ServerBG
					{servers}
					label="select a server for alert log file:"
					bind:serverData
					bind:spin
					apiName="ssh/alert"
				/>
			</div>
			<div class=" px-4 pt-4 rounded-lg bg-black text-white overflow-y-auto overflow-x-auto">
				{#if spin}
					<TextPlaceholder size="xxl" class="my-8" />
					<Skeleton size="xl" class=" mb-2.5" />
					<TextPlaceholder size="xxl" class="my-8" />
					<Skeleton size="xl" class=" mb-2.5" />
					<TextPlaceholder size="xl" class="my-8" />
				{:else if serverData}
					<pre>{serverData}</pre>
				{:else}
					<div class="pb-10">select alert log file</div>
				{/if}
			</div>
		</div>
	</TabItem>
</Tabs>
