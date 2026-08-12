import type { PageServerLoad } from './$types';
import { getOc } from '$lib/server/portal/queries';
export const load: PageServerLoad = async () => {
	try { return { sections: await getOc() }; }
	catch (err) { console.error('[portal] oc:', err); return { sections: [] }; }
};
