import type { LayoutServerLoad } from './$types';
import { getAnnouncements } from '$lib/server/portal/queries';

export const load: LayoutServerLoad = async () => {
	try {
		return { announcements: await getAnnouncements() };
	} catch (err) {
		console.error('[portal] gagal memuat pengumuman:', err);
		return { announcements: [] };
	}
};
