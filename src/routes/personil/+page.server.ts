import type { PageServerLoad } from './$types';
import { getPersonil } from '$lib/server/portal/queries';
import { cached } from '$lib/server/cache';
export const load: PageServerLoad = async () => {
	try {
		return { people: await cached('portal:personil', getPersonil) };
	} catch (err) {
		console.error('[portal] gagal memuat personil:', err);
		return { people: [] };
	}
};
