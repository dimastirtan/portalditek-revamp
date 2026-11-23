/**
 * Gambar unggahan admin dari UPLOAD_DIR/<folder>/<file> — tampil tanpa build ulang.
 * Hanya folder yang diizinkan (MEDIA_FOLDERS di $lib/server/uploads), mis. buletin.
 */
import { error } from '@sveltejs/kit';
import { mediaImage, imageResponse } from '$lib/server/uploads';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ params, request }) => {
	const img = mediaImage(params.folder, params.file);
	if (!img) error(404, 'Not found');
	return imageResponse(img, request);
};
