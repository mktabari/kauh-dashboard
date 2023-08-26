<script>
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';
	const addServer = () => {
		goto('/servers/add');
	};
</script>

<div class="container p-10 space-y-4">
	<dev class="flex flex-row justify-between py-0"
		><h2 class="h2">Servers</h2>
		<dev>
			<button type="button" class="btn variant-ringed-primary" on:click={addServer}>
				<span class="material-symbols-outlined pr-2"> add </span>
				Add Server</button
			>
		</dev>
	</dev>
	<hr class="!border-t-2" />
	<h2>{$page.status} - {$page.error.message}</h2>
	<h3>add a server</h3>
</div>

<style>
	.material-symbols-outlined {
		font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' -25, 'opsz' 80;
	}
</style>
