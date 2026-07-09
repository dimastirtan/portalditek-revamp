import type { PageServerLoad } from './$types';
import { getMainArticleIndex } from '$lib/server/portal/queries';
export const load: PageServerLoad = async () => {
	try {
		return { groups: await getMainArticleIndex() };
	} catch (err) {
		console.error('[portal] gagal memuat berita utama:', err);
		return { groups: [] };
	}
};
