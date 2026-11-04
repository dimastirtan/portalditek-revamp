import type { PageServerLoad } from './$types';
import { getImsPrograms } from '$lib/server/ims/queries';

export const load: PageServerLoad = async () => {
	try {
		return { programs: await getImsPrograms() };
	} catch (err) {
		console.error('[portal] program IMS:', err);
		return { programs: [] };
	}
};
