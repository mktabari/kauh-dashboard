<script>
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
	export let data;

	// let { name, percent, dbMountPoint } = data;
	let chart;
	let charCanvas;
	onMount(async () => {
		if (chart) chart.destroy();
		let bgc = '#6b7280';
		if (parseInt(data[2].replace('%', '')) >= 90) {
			bgc = '#FF6384';
		}
		chart = new Chart(charCanvas, {
			type: 'doughnut',
			data: {
				labels: ['Used', 'Free'],
				datasets: [
					{
						data: [parseInt(data[2].replace('%', '')), 100 - parseInt(data[2].replace('%', ''))],
						backgroundColor: [bgc, '#d1d5db'],
						borderWidth: 0
					}
				]
			},
			options: { plugins: { legend: { display: false } } }
		});
	});
</script>

<div class=" h-36 w-36 rounded-xl pb-8">
	{data[3].toUpperCase()}

	<div class="relative h-full w-full">
		<span class="absolute -translate-x-1/2 translate-y-11">{data[2]}</span>
		<canvas bind:this={charCanvas} class="mb-1 ml-4" />
	</div>
</div>
