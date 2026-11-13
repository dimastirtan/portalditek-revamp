import type { PageServerLoad } from './$types';
import { getRegulations } from '$lib/server/portal/queries';
import { cached } from '$lib/server/cache';
export const load: PageServerLoad = async () => {
	try { return { sections: await cached('portal:regulations', getRegulations) }; }
	catch (err) { console.error('[portal] regulation:', err); return { sections: [] }; }
};
