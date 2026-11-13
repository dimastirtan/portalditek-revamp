import type { PageServerLoad } from './$types';
import { getJadwalPn } from '$lib/server/portal/queries';
import { cached } from '$lib/server/cache';
export const load: PageServerLoad = async () => {
	try { return { jadwal: await cached('portal:jadwalPn', getJadwalPn) }; }
	catch (err) { console.error('[portal] jadwal-pn:', err); return { jadwal: { title: 'Flight Schedule', description: '', columns: [], rows: [] } }; }
};
