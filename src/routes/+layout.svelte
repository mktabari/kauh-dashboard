<script>
	import '../app.postcss';
	import NavigationBar from '$lib/navigation/NavigationBar.svelte';
	import SideBar from '$lib/navigation/SideBar.svelte';

	let scrolDiv;

	let hidden = true;

	function goTop() {
		scrolDiv.scrollTop = 0;
	}

	function handleOnScroll() {
		if (scrolDiv.scrollTop > 150) {
			hidden = false;
		} else {
			hidden = true;
		}
	}
	export let data;
	let { user, veeam } = data;
</script>

<div class="relative h-full">
	<NavigationBar {user} />

	<div class="flex h-full w-full">
		{#if user === 'admin'}
			<div class="h-full">
				<SideBar {veeam} />
			</div>
		{/if}
		<div
			id="scrolDiv"
			class=" border-1 h-full w-full flex-1 overflow-y-auto scroll-smooth pb-20 pl-5 pt-14"
			on:scroll={handleOnScroll}
			bind:this={scrolDiv}
		>
			<div class="pt-2" />
			<slot />
		</div>
	</div>
</div>
<div
	class="fixed bottom-5 right-10 h-14 w-14 select-none rounded-full bg-slate-100/60 opacity-100 transition-opacity hover:bg-slate-300/80"
	class:hidden
>
	<button on:click={goTop}>
		<span class="material-symbols-outlined md-48 m-0 pl-1 pt-1"> arrow_upward </span></button
	>
</div>
