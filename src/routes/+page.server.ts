import type { PageServerLoad } from './$types';
import { getHeadlines, headlineCard, getBirthdays } from '$lib/server/portal/queries';
import { getImsPrograms } from '$lib/server/ims/queries';
import { cached } from '$lib/server/cache';
import { bulletins } from '$lib/server/uploads';

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
	// Artikel, agenda & download tidak lagi tampil di beranda (Information center kini
	// hanya buletin) — tidak dimuat supaya beranda lebih ringan.
	const [headlines, birthdays, programs] = await Promise.all([
		safe(
			'headline',
			cached('portal:headlines', getHeadlines).then((all) => all.slice(0, 5).map(headlineCard)),
			[]
		),
		safe('ulang tahun', cached('portal:birthdays', getBirthdays), []),
		safe('program IMS', getImsPrograms(), [])
	]);
	// Poster buletin dari folder unggahan (bukan DB) — baca langsung, tanpa cache.
	return { headlines, birthdays, programs, bulletins: bulletins() };
};
