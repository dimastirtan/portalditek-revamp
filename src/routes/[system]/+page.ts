import { error } from '@sveltejs/kit';
import { SYSTEMS } from '$lib/data/nav';
import type { PageLoad } from './$types';

// Slug halaman sistem didaftarkan di svelte.config.js (prerender.entries).
export const prerender = true;

export const load: PageLoad = ({ params }) => {
	const system = SYSTEMS.find((s) => s.id === params.system);
	if (!system) {
		error(404, 'Sistem tidak ditemukan');
	}
	return { system };
};
