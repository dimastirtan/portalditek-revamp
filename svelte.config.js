import adapter from '@sveltejs/adapter-static';
import { vitePreprocess } from '@sveltejs/vite-plugin-svelte';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	preprocess: vitePreprocess(),
	kit: {
		adapter: adapter({
			pages: 'build',
			assets: 'build',
			fallback: undefined,
			precompress: false,
			strict: true
		}),
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
