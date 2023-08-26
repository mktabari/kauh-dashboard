<script>
	/** @type {import('./$types').PageData} */
	import { Tabs, TabItem, Button, Badge } from 'flowbite-svelte';
	import { invalidateAll } from '$app/navigation';
	import {
		contentClass,
		inactiveClasses,
		activeClasses,
		defaultClass
	} from '$lib/generalsStyle/index';
	import TagForm from '$lib/forms/TagForm.svelte';
	import {
		Table,
		TableBody,
		TableBodyCell,
		TableBodyRow,
		TableHead,
		TableHeadCell
	} from 'flowbite-svelte';

	export let data;

	let { allTags } = data;

	const handleTagDelete = async (tagId) => {
		const response = await fetch('/api/tags/' + tagId, {
			method: 'DELETE'
		});
		if (!response.ok) {
			console.log('problem');
			return;
		} else {
			try {
				await invalidateAll();

				allTags = data.allTags;
			} catch (error) {
				console.log(error);
			}
		}
	};
</script>

<Tabs style="none" {contentClass} {inactiveClasses} {activeClasses} {defaultClass}>
	<TabItem open>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> settings </span>
			Tags List
		</div>

		<div class="flex flex-row flex-wrap gap-6">
			<Table striped={true} shadow>
				<TableHead class="bg-slate-200">
					<TableHeadCell class="text-blue-800">Tag name</TableHeadCell>
					<TableHeadCell class="text-blue-800">Description</TableHeadCell>
					<TableHeadCell class="text-blue-800">Color</TableHeadCell>
					<TableHeadCell class="text-blue-800">
						<span class="sr-only"> Edit </span>
					</TableHeadCell>
					<TableHeadCell class="text-blue-800"><span class="sr-only"> Delete </span></TableHeadCell>
				</TableHead>
				<TableBody>
					{#key data}
						{#each allTags as Tag (Tag.id)}
							<TableBodyRow>
								<TableBodyCell>{Tag.name}</TableBodyCell>
								<TableBodyCell>{Tag.description}</TableBodyCell>
								<TableBodyCell><Badge border color={Tag.color}>{Tag.color}</Badge></TableBodyCell>
								<TableBodyCell>
									<a
										href="/tags/{Tag.id}"
										class="font-medium text-blue-600 hover:underline dark:text-blue-500"
									>
										Edit
									</a>
								</TableBodyCell>
								<TableBodyCell
									><Button
										size="xs"
										class=" bg-red-600 hover:bg-red-800 dark:bg-red-500 dark:hover:bg-red-700  "
										on:click={() => {
											handleTagDelete(Tag.id);
										}}>Delete</Button
									></TableBodyCell
								>
							</TableBodyRow>
						{:else}
							<div class=" font-semibold text-2xl text-blue-700">No Tags Added!</div>
						{/each}
					{/key}
				</TableBody>
			</Table>
		</div>
	</TabItem>
	<TabItem>
		<div slot="title" class="flex items-center gap-2">
			<span class="material-symbols-outlined"> settings_b_roll </span>
			Add Tag
		</div>
		<div>
			<form method="POST">
				<TagForm />
				<div class=" mt-5">
					<Button type="submit" formaction="?/createTag">Add Tag</Button>
				</div>
			</form>
		</div>
	</TabItem>
</Tabs>
