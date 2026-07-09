import type { PageServerLoad } from './$types';
import { getCapability } from '$lib/server/portal/queries';
export const load: PageServerLoad = async () => {
	try {
		return { pages: await getCapability() };
	} catch (err) {
		console.error('[portal] gagal memuat capability:', err);
		return { pages: [] };
	}
};
