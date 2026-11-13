import type { PageServerLoad } from './$types';
import { getBeritaIndex } from '$lib/server/portal/queries';
import { cached } from '$lib/server/cache';
export const load: PageServerLoad = async () => {
	try {
		return { berita: await cached('portal:beritaIndex', getBeritaIndex) };
	} catch (err) {
		console.error('[portal] gagal memuat berita:', err);
		return { berita: [] };
	}
};
