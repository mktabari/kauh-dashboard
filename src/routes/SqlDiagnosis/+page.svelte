<script>
	import { Tabs, TabItem } from 'flowbite-svelte';
	import {
		contentClass,
		inactiveClasses,
		activeClasses,
		defaultClass
	} from '$lib/generalsStyle/index';
	import DBCurrentSql from '$lib/cards/DBCurrentSql.svelte';
	import DBSqlTime from '$lib/cards/DBSqlTime.svelte';
	import DBTrans from '$lib/cards/DBTrans.svelte';
	let aClass = 'h-full rounded-xl  p-3 ';
</script>

<Tabs style="none" {contentClass} {inactiveClasses} {activeClasses} {defaultClass}>
	<TabItem open>
		<div slot="title" class="flex items-center gap-2">Current SQLs</div>
		<div class="flex flex-col gap-2">
			<DBCurrentSql {aClass} />
		</div>
	</TabItem>
	<TabItem>
		<div slot="title" class="flex items-center gap-2">SQL Time</div>
		<div class="flex flex-col gap-2">
			<DBSqlTime {aClass} />
		</div>
	</TabItem>
	<TabItem>
		<div slot="title" class="flex items-center gap-2">Transactions</div>
		<div class="flex flex-col gap-2">
			<DBTrans {aClass} />
		</div>
	</TabItem>
</Tabs>
