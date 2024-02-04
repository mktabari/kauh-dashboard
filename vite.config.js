import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	// server: {
	// 	https: { key: './kauh-dashboard-privateKey.key', cert: './kauh-dashboard.crt' }
	// },
	plugins: [sveltekit()]
});
