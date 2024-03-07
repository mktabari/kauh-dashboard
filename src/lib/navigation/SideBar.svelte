<script>
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper, Indicator } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	export let veeam;

	$: activeUrl = $page.url.pathname;
	let nonActiveClass =
		'flex items-center p-2 text-base font-semibold text-gray-800 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700';
	let activeClass =
		'flex items-center p-2 text-base font-semibold text-gray-900 bg-gray-200 dark:bg-gray-700 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700';
	let borderClass = 'pt-2 mt-2 border-t border-gray-200 dark:border-gray-700';
	let indicator = false;
	let veeamIndicator = false;
	onMount(async () => {
		fetch('/api/san/alert')
			.then((response) => response.json())
			.then(({ apiData }) => {
				apiData.forEach((san) => {
					if (san.alert.length > 0) indicator = true;
				});
			});
		fetch('/api/servers/openProblems')
			.then((response) => response.json())
			.then(({ apiData }) => {
				apiData.forEach((server) => {
					if (server.alert.length > 0) indicator = true;
				});
			});
		fetch(`/api/ssh/veeam/${veeam[0].id}`)
			.then((response) => response.json())
			.then(({ apiData }) => {
				if (apiData[0].State === 'Working') return;
				if (
					apiData[0].Result !== 'Success' ||
					(new Date() - Date.parse(apiData[0].CreationTime)) / (1000 * 3600) > 168
				)
					veeamIndicator = true;
			});
	});
</script>

<div class="pt-12" />
<Sidebar class=" " asideClass="w-52" {activeUrl} {activeClass} {nonActiveClass}>
	<SidebarWrapper divClass="overflow-y-auto py-4 px-3 rounded">
		<SidebarGroup>
			<SidebarItem label="Dashboard" href="/">
				<svelte:fragment slot="icon"
					><span class="material-symbols-outlined"> dashboard </span></svelte:fragment
				></SidebarItem
			></SidebarGroup
		>
		<SidebarGroup border {borderClass}>
			<SidebarItem label="Databases" href="/databases">
				<svelte:fragment slot="icon"
					><span class="material-symbols-outlined"> database </span></svelte:fragment
				>
			</SidebarItem>
			<SidebarItem label="Time / Date" href="/time">
				<svelte:fragment slot="icon"
					><span class="material-symbols-outlined"> schedule </span></svelte:fragment
				>
			</SidebarItem>

			<SidebarItem label="Disk Space" href="/space">
				<svelte:fragment slot="icon"
					><span class="material-symbols-outlined"> save </span></svelte:fragment
				>
			</SidebarItem>
			<SidebarItem label="ERP" href="/erp">
				<svelte:fragment slot="icon"
					><span class="material-symbols-outlined"> apps </span></svelte:fragment
				>
			</SidebarItem>
			<SidebarItem label="APP Servers" href="/apps">
				<svelte:fragment slot="icon"
					><span class="material-symbols-outlined"> dns </span></svelte:fragment
				>
			</SidebarItem>
			<div class="relative">
				<SidebarItem label="Cloud Backup" href="/veeam">
					<svelte:fragment slot="icon"
						><span class="material-symbols-outlined"> backup </span></svelte:fragment
					>
				</SidebarItem>
				<!-- {#if veeamIndicator}<Indicator placement="center-right" color="red" />{/if} -->
				{#if veeamIndicator}
					<span class="absolute right-0 -translate-y-[25px]"
						><span class="relative flex h-3 w-3">
							<span
								class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"
							/>
							<span class="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
						</span></span
					>{/if}
			</div>
		</SidebarGroup>
		<SidebarGroup border {borderClass}>
			<div class="relative">
				<SidebarItem label="Faults" href="/faults">
					<svelte:fragment slot="icon"
						><span class="material-symbols-outlined"> error </span></svelte:fragment
					>
				</SidebarItem>
				<!-- {#if indicator}<Indicator placement="center-right" color="red" />{/if} -->
				{#if indicator}
					<span class="absolute right-0 -translate-y-[25px]"
						><span class="relative flex h-3 w-3">
							<span
								class="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"
							/>
							<span class="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
						</span>
					</span>
				{/if}
			</div>
		</SidebarGroup>
		<SidebarGroup border {borderClass}>
			<SidebarItem label="Servers" href="/servers">
				<svelte:fragment slot="icon"
					><span class="material-symbols-outlined"> computer </span></svelte:fragment
				>
			</SidebarItem>
			<SidebarItem label="Tags" href="/tags">
				<svelte:fragment slot="icon">
					<span class="material-symbols-outlined"> label </span>
				</svelte:fragment>
			</SidebarItem>
		</SidebarGroup>
		<SidebarGroup border {borderClass}>
			<SidebarItem label="Users" href="/users">
				<svelte:fragment slot="icon">
					<span class="material-symbols-outlined"> person </span>
				</svelte:fragment>
			</SidebarItem>
		</SidebarGroup>
		<SidebarGroup border {borderClass}>
			<SidebarItem label="Cheatsheet" href="/cheatsheet">
				<svelte:fragment slot="icon">
					<span class="material-symbols-outlined"> format_list_bulleted </span>
				</svelte:fragment>
			</SidebarItem>
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>
