import type { PageServerLoad } from './$types';
import { getSekilas } from '$lib/server/portal/queries';
export const load: PageServerLoad = async () => {
	try { return { items: await getSekilas() }; }
	catch (err) { console.error('[portal] sekilas:', err); return { items: [] }; }
};
