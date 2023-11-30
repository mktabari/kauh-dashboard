<script>
	import Chart from 'chart.js/auto';
	import { onMount } from 'svelte';
	export let data;

	// let { name, percent, dbMountPoint } = data;
	let chart;
	let charCanvas;
	onMount(async () => {
		if (chart) chart.destroy();
		// let bgc = '#6b7280';
		let bgc = '#7FB3D5';
		let rbgc = '#82E0AA';
		if (parseInt(data[2].replace('%', '')) >= 90) {
			// bgc = '#de7c9f';
			// bgc = '#FF8370';
			bgc = '#f58b7a';
			// rbgc = '#F9FAFB';
			rbgc = '#f7ee65';
		}
		chart = new Chart(charCanvas, {
			type: 'doughnut',
			data: {
				labels: ['Used', 'Free'],
				datasets: [
					{
						data: [parseInt(data[2].replace('%', '')), 100 - parseInt(data[2].replace('%', ''))],
						backgroundColor: [bgc, rbgc],
						borderWidth: 0
					}
				]
			},
			options: { cutout: '60%', plugins: { legend: { display: false } } }
		});
	});
</script>

<div class=" h-24 w-24 rounded-xl pb-8 text-xs">
	{data[3].toUpperCase()}
	<div class="relative h-full w-full">
		<span class="absolute -translate-x-1/2 translate-y-6">{data[2]}</span>
		<canvas bind:this={charCanvas} class="mb-1 ml-4" />
	</div>
</div>
