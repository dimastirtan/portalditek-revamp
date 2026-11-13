import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getHeadlines, headlineCard } from '$lib/server/portal/queries';
import { cached } from '$lib/server/cache';
import type { Headline } from '$lib/types/content';

export const load: PageServerLoad = async ({ params }) => {
	let all: Headline[];
	try {
		// Daftar lengkap (± 27 baris) sudah di-cache → detail tidak perlu query per id.
		all = await cached('portal:headlines', getHeadlines);
	} catch (err) {
		console.error('[portal] gagal memuat headline:', err);
		error(503, 'Headlines could not be loaded. Please try again shortly.');
	}

	const index = all.findIndex((h) => String(h.id) === params.id);
	if (index < 0) error(404, 'Headline not found');
	const headline = all[index];

	return {
		headline,
		// Ada gambar di isi berita → tidak perlu gambar besar di atasnya.
		inlineImage: /<img\b/i.test(headline.html),
		related: all
			.filter((h) => h.storyId !== null && h.storyId === headline.storyId && h.id !== headline.id)
			.map(headlineCard),
		newer: index > 0 ? headlineCard(all[index - 1]) : null,
		older: index < all.length - 1 ? headlineCard(all[index + 1]) : null
	};
};
