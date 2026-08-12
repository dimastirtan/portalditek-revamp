import type { PageServerLoad } from './$types';
import { getProject } from '$lib/server/portal/queries';
export const load: PageServerLoad = async () => {
	try { return { sections: await getProject() }; }
	catch (err) { console.error('[portal] project:', err); return { sections: [] }; }
};
