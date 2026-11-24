/**
 * POST /api/cache — kosongkan cache data portal (lihat $lib/server/cache), dipanggil
 * dashboard admin setelah menyimpan supaya perubahan langsung tampil.
 *
 *   curl -X POST -H "Authorization: Bearer <CACHE_CLEAR_TOKEN>" http://127.0.0.1:<PORT>/api/cache
 *
 * Mati (404) bila CACHE_CLEAR_TOKEN tidak diisi di .env. Token salah → 401.
 */
import { error, json } from '@sveltejs/kit';
import { createHash, timingSafeEqual } from 'node:crypto';
import { env } from '$env/dynamic/private';
import { clearCache } from '$lib/server/cache';
import type { RequestHandler } from './$types';

/** Bandingkan token tanpa membocorkan panjang/isi lewat waktu respons. */
const sameToken = (a: string, b: string) =>
	timingSafeEqual(createHash('sha256').update(a).digest(), createHash('sha256').update(b).digest());

export const POST: RequestHandler = ({ request, getClientAddress }) => {
	const token = env.CACHE_CLEAR_TOKEN?.trim();
	if (!token) error(404, 'Not found');

	const given = /^Bearer\s+(\S+)$/i.exec(request.headers.get('authorization') ?? '')?.[1] ?? '';
	if (!given || !sameToken(given, token)) {
		console.warn(`[cache] /api/cache ditolak (token salah) dari ${getClientAddress()}`);
		error(401, 'Unauthorized');
	}

	const cleared = clearCache();
	console.info(
		`[cache] dikosongkan lewat /api/cache dari ${getClientAddress()} (${cleared} entri)`
	);
	return json({ ok: true, cleared });
};
