<script>
	import { Chart } from 'flowbite-svelte';
	export let data;
	let i = 0;
	const options = {
		series: data.mountPints.map((value) => value[2].replace('%', '')),
		colors: data.mountPints.map((value) => getColor()),
		chart: {
			height: '500px',
			width: '100%',
			type: 'radialBar',
			sparkline: {
				enabled: true
			}
		},
		plotOptions: {
			radialBar: {
				track: {
					background: '#E5E7EB'
				},
				dataLabels: {
					show: false
				},
				hollow: {
					margin: 0,
					size: '30%'
				}
			}
		},
		grid: {
			show: false,
			strokeDashArray: 4,
			padding: {
				left: 2,
				right: 2,
				top: -23,
				bottom: -20
			}
		},
		labels: data.mountPints.map((value) => value[3]),
		legend: {
			show: true,
			position: 'bottom',
			fontFamily: 'Inter, sans-serif'
		},
		tooltip: {
			enabled: true,
			x: {
				show: false
			}
		},
		yaxis: {
			show: false,
			labels: {
				formatter: function (value) {
					return value + '%';
				}
			}
		}
	};

	function getColor() {
		let colors = ['#1C64F2', '#16BDCA', '#FDBA8C', '#E74694', '#9061F9', '#31C48D'];
		return colors[i++];
	}
</script>

<div class=" rounded-xl pb-8">
	<div class="relative h-full w-full">
		<Chart {options} class="pt-10" />
	</div>
</div>
