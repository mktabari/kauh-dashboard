/** @type {import('tailwindcss').Config}*/
const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	theme: {
		extend: {
			colors: {
				// flowbite-svelte
				/*primary: {
					50: '#ebf5ff',
					100: '#fff1ee',
					200: '#ffe4de',
					300: '#ffd5cc',
					400: '#ffbcad',
					500: '#fe795d',
					600: '#ef562f',
					700: '#eb4f27',
					800: '#d3330a',
					900: '#d3330a'
				}*/
				// blue
				// primary: {
				// 	50: '#eff6ff',
				// 	100: '#dbeafe',
				// 	200: '#bfdbfe',
				// 	300: '#93c5fd',
				// 	400: '#60a5fa',
				// 	500: '#3b82f6',
				// 	600: '#2563eb',
				// 	700: '#1d4ed8',
				// 	800: '#1e40af',
				// 	900: '#1e3a8a'
				// }
				//gray
				primary: {
					50: '#f9fafb',
					100: '#f3f4f6',
					200: '#e5e7eb',
					300: '#d1d5db',
					400: '#9ca3af',
					500: '#6b7280',
					600: '#4b5563',
					700: '#374151',
					800: '#1f2937',
					900: '#111827'
				},
				blue: {
					50: '#f9fafb',
					100: '#f3f4f6',
					200: '#e5e7eb',
					300: '#d1d5db',
					400: '#9ca3af',
					500: '#6b7280',
					600: '#4b5563',
					700: '#374151',
					800: '#1f2937',
					900: '#111827'
				}
			},
			spacing: {
				88: '22rem',
				128: '32rem',
				200: '35rem'
			}
		}
	},
	darkMode: 'class',
	plugins: [require('flowbite/plugin'), require('tailwindcss-animate')]
};

module.exports = config;