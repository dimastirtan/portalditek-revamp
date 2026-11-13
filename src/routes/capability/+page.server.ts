import type { PageServerLoad } from './$types';
import { getCapability } from '$lib/server/portal/queries';
import { cached } from '$lib/server/cache';
export const load: PageServerLoad = async () => {
	try {
		return { pages: await cached('portal:capability', getCapability) };
	} catch (err) {
		console.error('[portal] gagal memuat capability:', err);
		return { pages: [] };
	}
};
