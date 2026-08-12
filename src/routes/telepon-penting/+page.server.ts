import type { PageServerLoad } from './$types';
import { getTelepon } from '$lib/server/portal/queries';
export const load: PageServerLoad = async () => {
	try { return { groups: await getTelepon() }; }
	catch (err) { console.error('[portal] telepon:', err); return { groups: [] }; }
};
