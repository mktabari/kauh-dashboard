<script>
	import { Button } from 'flowbite-svelte';
	import { contentClass } from '$lib/generalsStyle/index';
	import TagForm from '$lib/forms/TagForm.svelte';
	export let data;

	let { tag } = data;
	let { name, description, color } = tag;
</script>

<div>
	<div class={contentClass}>
		<form method="POST">
			<TagForm {name} {description} {color} />
			<div class=" mt-5">
				<Button type="submit" formaction="?/updateTag">Update Tag</Button>
				<Button href="/tags" outline color="blue">Cancel</Button>
			</div>
		</form>
	</div>
</div>
