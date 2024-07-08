<script>
	import {
		Navbar,
		NavBrand,
		NavHamburger,
		Avatar,
		Dropdown,
		DropdownItem,
		DropdownHeader,
		DropdownDivider,
		DarkMode,
		Badge
	} from 'flowbite-svelte';
	import git from '$lib/assets/gitIcon.png';
	export let user;
</script>

<Navbar
	let:NavContainer
	fluid={true}
	color="none"
	class="absolute left-0 top-0 z-50 w-full px-2 py-2 backdrop-blur-sm sm:px-4"
	let:hidden
	let:toggle
>
	<NavBrand navClass href="/">
		<span
			class="self-center whitespace-nowrap text-3xl font-bold text-gray-600 dark:text-white"
			style="font-family: 'Bruno Ace SC', cursive;"
		>
			KAUH Severs Dashboard <Badge color="indigo" rounded class="-translate-y-1 opacity-70"
				><span class=" px-1 text-lg font-bold italic text-indigo-500">V# 2.1</span></Badge
			>
		</span>
	</NavBrand>
	<div class="flex items-center md:order-2">
		<button
			on:click={() => (window.location.href = 'https://github.com/mktabari/kauh-dashboard')}
			class="p=1 mr-2 rounded-md hover:bg-gray-200 hover:dark:bg-gray-700"
			><img alt="logo" src={git} class=" w-10 opacity-60 hover:opacity-100 dark:invert" /></button
		>
		<div class="pr-5"><DarkMode /></div>
		{#if user === 'admin'}<Avatar id="avatar-menu" />{/if}
		<NavHamburger on:click={toggle} class1="w-full md:flex md:w-auto md:order-1" />
	</div>
	<Dropdown placement="bottom" triggeredBy="#avatar-menu">
		<DropdownHeader>
			<span class="block text-sm"> {user} </span>
		</DropdownHeader>

		<DropdownDivider />
		<DropdownItem href="/logout" data-sveltekit-preload-data="off" data-sveltekit-reload
			>Sign out <span class="material-symbols-outlined absolute -translate-y-1 pl-2">
				logout
			</span></DropdownItem
		>
	</Dropdown>
</Navbar>
