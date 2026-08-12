import type { PageServerLoad } from './$types';
import { getHki } from '$lib/server/portal/queries';
export const load: PageServerLoad = async () => {
	try { return { sections: await getHki() }; }
	catch (err) { console.error('[portal] hki:', err); return { sections: [] }; }
};
