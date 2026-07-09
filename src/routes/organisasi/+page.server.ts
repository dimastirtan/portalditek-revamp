import type { PageServerLoad } from './$types';
import { getOrgStructure } from '$lib/server/portal/queries';
export const load: PageServerLoad = async () => {
	try {
		return { units: await getOrgStructure() };
	} catch (err) {
		console.error('[portal] gagal memuat organisasi:', err);
		return { units: [] };
	}
};
