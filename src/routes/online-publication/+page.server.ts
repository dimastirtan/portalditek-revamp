import type { PageServerLoad } from './$types';
import { getOnlinePublication } from '$lib/server/portal/queries';
export const load: PageServerLoad = async () => {
	try { return { categories: await getOnlinePublication() }; }
	catch (err) { console.error('[portal] online-publication:', err); return { categories: [] }; }
};
