import type { PageServerLoad } from './$types';
import { getLinks } from '$lib/server/portal/queries';
import { cached } from '$lib/server/cache';
export const load: PageServerLoad = async () => {
	try { return { groups: await cached('portal:links', getLinks) }; }
	catch (err) { console.error('[portal] link:', err); return { groups: [] }; }
};
