import type { PageServerLoad } from './$types';
import { getOc } from '$lib/server/portal/queries';
import { cached } from '$lib/server/cache';
export const load: PageServerLoad = async () => {
	try { return { sections: await cached('portal:oc', getOc) }; }
	catch (err) { console.error('[portal] oc:', err); return { sections: [] }; }
};
