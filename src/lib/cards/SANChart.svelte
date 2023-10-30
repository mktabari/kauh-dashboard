<script>
	import { Chart } from 'flowbite-svelte';
	export let data;
	let i = 0;
	const options = {
		series: [data.content.sizeUsed, data.content.sizeFree],
		colors: ['#7FB3D5', '#82E0AA'],
		chart: {
			height: 320,
			width: '100%',
			type: 'donut'
		},
		stroke: {
			colors: ['transparent'],
			lineCap: ''
		},
		plotOptions: {
			pie: {
				donut: {
					labels: {
						show: true,
						name: {
							show: true,
							fontFamily: 'Inter, sans-serif',
							offsetY: 20
						},
						total: {
							showAlways: true,
							show: true,
							label: 'Total Space',
							fontFamily: 'Inter, sans-serif',
							formatter: function (w) {
								const sum = w.globals.seriesTotals.reduce((a, b) => {
									return a + b;
								}, 0);
								return formatBytes(`${sum}`);
							}
						},
						value: {
							show: true,
							fontFamily: 'Inter, sans-serif',
							offsetY: -20,
							formatter: function (value) {
								return formatBytes(value);
							}
						}
					},
					size: '80%'
				}
			}
		},
		grid: {
			padding: {
				top: -2
			}
		},
		labels: ['Used', 'Free'],
		dataLabels: {
			enabled: false
		},
		legend: {
			position: 'bottom',
			fontFamily: 'Inter, sans-serif'
		},
		yaxis: {
			labels: {
				formatter: function (value) {
					return formatBytes(value);
				}
			}
		},
		xaxis: {
			labels: {
				formatter: function (value) {
					return formatBytes(value);
				}
			},
			axisTicks: {
				show: false
			},
			axisBorder: {
				show: false
			}
		}
	};
	function getColor() {
		let colors = ['#1C64F2', '#16BDCA', '#FDBA8C', '#E74694', '#9061F9', '#31C48D'];
		return colors[i++];
	}
	function formatBytes(bytes, decimals = 2) {
		if (!+bytes) return '0 Bytes';

		const k = 1024;
		const dm = decimals < 0 ? 0 : decimals;
		const sizes = ['Bytes', 'KiB', 'MiB', 'GiB', 'TiB', 'PiB', 'EiB', 'ZiB', 'YiB'];

		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
	}
</script>

<div class=" rounded-xl pb-8">
	<div class="relative h-full w-full">
		<Chart {options} class="pt-10" />
	</div>
</div>
