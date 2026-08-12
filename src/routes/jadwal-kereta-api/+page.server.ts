import type { PageServerLoad } from './$types';
import { getJadwalKa } from '$lib/server/portal/queries';
export const load: PageServerLoad = async () => {
	try { return { jadwal: await getJadwalKa() }; }
	catch (err) { console.error('[portal] jadwal-ka:', err); return { jadwal: { title: 'Jadwal Kereta Api', description: '', columns: [], rows: [] } }; }
};
