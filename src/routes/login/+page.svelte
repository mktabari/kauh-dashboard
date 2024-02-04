<script>
	import { Button, TextPlaceholder } from 'flowbite-svelte';
	import { enhance } from '$app/forms';
</script>

<div class="relative h-full w-full">
	<div class=" absolute z-50 flex h-full w-full items-center justify-center overflow-hidden">
		<form method="POST">
			<div
				class=" flex h-72 w-96 flex-col items-center justify-center gap-4 rounded-3xl border-2 border-gray-900 bg-gray-900 shadow-md"
			>
				<div>
					<span class="material-symbols-outlined md-48 text-gray-300"> lock </span>
				</div>

				<div class="relative w-60 -translate-y-3">
					<input
						type="text"
						id="username"
						name="username"
						class="peer block w-full appearance-none rounded-lg border-0 border-b-2 border-gray-300 bg-gray-50 px-2.5 pb-2.5 pt-5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
						placeholder=" "
					/>
					<label
						for="username"
						class="font-Orbitron absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
						>Username</label
					>
				</div>
				<div class="relative w-60 -translate-y-3">
					<input
						type="password"
						id="password"
						name="password"
						class="peer block w-full appearance-none rounded-lg border-0 border-b-2 border-gray-300 bg-gray-50 px-2.5 pb-2.5 pt-5 text-sm text-gray-900 focus:border-blue-600 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
						placeholder=" "
					/>
					<label
						for="password"
						class="font-Orbitron absolute start-2.5 top-4 z-10 origin-[0] -translate-y-4 scale-75 transform text-sm text-gray-500 duration-300 peer-placeholder-shown:translate-y-0 peer-placeholder-shown:scale-100 peer-focus:-translate-y-4 peer-focus:scale-75 peer-focus:text-blue-600 rtl:peer-focus:left-auto rtl:peer-focus:translate-x-1/4 dark:text-gray-400 peer-focus:dark:text-blue-500"
						>Password</label
					>
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
