/**
 * Gambar kalender kerja terbaru dari UPLOAD_DIR/kalender (lihat $lib/server/uploads).
 * Selalu divalidasi ulang ke server (ETag) supaya kalender baru langsung tampil;
 * bila tidak berubah, browser cukup menerima 304 tanpa mengunduh ulang.
 */
import { error } from '@sveltejs/kit';
import { createReadStream } from 'node:fs';
import { Readable } from 'node:stream';
import { latestImage } from '$lib/server/uploads';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = ({ request }) => {
	const img = latestImage('kalender');
	if (!img) error(404, 'The work calendar has not been uploaded yet.');

	const etag = `"${img.size.toString(36)}-${img.mtime.getTime().toString(36)}"`;
	const headers: Record<string, string> = {
		'Content-Type': img.type,
		'Cache-Control': 'no-cache',
		ETag: etag,
		'Last-Modified': img.mtime.toUTCString(),
		'X-Content-Type-Options': 'nosniff'
	};
	if (request.headers.get('if-none-match') === etag) {
		return new Response(null, { status: 304, headers });
	}
	const body = Readable.toWeb(createReadStream(img.full)) as ReadableStream;
	return new Response(body, { headers: { ...headers, 'Content-Length': String(img.size) } });
};
