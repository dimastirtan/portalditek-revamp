import type { PageServerLoad } from './$types';
import {
	getHeadlines,
	heroSlide,
	getArticles,
	getEvents,
	getDownloads,
	getBirthdays
} from '$lib/server/portal/queries';
import { getImsPrograms } from '$lib/server/ims/queries';
import { cached } from '$lib/server/cache';

// Homepage dibaca dari DB (lewat cache) → jangan di-prerender.
export const prerender = false;

/**
 * Satu bagian gagal (DB tidak terjangkau, query error) hanya mengosongkan
 * bagian itu — bukan seluruh homepage. Cek log server untuk detailnya.
 */
const safe = <T>(name: string, data: Promise<T>, fallback: T) =>
	data.catch((err) => {
		console.error(`[portal] gagal memuat ${name}:`, err);
		return fallback;
	});

export const load: PageServerLoad = async () => {
	const [headlines, articles, events, downloads, birthdays, programs] = await Promise.all([
		safe(
			'headline',
			// Cache terpisah: heroSlide membaca ukuran berkas gambar — cukup sekali per TTL.
			cached('portal:hero', async () =>
				(await cached('portal:headlines', getHeadlines)).slice(0, 5).map(heroSlide)
			),
			[]
		),
		safe('artikel', cached('portal:articles', getArticles), []),
		safe('agenda', cached('portal:events', getEvents), []),
		safe('unduhan', cached('portal:downloads', getDownloads), []),
		safe('ulang tahun', cached('portal:birthdays', getBirthdays), []),
		safe('program IMS', getImsPrograms(), [])
	]);
	return { headlines, articles, events, downloads, birthdays, programs };
};
