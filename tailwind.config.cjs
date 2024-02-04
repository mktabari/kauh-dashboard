/** @type {import('tailwindcss').Config}*/
const config = {
	content: [
		'./src/**/*.{html,js,svelte,ts}',
		'./node_modules/flowbite-svelte/**/*.{html,js,svelte,ts}'
	],

	theme: {
		extend: {
			animation: {
				wiggle: 'wiggle 2s ease-in-out 1'
			},
			keyframes: {
				wiggle: {
					'0%': { transform: 'rotate(25deg) translate(-100px, -70px)' },
					'49%': { transform: 'rotate(25deg) translate(170px ,-70px) scaleX(2)' },
					'50%': { transform: 'rotate(25deg) translate(-100px, -70px)' },
					'100%': { transform: 'rotate(25deg) translate(170px ,-70px) scaleX(2)' }
				}
			},
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
				// red
				//primary: {"50":"#fef2f2","100":"#fee2e2","200":"#fecaca","300":"#fca5a5","400":"#f87171","500":"#ef4444","600":"#dc2626","700":"#b91c1c","800":"#991b1b","900":"#7f1d1d"},

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
				},
				orange: {
					50: '#FFF5F2',
					100: '#FFF1EE',
					200: '#FFE4DE',
					300: '#FFD5CC',
					400: '#FFBCAD',
					500: '#FE795D',
					600: '#EF562F',
					700: '#EB4F27',
					800: '#CC4522',
					900: '#A5371B'
				}
			},
			spacing: {
				88: '22rem',
				128: '32rem',
				150: '33rem',
				170: '34rem',
				200: '35rem'
			}
		}
	},
	darkMode: 'class',
	plugins: [require('flowbite/plugin'), require('tailwindcss-animate')]
};

module.exports = config;
