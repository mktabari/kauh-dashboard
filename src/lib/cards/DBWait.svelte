<script>
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	export let server;
	export let aClass;
	let chart;
	let charCanvas;

	onMount(() => {
		fetch('/api/DB/wait/' + server.id)
			.then((response) => response.json())
			.then(({ apiData }) => {
				if (chart) chart.destroy();
				chart = new Chart(charCanvas, {
					type: 'bar',
					options: {
						responsive: true,
						plugins: {
							title: {
								display: false
							},
							legend: {
								labels: {
									font: {
										size: 8
									}
								}
							}
						},
						scales: {
							x: {
								display: false
							},
							y: {
								display: true,
								type: 'logarithmic'
							}
						}
					},
					data: {
						labels: [server.name],
						datasets: apiData.map((row) => {
							return { label: row.EVENT, data: [row.TWT] };
						})
					}
				});
			});
	});
</script>

<div class={aClass}>
	<div class="pb-3 pl-5 text-2xl font-extrabold text-gray-500 dark:text-gray-400">
		{server.name} ({server.dbName}) Waits
	</div>

	<canvas bind:this={charCanvas} />
</div>
