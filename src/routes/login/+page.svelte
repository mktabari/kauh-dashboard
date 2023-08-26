<script>
	import { FloatingLabelInput, Helper, Button, TextPlaceholder } from 'flowbite-svelte';
</script>

<div class="relative h-full w-full">
	<div class=" absolute z-50 flex h-full w-full items-center justify-center overflow-hidden">
		<form method="POST">
			<div
				class=" flex h-72 w-96 flex-col items-center justify-center gap-4 rounded-3xl border-2 border-gray-900 bg-gradient-to-b from-gray-700 via-gray-900 to-gray-900 to-30% shadow-md"
			>
				<div>
					<span class="material-symbols-outlined md-48 text-gray-300"> lock </span>
				</div>
				<div class="w-60 -translate-y-3">
					<FloatingLabelInput
						class="font-Orbitron rounded-b-md rounded-t-md"
						style="filled"
						id="username"
						name="username"
						type="text"
						label="Username"
						classLabel="font-Orbitron text-sm"
					/>
				</div>
				<div class="w-60 -translate-y-3">
					<FloatingLabelInput
						class=" rounded-b-md rounded-t-md"
						style="filled"
						id="password"
						name="password"
						type="password"
						label="Password"
						classLabel="font-Bruno"
					/>
				</div>
				<div class="w-60 -translate-y-3">
					<Button color="light" type="submit" formaction="?/login"
						><span class="font-Bruno pr-5 font-bold">Login</span><span
							class="material-symbols-outlined absolute translate-x-5 pl-3"
						>
							login
						</span></Button
					>
				</div>
			</div>
		</form>
	</div>
	<div class="absolute flex h-full w-full items-center justify-center">
		<div class="borer grid grid-cols-2 flex-row flex-wrap opacity-100">
			<TextPlaceholder class=" my-3 w-128 translate-x-12" />
			<TextPlaceholder class="my-3 w-128 -translate-x-12 rotate-180" />
			<TextPlaceholder class="my-3 w-128 translate-x-12" />
			<TextPlaceholder class="my-3  w-128 -translate-x-12 rotate-180" />
			<TextPlaceholder class="my-3  w-128 translate-x-12" />
			<TextPlaceholder class="my-3  w-128 -translate-x-12 rotate-180" />
			<TextPlaceholder class="my-3  w-128 translate-x-12" />
			<TextPlaceholder class="my-3  w-128 -translate-x-12 rotate-180" />
		</div>
	</div>
</div>
