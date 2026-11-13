import type { PageServerLoad } from './$types';
import { getLibraryIndex, getOnlinePublication } from '$lib/server/portal/queries';
import { cached } from '$lib/server/cache';

/** Satu bagian gagal hanya mengosongkan bagian itu, bukan seluruh halaman. */
const safe = <T>(name: string, data: Promise<T>, fallback: T) =>
	data.catch((err) => {
		console.error(`[portal] gagal memuat ${name}:`, err);
		return fallback;
	});

// Library = katalog perpustakaan (dulu "Our Library") + Online Publication.
export const load: PageServerLoad = async () => {
	const [catalogs, categories] = await Promise.all([
		safe('katalog library', cached('portal:libraryIndex', getLibraryIndex), []),
		safe('online publication', cached('portal:onlinePublication', getOnlinePublication), [])
	]);
	return { catalogs, categories };
};
