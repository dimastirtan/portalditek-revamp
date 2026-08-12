import type { PageServerLoad } from './$types';
import { getJadwalPn } from '$lib/server/portal/queries';
export const load: PageServerLoad = async () => {
	try { return { jadwal: await getJadwalPn() }; }
	catch (err) { console.error('[portal] jadwal-pn:', err); return { jadwal: { title: 'Jadwal Penerbangan', description: '', columns: [], rows: [] } }; }
};
