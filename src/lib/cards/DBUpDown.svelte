<script>
	import { Range, Label } from 'flowbite-svelte';
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	import 'chartjs-adapter-moment';
	export let servers;
	export let aClass;
	let chart;
	let charCanvas;
	let datasets = [];
	let datasetsOriginal = [];
	let minDate = new Date().setDate(new Date().getDate() - 365);
	let maxDate = new Date().setDate(new Date().getDate());
	let startRange = 0;
	let startRangeFine = 0;
	let endRange = 1000;
	let endRangeFine = 1000;
	let startDate;
	let startDateFine;
	let endDate;
	let endDateFine;
	let enabled = false;
	$: if (enabled) {
		startDate = minDate + (maxDate - minDate) * parseFloat(startRange / 1000);
		endDate = maxDate - (maxDate - minDate) * parseFloat((1000 - endRange) / 1000);
		startDateFine = startDate + (endDate - startDate) * parseFloat(startRangeFine / 1000);
		endDateFine = endDate - (endDate - startDate) * parseFloat((1000 - endRangeFine) / 1000);
		datasets = JSON.parse(JSON.stringify(datasetsOriginal));
		datasets.forEach((element) => {
			element.data = [
				{ x: startDateFine, y: 'UP' },
				...element.data.filter((row) => new Date(row.x) >= new Date(startDateFine)),
				{ x: endDateFine, y: 'UP' }
			];
		});
		datasets.forEach((element) => {
			element.data = [
				{ x: startDateFine, y: 'UP' },
				...element.data.filter((row) => new Date(row.x) <= new Date(endDateFine)),
				{ x: endDateFine, y: 'UP' }
			];
		});
		console.log(datasetsOriginal, datasets, chart);
		chart.data.datasets = datasets;
		chart.update();
	}
	onMount(() => {
		if (chart) chart.destroy();
		chart = new Chart(charCanvas, {
			type: 'line',

			data: {
				datasets
			},
			options: {
				layout: {
					padding: 10
				},
				plugins: {
					title: {
						display: false,
						text: 'Database Availability'
					}
				},
				scales: {
					x: {
						type: 'time',
						border: { display: true, color: '#FF6384' },
						ticks: { autoSkipPadding: 70, autoSkip: false, backdropPadding: 50 },
						grid: {
							drawOnChartArea: false
						}
					},
					y: {
						border: { display: false },
						type: 'category',
						labels: ['UP', 'DOWN'],
						offset: false,
						position: 'left',

						grid: {
							drawOnChartArea: false
						}
					}
				}
			}
		});

		servers.forEach((element) => {
			fetch('/api/DB/ud/' + element.id)
				.then((response) => response.json())
				.then(({ apiData }) => {
					datasets.push({
						label: element.name,
						stepped: true,
						data: [
							{ x: new Date().setDate(new Date().getDate() - 365), y: 'UP' },
							...apiData.map((row) => {
								if (row.OPERATION === 'SUP') {
									return { x: new Date(row.MON_DATE), y: 'UP' };
								} else {
									return { x: new Date(row.MON_DATE), y: 'DOWN' };
								}
							}),
							{ x: new Date(), y: 'UP' }
						]
					});
					datasetsOriginal = JSON.parse(JSON.stringify(datasets));
					if (chart) chart.update();
				});
		});
	});
</script>

<div class={aClass}>
	<div class="pb-3 pl-5 text-2xl font-extrabold text-gray-500 dark:text-gray-400">
		Database Availability
	</div>

	<canvas bind:this={charCanvas} height="50" />
	<div class="grid grid-cols-2">
		<div>
			<Label>Start Date</Label>
			<Range
				size="sm"
				id="start_date"
				min="0"
				max="1000"
				bind:value={startRange}
				on:change={() => {
					enabled = true;
					startRangeFine = 0;
					endRangeFine = 1000;
					if (startDate > endDate) startRange = endRange - 1;
				}}
			/>
		</div>
		<div>
			<Label>End Date</Label>
			<Range
				size="sm"
				id="end_date"
				min="0"
				max="1000"
				bind:value={endRange}
				on:change={() => {
					enabled = true;
					startRangeFine = 0;
					endRangeFine = 1000;
					if (startDate > endDate) endRange = startRange + 1;
				}}
			/>
		</div>
		<div>
			<Label>Start Date Fine</Label>
			<Range
				size="sm"
				id="start_date"
				min="0"
				max="1000"
				bind:value={startRangeFine}
				on:change={() => {
					enabled = true;
				}}
			/>
		</div>
		<div>
			<Label>End Date Fine</Label>
			<Range
				size="sm"
				id="end_date_fine"
				min="0"
				max="1000"
				bind:value={endRangeFine}
				on:change={() => {
					enabled = true;
				}}
			/>
		</div>
	</div>
</div>
