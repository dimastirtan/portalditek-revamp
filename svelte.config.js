import adapter from '@sveltejs/adapter-node';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		// SSR via Node. Homepage dibaca live dari MySQL; halaman statis/redirect
		// tetap di-prerender (opt-in per route). Jalankan: `node build` setelah build.
		adapter: adapter(),
		prerender: {
			handleHttpError: 'warn',
			handleMissingId: 'warn',
			entries: [
				'*',
				'/doa/',
				'/dotproject/',
				'/dashboard/',
				'/siedm/',
				'/certificate/',
				'/telepon/',
				'/-content/articles',
				'/-content/events',
				'/-content/downloads',
				'/-content/news',
				'/-content/announcements',
				'/dashboard.html',
				'/doa.html',
				'/dotproject.html',
				'/siedm.html',
				'/certificate.html',
				'/telepon.html'
			]
		}
	}
};

export default config;
