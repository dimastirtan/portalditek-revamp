import type { PageServerLoad } from './$types';
import { error } from '@sveltejs/kit';
import { getImsProgram, imsConfigured } from '$lib/server/ims/queries';
import type { ImsProgramDetail } from '$lib/types/content';

export const load: PageServerLoad = async ({ params }) => {
	let program: ImsProgramDetail | null;
	try {
		program = await getImsProgram(params.slug);
	} catch (err) {
		// IMS tidak terjangkau → tampilkan pesan, bukan 404/500.
		console.error('[portal] program IMS:', err);
		return { program: null };
	}
	if (!program && imsConfigured) error(404, 'Program tidak ditemukan');
	return { program };
};
