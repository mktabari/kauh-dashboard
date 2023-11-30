<script>
	import { onMount } from 'svelte';
	import { Spinner, Chart } from 'flowbite-svelte';
	let aClass = 'h-full rounded-xl bg-gray-100 px-3 pt-3 dark:border-gray-700 dark:bg-gray-900';
	let data = [];
	let spin = true;
	let options;
	let total;
	onMount(() => {
		fetch('/api/DB/sms')
			.then((response) => response.json())
			.then(({ apiData }) => {
				data = apiData;
				let temp;
				let series;
				total = data.reduce((p, item) => {
					return (p += item.C);
				}, 0);
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
						data: data
							.filter((item) => {
								if (item.DAY.charAt(0).toUpperCase() + item.DAY.slice(1) === element.seriesName)
									return true;
							})
							.map((item) => {
								return item.C;
							})
					};
				});

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
					plotOptions: {
						heatmap: {
							colorScale: {
								ranges: [
									{
										from: 0,
										to: 9,
										color: '#128FD9',
										name: 'LOW'
									},
									{
										from: 10,
										to: 99,
										color: '#00A100',
										name: 'MEDIUM'
									},
									{
										from: 100,
										to: 499,
										color: '#FFB200',
										name: 'HIGH'
									},
									{
										from: 500,
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
		class="flex flex-row justify-between bg-gray-100 pl-5 text-2xl font-extrabold text-gray-500 dark:text-gray-400"
	>
		<span>SMS HeatMap</span>
		<span class="pr-5 text-sm">Total number of SMS is {total}</span>
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
