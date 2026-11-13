import type { PageServerLoad } from './$types';
import { getGround, getFlight } from '$lib/server/portal/queries';
import { cached } from '$lib/server/cache';
export const load: PageServerLoad = async () => {
	try {
		const [ground, flight] = await Promise.all([
			cached('portal:ground', getGround),
			cached('portal:flight', getFlight)
		]);
		return { ground, flight };
	} catch (err) {
		console.error('[portal] gagal memuat fasilitas:', err);
		return { ground: [], flight: [] };
	}
};
