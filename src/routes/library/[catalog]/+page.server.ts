import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getLibraryCatalog } from '$lib/server/portal/queries';
export const load: PageServerLoad = async ({ params }) => {
	try {
		const catalog = await getLibraryCatalog(params.catalog);
		if (!catalog) throw error(404, 'Katalog tidak ditemukan');
		return { catalog };
	} catch (err) {
		if (err && typeof err === 'object' && 'status' in err) throw err;
		console.error('[portal] library catalog:', err);
		return { catalog: { title: 'Katalog', description: '', columns: [], rows: [] } };
	}
};
