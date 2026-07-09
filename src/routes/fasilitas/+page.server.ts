import type { PageServerLoad } from './$types';
import { getGround, getFlight } from '$lib/server/portal/queries';
export const load: PageServerLoad = async () => {
	try {
		const [ground, flight] = await Promise.all([getGround(), getFlight()]);
		return { ground, flight };
	} catch (err) {
		console.error('[portal] gagal memuat fasilitas:', err);
		return { ground: [], flight: [] };
	}
};
