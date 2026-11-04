import type { PageServerLoad } from './$types';
import {
	getMainArticleTeasers,
	getArticles,
	getEvents,
	getDownloads,
	getBirthdays
} from '$lib/server/portal/queries';
import { getImsPrograms } from '$lib/server/ims/queries';

// Homepage dibaca live dari DB tiap request → jangan di-prerender.
export const prerender = false;

export const load: PageServerLoad = async () => {
	// DB IMS terpisah dari DB portal: gagal di salah satu tidak mengosongkan yang lain.
	const programs = getImsPrograms().catch((err) => {
		console.error('[portal] gagal memuat program IMS:', err);
		return [];
	});
	try {
		const [news, articles, events, downloads, birthdays] = await Promise.all([
			getMainArticleTeasers(),
			getArticles(),
			getEvents(),
			getDownloads(),
			getBirthdays()
		]);
		return { news, articles, events, downloads, birthdays, programs: await programs };
	} catch (err) {
		// DB tidak terjangkau → halaman tetap tampil dengan section kosong,
		// bukan error 500. Cek log server untuk detail koneksi.
		console.error('[portal] gagal memuat data homepage:', err);
		return {
			news: [],
			articles: [],
			events: [],
			downloads: [],
			birthdays: [],
			programs: await programs
		};
	}
};
