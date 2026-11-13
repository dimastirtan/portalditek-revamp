import type { LayoutServerLoad } from './$types';
import { getAnnouncements } from '$lib/server/portal/queries';
import { cached } from '$lib/server/cache';

export const load: LayoutServerLoad = async () => {
	try {
		return { announcements: await cached('portal:announcements', getAnnouncements) };
	} catch (err) {
		console.error('[portal] gagal memuat pengumuman:', err);
		return { announcements: [] };
	}
};
