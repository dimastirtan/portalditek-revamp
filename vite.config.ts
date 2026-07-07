import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	server: {
		fs: {
			// Izinkan Vite baca font files dari node_modules (@fontsource-variable/inter, dsb)
			allow: ['..']
		}
	}
});
