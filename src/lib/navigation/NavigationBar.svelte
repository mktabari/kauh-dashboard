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
		DarkMode
	} from 'flowbite-svelte';
	import git from '$lib/assets/gitIcon.png';
	export let user;
</script>

<Navbar
	fluid={true}
	color="none"
	navClass="py-2 px-2 sm:px-4 absolute w-full z-50 top-0 left-0 backdrop-blur-sm"
	let:hidden
	let:toggle
>
	<NavBrand navClass href="/">
		<!-- <img alt="logo" src={code} class=" w-10" /> -->
		<span
			class="self-center whitespace-nowrap text-3xl font-bold text-gray-600 dark:text-white"
			style="font-family: 'Bruno Ace SC', cursive;"
		>
			KAUH Severs Dashboard <span class="text-lg italic text-indigo-700">V:1.0</span>
		</span>
	</NavBrand>
	<div class="flex items-center md:order-2">
		<button
			on:click={() => (window.location.href = 'https://github.com/mktabari/my-js')}
			class="p=1 mr-2 rounded-md hover:bg-gray-200 hover:dark:bg-gray-700"
			><img alt="logo" src={git} class=" w-10 opacity-60 hover:opacity-100 dark:invert" /></button
		>
		<div class="pr-5"><DarkMode /></div>
		{#if user}<Avatar id="avatar-menu" />{/if}
		<NavHamburger on:click={toggle} class1="w-full md:flex md:w-auto md:order-1" />
	</div>
	<Dropdown placement="bottom" triggeredBy="#avatar-menu">
		<DropdownHeader>
			<span class="block text-sm"> {user} </span>
		</DropdownHeader>

		<DropdownDivider />
		<DropdownItem href="/logout" data-sveltekit-preload-data="off"
			>Sign out <span class="material-symbols-outlined absolute -translate-y-1 pl-2">
				logout
			</span></DropdownItem
		>
	</Dropdown>
</Navbar>
