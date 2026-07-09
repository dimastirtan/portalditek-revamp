import type { PageServerLoad } from './$types';
import { getJdq } from '$lib/server/portal/queries';
export const load: PageServerLoad = async () => {
	try {
		return { volumes: await getJdq() };
	} catch (err) {
		console.error('[portal] gagal memuat jdq:', err);
		return { volumes: [] };
	}
};
