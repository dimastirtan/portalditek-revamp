import type { PageServerLoad } from './$types';
import { getProject } from '$lib/server/portal/queries';
import { cached } from '$lib/server/cache';
export const load: PageServerLoad = async () => {
	try { return { sections: await cached('portal:project', getProject) }; }
	catch (err) { console.error('[portal] project:', err); return { sections: [] }; }
};
