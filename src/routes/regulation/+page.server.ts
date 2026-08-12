import type { PageServerLoad } from './$types';
import { getRegulations } from '$lib/server/portal/queries';
export const load: PageServerLoad = async () => {
	try { return { sections: await getRegulations() }; }
	catch (err) { console.error('[portal] regulation:', err); return { sections: [] }; }
};
