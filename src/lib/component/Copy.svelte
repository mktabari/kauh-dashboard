<script>
	// import { Tooltip } from 'flowbite-svelte';
	export let value, id;
	let copied = false,
		intervalId;
	const copy = async (text) => {
		const element = document.createElement('TEXTAREA');
		const t = document.createTextNode(text);
		element.appendChild(t);
		element.style.setProperty('position', 'fixed');
		element.style.setProperty('z-index', '-100');
		element.style.setProperty('pointer-events', 'none');
		element.style.setProperty('opacity', '0');
		document.body.appendChild(element);
		element.focus();
		element.select();
		document.execCommand('copy');
		document.body.removeChild(element);
	};
</script>

{#if copied}
	<button
		><span
			style="font-variation-settings: 'FILL' 0, 'wght' 800, 'GRAD' 0, 'opsz' 45"
			class="material-symbols-outlined md-18 font-semibold text-green-600 opacity-50"
			>check_circle
		</span></button
	>
{:else}
	<button
		{id}
		on:click={() => {
			copy(value);
			copied = true;
			intervalId = setInterval(() => {
				copied = false;
				clearInterval(intervalId);
			}, 1000 * 3);
			// console.log(value);
		}}
	>
		<span
			style="font-variation-settings: 'FILL' 0, 'wght' 800, 'GRAD' 0, 'opsz' 45"
			class="material-symbols-outlined md-18 rotate-180 font-semibold opacity-50"
		>
			content_copy
		</span></button
	>
{/if}
<!-- <Tooltip type="light" trigger="click" triggeredBy="#{id}">
	<span class="pl-4 text-green-800"
		><span class=" material-symbols-outlined md-18 absolute left-2 top-2"> check_circle </span>
		{name} copied
	</span></Tooltip
> -->
