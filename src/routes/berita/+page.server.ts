import type { PageServerLoad } from './$types';
import { getBeritaIndex } from '$lib/server/portal/queries';
export const load: PageServerLoad = async () => {
	try {
		return { berita: await getBeritaIndex() };
	} catch (err) {
		console.error('[portal] gagal memuat berita:', err);
		return { berita: [] };
	}
};
