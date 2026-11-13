import { error } from '@sveltejs/kit';
import { SYSTEMS } from '$lib/data/nav';
import type { PageLoad } from './$types';

// Tidak di-prerender: alamat sistem dibaca dari env saat runtime ($lib/config/legacy).
export const prerender = false;

export const load: PageLoad = ({ params }) => {
	const system = SYSTEMS.find((s) => s.id === params.system);
	if (!system) {
		error(404, 'System not found');
	}
	return { system };
};
