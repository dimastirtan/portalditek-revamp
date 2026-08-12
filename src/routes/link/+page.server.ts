import type { PageServerLoad } from './$types';
import { getLinks } from '$lib/server/portal/queries';
export const load: PageServerLoad = async () => {
	try { return { groups: await getLinks() }; }
	catch (err) { console.error('[portal] link:', err); return { groups: [] }; }
};
