import type { PageServerLoad } from './$types';
import { getJdq } from '$lib/server/portal/queries';
import { cached } from '$lib/server/cache';
export const load: PageServerLoad = async () => {
	try {
		return { volumes: await cached('portal:jdq', getJdq) };
	} catch (err) {
		console.error('[portal] gagal memuat jdq:', err);
		return { volumes: [] };
	}
};
