import type { PageServerLoad } from './$types';
import { getKerjasama } from '$lib/server/portal/queries';
export const load: PageServerLoad = async () => {
	try {
		return { pages: await getKerjasama() };
	} catch (err) {
		console.error('[portal] gagal memuat kerjasama:', err);
		return { pages: [] };
	}
};
