import type { PageServerLoad } from './$types';
import { getKerjasama } from '$lib/server/portal/queries';
import { cached } from '$lib/server/cache';
export const load: PageServerLoad = async () => {
	try {
		return { pages: await cached('portal:kerjasama', getKerjasama) };
	} catch (err) {
		console.error('[portal] gagal memuat kerjasama:', err);
		return { pages: [] };
	}
};
