<script>
	import { Tooltip } from 'flowbite-svelte';
	import { copy } from 'svelte-copy';
	export let value;
	export let name;
	export let id;
</script>

<button {id} use:copy={value}>
	<span
		style="font-variation-settings: 'FILL' 0, 'wght' 800, 'GRAD' 0, 'opsz' 45"
		class="material-symbols-outlined md-18 font-semibold rotate-180 opacity-50"
	>
		content_copy
	</span></button
><Tooltip type="light" trigger="click" triggeredBy="#{id}">
	<span class="text-green-800 pl-4"
		><span class=" material-symbols-outlined md-18 absolute left-2 top-2"> check_circle </span>
		{name} copied
	</span></Tooltip
>
