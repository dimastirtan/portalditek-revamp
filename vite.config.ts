import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import legacyColors from './scripts/postcss-legacy-colors.js';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	css: {
		// Warna cadangan untuk Chrome/Edge 109 (Windows 7/8.1) — lihat skripnya.
		postcss: { plugins: [legacyColors()] }
	},
	server: {
		fs: {
			// Izinkan Vite baca font files dari node_modules (@fontsource-variable/inter, dsb)
			allow: ['..']
		}
	}
});
