<script>
	import { Spinner } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	export let server;
	export let bkLog;
	export let spin;
	export let currentFile = '';
	let backupLogFiles = '';
	let logDirectoryExists = true;

	onMount(() => {
		fetch('/api/ssh/bkLogFiles/' + server.id)
			.then((response) => response.json())
			.then(({ bkLogFiles }) => {
				if (bkLogFiles === 'No Backup Log Directory') {
					logDirectoryExists = false;
				}
				backupLogFiles = bkLogFiles.split('\n');
				backupLogFiles.splice(-1);
			});
	});
	const getBackupLog = (fileName) => {
		bkLog = '';
		spin = true;

		fetch(`/api/ssh/bkLogFiles/${server.id}/${fileName}`)
			.then((response) => response.json())
			.then(({ bkLogFile }) => {
				spin = false;
				bkLog = bkLogFile;
			});
	};
</script>

<div class="flex flex-col justify-end">
	{#if backupLogFiles === ''}
		<div class=" flex w-full justify-center"><Spinner /></div>
	{:else}
		<div class=" flex w-full flex-col justify-center text-sm">
			{#each backupLogFiles as logFile}
				<button
					class:border-b-2={currentFile != server.id + logFile}
					class:text-red-600={currentFile === server.id + logFile}
					class:border-r-4={currentFile === server.id + logFile}
					class:border-t-0={currentFile === server.id + logFile}
					class:border-l-0={currentFile === server.id + logFile}
					class:border-b-0={currentFile === server.id + logFile}
					class:border-red-600={currentFile === server.id + logFile}
					class:bg-slate-200={currentFile === server.id + logFile}
					class=" py-2 text-center text-sm font-semibold last:border-b-0 hover:cursor-pointer hover:bg-slate-200 hover:text-black focus:bg-slate-200 focus:ring-0 dark:text-gray-300 dark:hover:bg-gray-700 hover:dark:text-gray-200 dark:focus:text-black"
					on:click={(e) => {
						currentFile = server.id + logFile;
						getBackupLog(logFile);
					}}
				>
					{logFile}
				</button>
			{:else}
				{#if logDirectoryExists}
					<h3 class="px-2 py-1 text-center">no files in directory</h3>
				{:else}
					<h3 class="px-2 py-1 text-center">no backup log directory defined</h3>
				{/if}
			{/each}
		</div>
	{/if}
</div>
