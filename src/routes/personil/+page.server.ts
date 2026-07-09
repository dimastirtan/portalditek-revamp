import type { PageServerLoad } from './$types';
import { getPersonil } from '$lib/server/portal/queries';
export const load: PageServerLoad = async () => {
	try {
		return { people: await getPersonil() };
	} catch (err) {
		console.error('[portal] gagal memuat personil:', err);
		return { people: [] };
	}
};
