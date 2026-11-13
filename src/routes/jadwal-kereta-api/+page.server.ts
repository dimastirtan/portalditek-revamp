import type { PageServerLoad } from './$types';
import { getJadwalKa } from '$lib/server/portal/queries';
import { cached } from '$lib/server/cache';
export const load: PageServerLoad = async () => {
	try { return { jadwal: await cached('portal:jadwalKa', getJadwalKa) }; }
	catch (err) { console.error('[portal] jadwal-ka:', err); return { jadwal: { title: 'Train Schedule', description: '', columns: [], rows: [] } }; }
};
