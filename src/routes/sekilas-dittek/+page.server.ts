import type { PageServerLoad } from './$types';
import { getSekilas } from '$lib/server/portal/queries';
import { cached } from '$lib/server/cache';
export const load: PageServerLoad = async () => {
	try { return { items: await cached('portal:sekilas', getSekilas) }; }
	catch (err) { console.error('[portal] sekilas:', err); return { items: [] }; }
};
