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
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell,
		Table,
		Progressbar
	} from 'flowbite-svelte';
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
			<div>
				{#if spin}
					<TextPlaceholder size="xxl" class="my-8" />
					<Skeleton size="xxl" class=" mb-2.5" />
					<TextPlaceholder size="xxl" class="my-8" />
					<Skeleton size="xl" class=" mb-2.5" />
				{:else if serverData}
					<Table striped={true} shadow>
						<TableHead class="bg-slate-200">
							<TableHeadCell class="text-blue-800">Filesystem</TableHeadCell>
							<TableHeadCell class="text-blue-800">Size</TableHeadCell>
							<TableHeadCell class="text-blue-800">Used</TableHeadCell>
							<TableHeadCell class="text-blue-800">Available</TableHeadCell>
							<TableHeadCell class="text-blue-800">Capacity</TableHeadCell>
						</TableHead>
						<TableBody>
							{#each serverData as row}
								<TableBodyRow>
									<TableBodyCell>{row[4]}</TableBodyCell>
									<TableBodyCell>{row[0]}</TableBodyCell>
									<TableBodyCell>{row[1]}</TableBodyCell>
									<TableBodyCell>{row[2]}</TableBodyCell>
									<TableBodyCell class=" w-1/2">
										<Progressbar
											progress={row[3].replace('%', '')}
											size="h-6"
											labelInside
											labelInsideClass="bg-blue-600 text-blue-100 text-base font-medium text-center p-1 leading-none rounded-full w-96"
										/>
									</TableBodyCell>
								</TableBodyRow>
							{:else}
								<div class=" font-semibold text-blue-700 p-5 w-full">No Match!</div>
							{/each}
						</TableBody>
					</Table>
				{/if}
			</div>
		</div>
	</TabItem>
</Tabs>
