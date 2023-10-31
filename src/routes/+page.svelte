<script>
	import DBUpDown from '$lib/cards/DBUpDown.svelte';
	import DBUpLine from '$lib/cards/DBUpLine.svelte';
	import DBHR from '$lib/cards/DBHR.svelte';
	import DBWait from '$lib/cards/DBWait.svelte';
	import DBSqlTime from '$lib/cards/DBSqlTime.svelte';
	import DBTrans from '$lib/cards/DBTrans.svelte';
	import DBMount from '$lib/cards/DBMount.svelte';
	import SAN from '$lib/cards/SAN.svelte';
	import DBUpDownNew from '$lib/cards/DBUpDownNew.svelte';

	export let data;

	let { UDServers, WServers } = data;

	let aClass = 'h-full rounded-xl bg-gray-100 p-3 dark:border-gray-700 dark:bg-gray-900';
</script>

<DBUpLine />

<div class="grid grid-cols-2 gap-3 pr-3">
	<div class=" col-span-2 w-full">
		<DBMount {aClass} />
	</div>
	<div class=" h-full w-full">
		<DBHR {aClass} />
	</div>
	<div class=" h-full w-full">
		<SAN {aClass} />
	</div>
	<div class=" col-span-2 w-full">
		<DBUpDownNew servers={UDServers} {aClass} />
	</div>
	<div class=" col-span-2 w-full">
		<DBSqlTime {aClass} />
	</div>
	<div class=" col-span-2 w-full">
		<DBTrans {aClass} />
	</div>

	<div class=" col-span-2 flex w-full flex-row flex-wrap gap-3">
		{#each WServers as server}
			<div class=" w-170">
				<DBWait {server} {aClass} />
			</div>
		{/each}
	</div>
</div>
<!-- <div class=" h-full w-full">
	<DBMountNew {aClass} />
</div>  -->
