import type { PageServerLoad } from './$types';
import { getTelepon } from '$lib/server/portal/queries';
import { cached } from '$lib/server/cache';
export const load: PageServerLoad = async () => {
	try { return { groups: await cached('portal:telepon', getTelepon) }; }
	catch (err) { console.error('[portal] telepon:', err); return { groups: [] }; }
};
