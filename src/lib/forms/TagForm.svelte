<script>
	import { Input, Label, Select } from 'flowbite-svelte';

	export let name;
	export let description;
	export let color;

	let colors = [
		{ name: 'Red', value: 'red' },
		{ name: 'Green', value: 'green' },
		{ name: 'Yellow', value: 'yellow' },
		{ name: 'Indigo', value: 'indigo' },
		{ name: 'Purple', value: 'purple' },
		{ name: 'Pink', value: 'pink' }
	];
</script>

<div class="grid xl:grid-cols-2 gap-6">
	<div>
		<div class="grid lg:grid-cols-2 gap-5">
			<div class="lg:col-span-2 border-b-2 mb-2 text-primary-800 font-Bruno border-blue-900">
				Tag Information
			</div>
			<div>
				<Label for="name" class="mb-2 text-primary-800">Utility Name</Label>
				<Input
					type="text"
					name="name"
					placeholder="Utility Name"
					bind:value={name}
					required
					class="max-w-md"
				/>
			</div>
			<div>
				<Label for="ip" class="mb-2 text-primary-800">Description</Label>
				<Input
					type="text"
					name="description"
					placeholder="Description"
					bind:value={description}
					required
					class="max-w-md"
				/>
			</div>
			<div>
				<Label for="username" class="mb-2 text-primary-800"
					>Badge Color
					<Select
						items={colors}
						name="color"
						placeholder="Choose Badge Color"
						bind:value={color}
						required
						class="max-w-md"
					/></Label
				>
			</div>
		</div>
	</div>
</div>
