<script>
	import { onMount } from 'svelte';
	import Chart from 'chart.js/auto';
	export let server;
	export let aClass;
	let chart;
	let charCanvas;

	onMount(async () => {
		fetch('/api/DB/wait/' + server.id)
			.then((response) => response.json())
			.then(({ apiData }) => {
				if (chart) chart.destroy();
				chart = new Chart(charCanvas, {
					type: 'polarArea',
					options: {
						layout: {
							padding: 0
						},
						plugins: { legend: { display: false } },
						responsive: true,
						scales: {
							r: {
								pointLabels: {
									display: true,
									centerPointLabels: true,
									font: {
										size: 12
									}
								}
							}
						}
					},
					data: {
						labels: apiData.map((row) => row.EVENT),
						datasets: [{ data: apiData.map((row) => row.TWT) }]
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
