<script>
	import { Sidebar, SidebarGroup, SidebarItem, SidebarWrapper } from 'flowbite-svelte';

	import { page } from '$app/stores';
	$: activeUrl = $page.url.pathname;
	let aClass =
		'hover:border-r-4 hover:border-r-gray-800 flex items-center p-2 rounded-lg text-base font-semibold text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700';
	let activeClass =
		'hover:border-r-4 hover:border-r-gray-800 flex items-center p-2 rounded-lg text-base font-semibold text-gray-100 bg-gray-500 dark:text-white hover:text-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 dark:bg-gray-700';
	let btnClass =
		'w-full hover:border-r-4 hover:border-r-gray-800 flex items-center p-2 rounded-lg text-base font-semibold text-gray-800 dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 transition duration-75 group';
	let divClass = 'overflow-y-auto py-4 px-3 bg-gray-200 dark:bg-gray-800 h-full ';
	let spanClass = 'flex-1 ml-3 whitespace-nowrap';
</script>

<div class="bg-white pt-14 dark:bg-gray-800" />
<Sidebar asideClass="w-48">
	<SidebarWrapper {divClass}>
		<SidebarGroup>
			<SidebarItem
				label="Servers"
				{aClass}
				{activeClass}
				href="/servers"
				active={activeUrl.startsWith('/servers')}
			>
				<svelte:fragment slot="icon"
					><span class="material-icons md-dark"> computer </span></svelte:fragment
				>
			</SidebarItem>
			<SidebarItem
				label="DB"
				{aClass}
				{activeClass}
				href="/databases"
				active={activeUrl === '/databases'}
			>
				<svelte:fragment slot="icon"
					><span class="material-symbols-outlined"> database </span></svelte:fragment
				>
			</SidebarItem>
			<SidebarItem
				label="Time / Date"
				{aClass}
				{activeClass}
				href="/time"
				active={activeUrl === '/time'}
			>
				<svelte:fragment slot="icon"
					><span class="material-symbols-outlined"> schedule </span></svelte:fragment
				>
			</SidebarItem>
			<SidebarItem
				label="Disk Space"
				{aClass}
				{activeClass}
				href="/space"
				active={activeUrl === '/space'}
			>
				<svelte:fragment slot="icon"
					><span class="material-symbols-outlined"> save </span></svelte:fragment
				>
			</SidebarItem>
			<SidebarItem label="ERP" {aClass} {activeClass} href="/erp" active={activeUrl === '/erp'}>
				<svelte:fragment slot="icon"
					><span class="material-symbols-outlined"> extension </span></svelte:fragment
				>
			</SidebarItem>
		</SidebarGroup>
		<SidebarGroup border>
			<SidebarItem
				label="Tags"
				{aClass}
				{activeClass}
				href="/tags"
				active={activeUrl.startsWith('/tags')}
			>
				<svelte:fragment slot="icon">
					<svg
						xmlns="http://www.w3.org/2000/svg"
						fill="none"
						viewBox="0 0 24 24"
						stroke-width="1.5"
						stroke="currentColor"
						class="h-6 w-6"
						><path
							stroke-linecap="round"
							stroke-linejoin="round"
							d="M4.5 12a7.5 7.5 0 0015 0m-15 0a7.5 7.5 0 1115 0m-15 0H3m16.5 0H21m-1.5 0H12m-8.457 3.077l1.41-.513m14.095-5.13l1.41-.513M5.106 17.785l1.15-.964m11.49-9.642l1.149-.964M7.501 19.795l.75-1.3m7.5-12.99l.75-1.3m-6.063 16.658l.26-1.477m2.605-14.772l.26-1.477m0 17.726l-.26-1.477M10.698 4.614l-.26-1.477M16.5 19.794l-.75-1.299M7.5 4.205L12 12m6.894 5.785l-1.149-.964M6.256 7.178l-1.15-.964m15.352 8.864l-1.41-.513M4.954 9.435l-1.41-.514M12.002 12l-3.75 6.495"
						/></svg
					>
				</svelte:fragment>
			</SidebarItem>
		</SidebarGroup>
	</SidebarWrapper>
</Sidebar>
