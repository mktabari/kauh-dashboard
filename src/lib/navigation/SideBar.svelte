<script>
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper, Indicator } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import { page } from '$app/stores';
	$: activeUrl = $page.url.pathname;
	let nonActiveClass =
		'flex items-center p-2 text-base font-semibold text-gray-800 rounded-lg dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700';
	let activeClass =
		'flex items-center p-2 text-base font-semibold text-gray-900 bg-gray-200 dark:bg-gray-700 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700';
	let borderClass = 'pt-2 mt-2 border-t border-gray-200 dark:border-gray-700';
	let data;
	let indicator = false;
	onMount(async () => {
		fetch('/api/san/alert')
			.then((response) => response.json())
			.then(({ apiData }) => {
				data = apiData;
				data.forEach((san) => {
					if (san.alert.length > 0) indicator = true;
				});
			});
		fetch('/api/servers/openProblems')
			.then((response) => response.json())
			.then(({ apiData }) => {
				data = apiData;
				data.forEach((server) => {
					if (server.alert.length > 0) indicator = true;
				});
			});
	});
</script>

<div class="pt-12" />
<Sidebar asideClass="w-48" {activeUrl} {activeClass} {nonActiveClass}>
	<SidebarWrapper divClass="overflow-y-auto py-4 px-3 rounded">
		<SidebarGroup>
			<SidebarItem label="Dashboard" href="/">
				<svelte:fragment slot="icon"
					><span class="material-symbols-outlined"> dashboard </span></svelte:fragment
				></SidebarItem
			></SidebarGroup
		>
		<SidebarGroup border {borderClass}>
			<SidebarItem label="Servers" href="/servers">
				<svelte:fragment slot="icon"
					><span class="material-symbols-outlined"> computer </span></svelte:fragment
				>
			</SidebarItem>
			<SidebarItem label="DB" href="/databases">
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
		</SidebarGroup>
		<!--
		<SidebarGroup border {borderClass}>
			<div class="relative">
				<SidebarItem label="Alerts" href="/alerts">
					<svelte:fragment slot="icon"
						><span class="material-symbols-outlined"> error </span></svelte:fragment
					>
				</SidebarItem>{#if indicator}<Indicator placement="center-right" color="red" />{/if}
			</div>
		</SidebarGroup>-->
		<SidebarGroup border {borderClass}>
			<div class="relative">
				<SidebarItem label="Faults" href="/faults">
					<svelte:fragment slot="icon"
						><span class="material-symbols-outlined"> error </span></svelte:fragment
					>
				</SidebarItem>{#if indicator}<Indicator placement="center-right" color="red" />{/if}
			</div>
		</SidebarGroup>
		<SidebarGroup border {borderClass}>
			<SidebarItem label="Tags" href="/tags">
				<svelte:fragment slot="icon">
					<span class="material-symbols-outlined"> label </span>
				</svelte:fragment>
			</SidebarItem>
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>
