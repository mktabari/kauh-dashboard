<script>
	import { onMount } from 'svelte';
	import { Spinner, Chart } from 'flowbite-svelte';
	export let server;
	export let aClass;
	// let aClass = 'h-full rounded-xl bg-gray-100 px-3 pt-3 dark:border-gray-700 dark:bg-gray-900';
	let data = [];
	let spin = true;
	let options;

	onMount(() => {
		fetch('/api/DB/switch/' + server.id)
			.then((response) => response.json())
			.then(({ apiData }) => {
				data = apiData;
				let temp;
				let series;

				let days = data
					.filter((element) => {
						if (temp !== element.DAY) {
							temp = element.DAY;

							return true;
						}
					})
					.map((element) => {
						return { seriesName: element.DAY.charAt(0).toUpperCase() + element.DAY.slice(1) };
					});

				series = days.map((element) => {
					return {
						name: element.seriesName,
						data:
							// [5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5]
							data
								.filter((item) => {
									if (item.DAY.charAt(0).toUpperCase() + item.DAY.slice(1) === element.seriesName)
										return true;
								})
								.map((item) => {
									return [
										parseInt(item.h00),
										parseInt(item.h01),
										parseInt(item.h02),
										parseInt(item.h03),
										parseInt(item.h04),
										parseInt(item.h05),
										parseInt(item.h06),
										parseInt(item.h07),
										parseInt(item.h08),
										parseInt(item.h09),
										parseInt(item.h10),
										parseInt(item.h11),
										parseInt(item.h12),
										parseInt(item.h13),
										parseInt(item.h14),
										parseInt(item.h15),
										parseInt(item.h16),
										parseInt(item.h17),
										parseInt(item.h18),
										parseInt(item.h19),
										parseInt(item.h20),
										parseInt(item.h21),
										parseInt(item.h22),
										parseInt(item.h23)
									];
								})[0]
					};
				});
				// console.log(series);
				options = {
					series: series,
					chart: {
						height: 270,
						type: 'heatmap'
					},
					dataLabels: {
						enabled: true
					},
					markers: {
						hover: {
							sizeOffset: 4
						}
					},
					legend: {
						fontSize: '16px'
					},
					xaxis: {
						categories: [
							'00',
							'01',
							'02',
							'03',
							'04',
							'05',
							'06',
							'07',
							'08',
							'09',
							'10',
							'11',
							'12',
							'13',
							'14',
							'15',
							'16',
							'17',
							'18',
							'19',
							'20',
							'21',
							'22',
							'23'
						]
					},
					legend: {
						show: false,
						position: 'bottom',
						fontSize: '16px'
					},
					grid: {
						show: false
					},
					plotOptions: {
						heatmap: {
							useFillColorAsStroke: localStorage.getItem('color-theme') !== 'light',
							colorScale: {
								ranges: [
									{
										from: 0,
										to: 3,
										color: '#128FD9',
										name: 'LOW'
									},
									{
										from: 4,
										to: 6,
										color: '#00A100',
										name: 'MEDIUM'
									},
									{
										from: 7,
										to: 9,
										color: '#FFB200',
										name: 'HIGH'
									},
									{
										from: 10,
										to: 10000,
										color: '#ff2200',
										name: 'VERY HIGH'
									}
								]
							}
						}
					}
				};
				spin = false;
			});
	});
</script>

<div class={aClass}>
	<div
		class="flex flex-row justify-between bg-gray-100 bg-transparent pl-5 text-2xl font-extrabold text-gray-500 dark:text-gray-400"
	>
		{server.name} ({server.dbName}) Log Switch
	</div>
	<div class="w-full">
		{#if spin}
			<div class="w-full p-10 text-center">
				<Spinner size={8} />
			</div>
		{:else}
			<Chart {options} />
		{/if}
	</div>
</div>
