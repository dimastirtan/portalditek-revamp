import type { PageServerLoad } from './$types';
import {
	getNews,
	getArticles,
	getEvents,
	getDownloads,
	getBirthdays
} from '$lib/server/portal/queries';

// Homepage dibaca live dari DB tiap request → jangan di-prerender.
export const prerender = false;

export const load: PageServerLoad = async () => {
	try {
		const [news, articles, events, downloads, birthdays] = await Promise.all([
			getNews(),
			getArticles(),
			getEvents(),
			getDownloads(),
			getBirthdays()
		]);
		return { news, articles, events, downloads, birthdays };
	} catch (err) {
		// DB tidak terjangkau → halaman tetap tampil dengan section kosong,
		// bukan error 500. Cek log server untuk detail koneksi.
		console.error('[portal] gagal memuat data homepage:', err);
		return { news: [], articles: [], events: [], downloads: [], birthdays: [] };
	}
};
