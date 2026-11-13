import type { PageServerLoad } from './$types';
import { getCommandMedia } from '$lib/server/portal/queries';
import { cached } from '$lib/server/cache';
export const load: PageServerLoad = async () => {
	try { return { sections: await cached('portal:commandMedia', getCommandMedia) }; }
	catch (err) { console.error('[portal] command-media:', err); return { sections: [] }; }
};
