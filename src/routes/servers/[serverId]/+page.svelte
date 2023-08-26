<script>
	import { Button } from 'flowbite-svelte';
	import { contentClass } from '$lib/generalsStyle/index';
	import ServerForm from '$lib/forms/ServerForm.svelte';
	export let data;
	let { server, allTags } = data;
	let {
		brand,
		name,
		ip,
		username,
		password,
		dbName,
		dbPort,
		dbUser,
		dbPassword,
		dbAlert,
		bkLogDir,
		drInstance,
		db,
		tags,
		dbSizeGroup
	} = server;

	export let form;
	if (form?.message === 'Done') {
		//goto('/servers');
		//throw redirect(308, '/servers');
		console.log(form?.message);
	}
	//page logic

	let dbToggle = db === 'true' ? true : false;
</script>

<div>
	<div class={contentClass}>
		<form method="POST">
			<ServerForm
				{brand}
				{name}
				{ip}
				{username}
				{password}
				{dbName}
				{dbPort}
				{dbUser}
				{dbPassword}
				{dbAlert}
				{bkLogDir}
				{dbToggle}
				{drInstance}
				{tags}
				{allTags}
				{dbSizeGroup}
			/>
			<div class=" mt-5">
				<Button type="submit" formaction="?/updateServer">Update Server</Button>
				<Button href="/servers" outline color="dark">Cancel</Button>
			</div>
		</form>
	</div>
</div>
