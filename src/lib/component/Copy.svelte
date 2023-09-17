<script>
	import { Tooltip } from 'flowbite-svelte';
	import { copy } from 'svelte-copy';
	export let value;
	export let name;
	export let id;
</script>

<button
	{id}
	use:copy={value}
	on:click={() => {
		console.log(value);
	}}
>
	<span
		style="font-variation-settings: 'FILL' 0, 'wght' 800, 'GRAD' 0, 'opsz' 45"
		class="material-symbols-outlined md-18 rotate-180 font-semibold opacity-50"
	>
		content_copy
	</span></button
><Tooltip type="light" trigger="click" triggeredBy="#{id}">
	<span class="pl-4 text-green-800"
		><span class=" material-symbols-outlined md-18 absolute left-2 top-2"> check_circle </span>
		{name} copied
	</span></Tooltip
>
