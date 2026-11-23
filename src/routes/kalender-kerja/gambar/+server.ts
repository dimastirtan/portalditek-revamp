/** Gambar kalender kerja terbaru dari UPLOAD_DIR/kalender (lihat $lib/server/uploads). */
import { error } from '@sveltejs/kit';
import { latestImage, imageResponse } from '$lib/server/uploads';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ request }) => {
	const img = latestImage('kalender');
	if (!img) error(404, 'The work calendar has not been uploaded yet.');
	return imageResponse(img, request);
};
