import type { PageServerLoad } from './$types';
import { getHki } from '$lib/server/portal/queries';
import { cached } from '$lib/server/cache';
export const load: PageServerLoad = async () => {
	try { return { sections: await cached('portal:hki', getHki) }; }
	catch (err) { console.error('[portal] hki:', err); return { sections: [] }; }
};
