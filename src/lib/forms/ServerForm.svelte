<script>
	import { Button, Input, Label, Helper, Toggle, Checkbox, Radio } from 'flowbite-svelte';
	import { flip } from 'svelte/animate';
	import { crossfade } from 'svelte/transition';
	import validateIP from 'validate-ip-node';
	import { quintOut } from 'svelte/easing';
	import oracle from '$lib/assets/oracle.png';
	import linux from '$lib/assets/linux.png';
	import windows from '$lib/assets/windows.png';
	export let brand = 'oracle';
	export let name;
	export let ip;
	export let username;
	export let password;
	export let dbToggle;
	export let dbName;
	export let dbUser;
	export let dbPassword;
	export let dbPort;
	export let dbAlert;
	export let bkLogDir;
	export let drInstance;
	export let dbSizeGroup;
	export let dbMountPoint;
	export let tags = [];
	export let allTags = [];

	let show = false;
	let showDB = false;
	let required = false;
	let disabled = true;
	let ipError = '';

	$: ipIsValed = true;
	let red = 'base';
	$: if (!ipIsValed) {
		red = 'red';
	} else {
		red = 'base';
	}
	if (dbToggle) {
		required = true;
		disabled = false;
	}
	const handleDbToggle = () => {
		dbToggle = !dbToggle;
		if (dbToggle) {
			required = true;
			disabled = false;
		} else {
			required = false;
			disabled = true;
			dbName = '';
			dbPort = '';
			dbUser = '';
			dbPassword = '';
			dbAlert = '';
			bkLogDir = '';
			drInstance = '';
			dbSizeGroup = '';
		}
	};

	const ipChangeHandle = () => {
		ipIsValed = validateIP(ip);
		if (ipIsValed) {
			ipError = '';
		} else {
			ipError = 'IP is not valed!';
		}
	};

	//server Utilities

	const [send, receive] = crossfade({
		duration: (d) => Math.sqrt(d * 200),

		fallback(node, params) {
			const style = getComputedStyle(node);
			const transform = style.transform === 'none' ? '' : style.transform;

			return {
				duration: 600,
				easing: quintOut,
				css: (t) => `
					transform: ${transform} scale(${t});
					opacity: ${t}
				`
			};
		}
	});

	const mapTags = (au) => {
		return tags.find((u) => u.name === au.name) || au;
	};

	allTags = allTags.map(mapTags);

	$: serverTags = JSON.stringify(allTags);
	//$: console.log(allUtilities);
	function mark(tag, done) {
		tag.done = done;
		remove(tag);
		allTags = allTags.concat(tag);
	}
	function remove(tag) {
		allTags = allTags.filter((u) => u !== tag);
	}
</script>

<div class="grid gap-6 xl:grid-cols-2">
	<div>
		<div class="grid gap-5 lg:grid-cols-3">
			<div
				class="font-Bruno mb-2 border-b-2 border-blue-900 text-primary-800 dark:border-gray-300 dark:text-gray-300 lg:col-span-3"
			>
				Server Brand
			</div>
			<div class="flex flex-row flex-wrap gap-6 lg:col-span-3">
				<Radio name="brand" custom bind:group={brand} value="oracle">
					<div
						class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border-2 border-gray-200 bg-white p-5 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-primary-600 peer-checked:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-primary-500"
					>
						<img alt="logo" src={oracle} class="h-10 w-32 object-cover" />
					</div>
				</Radio>
				<Radio name="brand" custom bind:group={brand} value="windows">
					<div
						for="hosting-big"
						class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border-2 border-gray-200 bg-white p-5 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-primary-600 peer-checked:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-primary-500"
					>
						<img alt="logo" src={windows} class=" h-10 w-32 object-contain" />
					</div>
				</Radio>
				<Radio name="brand" custom bind:group={brand} value="linux">
					<div
						for="hosting-big"
						class="inline-flex w-full cursor-pointer items-center justify-between rounded-lg border-2 border-gray-200 bg-white p-5 text-gray-500 hover:bg-gray-100 hover:text-gray-600 peer-checked:border-primary-600 peer-checked:bg-gray-200 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-gray-300 dark:peer-checked:text-primary-500"
					>
						<img alt="logo" src={linux} class=" h-10 w-32 object-contain" />
					</div>
				</Radio>
			</div>
		</div>
	</div>
	<div />
	<div>
		<div class="grid gap-5 lg:grid-cols-2">
			<div
				class="font-Bruno mb-2 border-b-2 border-blue-900 text-primary-800 dark:border-gray-300 dark:text-gray-300 lg:col-span-2"
			>
				Server Information
			</div>
			<div>
				<Button type="submit" btnClass="hidden">Add Server</Button>
				<Label for="name" class="mb-2 text-primary-800">Server Name</Label>
				<Input
					type="text"
					name="name"
					placeholder="Server Name"
					bind:value={name}
					required
					class="max-w-md"
				/>
			</div>
			<div>
				<Label for="ip" class="mb-2 text-primary-800">IP Adress</Label>
				<Input
					type="text"
					name="ip"
					placeholder="IP Adress"
					bind:value={ip}
					required
					class="max-w-md"
					on:change={ipChangeHandle}
					color={red}
				/>
				<Helper color="red">{ipError}</Helper>
			</div>
			<div>
				<Label for="username" class="mb-2 text-primary-800">User Name</Label>
				<Input
					type="text"
					name="username"
					placeholder="User Name"
					bind:value={username}
					required
					class="max-w-md"
				/>
			</div>
			<div>
				<Label for="password" class="mb-2 text-primary-800">Password</Label>
				<Input
					type={show ? 'text' : 'password'}
					name="password"
					placeholder="Password"
					bind:value={password}
					required
					class="max-w-md"
				>
					<button
						tabindex="-1"
						slot="left"
						on:click|preventDefault={() => (show = !show)}
						class="pointer-events-auto"
					>
						{#if show}
							<span class="material-symbols-outlined pt-2"> visibility </span>
						{:else}
							<span class="material-symbols-outlined pt-2"> visibility_off </span>
						{/if}
					</button>
				</Input>
			</div>
		</div>
	</div>
	<div>
		<div class="grid gap-5 lg:grid-cols-2">
			<div
				class="font-Bruno mb-2 flex justify-between border-b-2 border-blue-800 text-primary-800 dark:border-gray-300 dark:text-gray-300 lg:col-span-2"
			>
				<div>Database Exists</div>
				<Toggle
					size="small"
					name="db"
					bind:value={dbToggle}
					checked={dbToggle}
					class="mb-1 text-primary-800"
					on:change={handleDbToggle}
				/>
			</div>
			<div>
				<Label for="dbName" class="mb-2 text-primary-800">Database Name</Label>
				<Input
					type="text"
					name="dbName"
					placeholder="Database Name"
					bind:value={dbName}
					{required}
					{disabled}
					class="max-w-md"
				/>
			</div>
			<div>
				<Label for="port" class="mb-2 text-primary-800">Port</Label>
				<Input
					type="number"
					name="dbPort"
					placeholder="Port number"
					bind:value={dbPort}
					{required}
					{disabled}
					class="max-w-md"
				/>
			</div>
			<div>
				<Label for="dbUser" class="mb-2 text-primary-800">Database User</Label>
				<Input
					type="text"
					name="dbUser"
					placeholder="Database User"
					bind:value={dbUser}
					{required}
					{disabled}
					class="max-w-md"
				/>
			</div>
			<div>
				<Label for="dbPassword" class="mb-2 text-primary-800">Database Password</Label>
				<Input
					name="dbPassword"
					type={showDB ? 'text' : 'password'}
					placeholder="Database Password"
					bind:value={dbPassword}
					{required}
					{disabled}
					class="max-w-md"
				>
					<button
						tabindex="-1"
						slot="left"
						on:click|preventDefault={() => (showDB = !showDB)}
						class="pointer-events-auto"
					>
						{#if showDB}
							<span class="material-symbols-outlined pt-2"> visibility </span>
						{:else}
							<span class="material-symbols-outlined pt-2"> visibility_off </span>
						{/if}
					</button>
				</Input>
			</div>
		</div>
	</div>
	<div>
		<div class="grid gap-5 lg:grid-cols-2">
			<div
				class="font-Bruno mb-2 border-b-2 border-blue-900 text-primary-800 dark:border-gray-300 dark:text-gray-300 lg:col-span-2"
			>
				DB Utilityes
			</div>
			<div class="lg:col-span-2">
				<Label for="dbAlert" class="mb-2 text-primary-800">Alert Log File</Label>
				<Input type="text" name="dbAlert" placeholder="Alert log File path" bind:value={dbAlert} />
			</div>
			<div class="lg:col-span-2">
				<Label for="dbAlert" class="mb-2 text-primary-800">Backup Log Files Path</Label>
				<Input
					type="text"
					name="bkLogDir"
					placeholder="Backup Log Files Path"
					bind:value={bkLogDir}
				/>
			</div>
			<div class="lg:col-span-1">
				<Label for="drInstance" class="mb-2 text-primary-800">DR Instance</Label>
				<Input
					type="text"
					name="drInstance"
					placeholder="DR Instance Name"
					bind:value={drInstance}
				/>
			</div>
			<div class="lg:col-span-1">
				<Label for="dbSizeGroup" class="mb-2 text-primary-800">DB Size Group Name</Label>
				<Input
					type="text"
					name="dbSizeGroup"
					placeholder="DB Size Group Name"
					bind:value={dbSizeGroup}
				/>
			</div>
			<div class="lg:col-span-1">
				<Label for="dbSizeGroup" class="mb-2 text-primary-800">DB Mount Point</Label>
				<Input
					type="text"
					name="dbMountPoint"
					placeholder="DB Data Files Mount Point Name"
					bind:value={dbMountPoint}
				/>
			</div>
		</div>
	</div>
	<div>
		<div class="grid gap-5 lg:grid-cols-2">
			<input type="hidden" name="tags" bind:value={serverTags} />
			<div
				class="font-Bruno mb-2 border-b-2 border-blue-900 text-primary-800 dark:border-gray-300 dark:text-gray-300 lg:col-span-2"
			>
				Server Tags
			</div>
			<div class=" px-5">
				<Label class="mb-3 border-b-2 border-blue-300 text-primary-800">Unassigned</Label>

				<div class="grid h-max grid-cols-1 gap-2 px-5">
					{#each allTags.filter((u) => !u.done) as tag (tag.id)}
						<div
							class="rounded-lg border border-blue-500 p-3 hover:bg-slate-200 hover:dark:bg-slate-800"
							in:receive|local={{ key: tag.id }}
							out:send|local={{ key: tag.id }}
							animate:flip={{ duration: 200, delay: 200 }}
						>
							<Checkbox on:change={() => mark(tag, true)}>{tag.description}</Checkbox>
						</div>
					{/each}
				</div>
			</div>
			<div class=" px-5">
				<Label class="mb-3 border-b-2 border-blue-300 text-primary-800">Assigned</Label>
				<div class="grid h-max grid-cols-1 gap-2 px-5">
					{#each allTags.filter((u) => u.done) as tag (tag.id)}
						<div
							class="rounded-lg border border-blue-500 p-3 hover:bg-slate-200 hover:dark:bg-slate-800"
							in:receive|local={{ key: tag.id }}
							out:send|local={{ key: tag.id }}
							animate:flip={{ duration: 200, delay: 200 }}
						>
							<Checkbox checked on:change={() => mark(tag, false)}>
								{tag.description}</Checkbox
							>
						</div>
					{/each}
				</div>
			</div>
		</div>
	</div>
</div>
