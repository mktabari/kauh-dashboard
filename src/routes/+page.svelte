<script>
	import { ImagePlaceholder, Skeleton, TextPlaceholder } from 'flowbite-svelte';
	import DBUpDown from '$lib/cards/DBUpDown.svelte';
	import DBUp from '$lib/cards/DBUp.svelte';
	import DBHR from '$lib/cards/DBHR.svelte';
	import DBWait from '$lib/cards/DBWait.svelte';
	import DBSqlTime from '$lib/cards/DBSqlTime.svelte';
	export let data;

	let { UDServers, WServers } = data;

	let aClassold =
		'py-3shadow-md h-full rounded-xl border bg-gray-50 p-3 dark:border-gray-700 dark:bg-gray-900';
	let aClass = 'h-full rounded-xl bg-gray-100 p-3 dark:border-gray-700 dark:bg-gray-900';
</script>

<div class="grid grid-cols-2 gap-3 pr-3 pt-5">
	<div class=" h-full w-full">
		<DBUp {aClass} />
	</div>
	<div class=" h-full w-full">
		<DBHR {aClass} />
	</div>
	<div class=" col-span-2 w-full">
		<DBUpDown servers={UDServers} {aClass} />
	</div>
	<div class=" col-span-2 w-full">
		<DBSqlTime {aClass} />
	</div>
	<div class=" col-span-2 flex w-full flex-row flex-wrap">
		{#each WServers as server}
			<div class=" w-200">
				<DBWait {server} {aClass} />
			</div>
		{/each}
	</div>
</div>

<div>
	<Skeleton class="mb-8 mt-5" />
	<ImagePlaceholder class="my-8" />
	<TextPlaceholder class="my-8" />
	<Skeleton class="mb-8 mt-16" />
	<ImagePlaceholder class="my-8" />
	<TextPlaceholder class="my-8" />
	<Skeleton class="mb-8 mt-16" />
	<ImagePlaceholder class="my-8" />
	<TextPlaceholder class="my-8" />
	<Skeleton class="mb-8 mt-16" />
	<ImagePlaceholder class="my-8" />
	<TextPlaceholder class="my-8" />
	<Skeleton class="mb-8 mt-16" />
	<ImagePlaceholder class="my-8" />
	<TextPlaceholder class="my-8" />
</div>
