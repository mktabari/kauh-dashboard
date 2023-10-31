<script>
	import { Chart } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	export let servers;
	export let aClass;
	let datasets = [];
	let s = false;
	$: options = {
		series: datasets,
		xaxis: {
			type: 'datetime'
		},
		yaxis: {
			labels: {
				formatter: (value) => {
					if (value === 1) {
						return 'Up';
					} else if (value === 0) {
						return 'Down';
					} else return '';
				}
			}
		},
		chart: {
			type: 'line',
			height: 270
		},
		stroke: {
			curve: 'stepline'
		},
		dataLabels: {
			enabled: false
		},
		markers: {
			hover: {
				sizeOffset: 4
			}
		}
	};
	onMount(async () => {
		servers.forEach((element) => {
			fetch('/api/DB/ud/' + element.id)
				.then((response) => response.json())
				.then(({ apiData }) => {
					datasets.push({
						name: element.name,
						data: [
							{ x: new Date().setDate(new Date().getDate() - 365), y: 1 },
							...apiData.map((row) => {
								if (row.OPERATION === 'SUP') {
									return { x: new Date(row.MON_DATE), y: 1 };
								} else {
									return { x: new Date(row.MON_DATE), y: 0 };
								}
							}),
							{ x: new Date(), y: 1 }
						]
					});
				});
		});
		console.log(datasets);
		s = true;
	});
</script>

<div class={aClass}>
	<div class="pb-3 pl-5 text-2xl font-extrabold text-gray-500 dark:text-gray-400">
		Database Availability
	</div>
	<div class="w-full">
		{#if s}
			<Chart {options} class="pt-1" />
		{/if}
	</div>
</div>
