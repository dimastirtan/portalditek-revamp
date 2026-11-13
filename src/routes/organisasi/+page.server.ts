import type { PageServerLoad } from './$types';
import { getOrgStructure } from '$lib/server/portal/queries';
import { cached } from '$lib/server/cache';
export const load: PageServerLoad = async () => {
	try {
		return { units: await cached('portal:orgStructure', getOrgStructure) };
	} catch (err) {
		console.error('[portal] gagal memuat organisasi:', err);
		return { units: [] };
	}
};
