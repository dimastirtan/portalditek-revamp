import type { PageServerLoad } from './$types';
import { getCommandMedia } from '$lib/server/portal/queries';
export const load: PageServerLoad = async () => {
	try { return { sections: await getCommandMedia() }; }
	catch (err) { console.error('[portal] command-media:', err); return { sections: [] }; }
};
