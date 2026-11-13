import type { PageServerLoad } from './$types';
import { getHeadlines, headlineCard } from '$lib/server/portal/queries';
import { cached } from '$lib/server/cache';

export const load: PageServerLoad = async () => {
	try {
		const all = await cached('portal:headlines', getHeadlines);
		return { headlines: all.map(headlineCard) };
	} catch (err) {
		console.error('[portal] gagal memuat headline:', err);
		return { headlines: [] };
	}
};
