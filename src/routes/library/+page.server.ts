import type { PageServerLoad } from './$types';
import { getLibraryIndex } from '$lib/server/portal/queries';
export const load: PageServerLoad = async () => {
	try { return { catalogs: await getLibraryIndex() }; }
	catch (err) { console.error('[portal] library:', err); return { catalogs: [] }; }
};
