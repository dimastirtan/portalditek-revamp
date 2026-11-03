/**
 * Unduh berkas dokumen (artikel, download, agenda, JDQ, OC, Online Publication).
 *
 * Berkas dibaca dari FILES_DIR/<category>/<file> (salin dulu dengan
 * `npm run mirror-files`). Bila belum ada di sana, berkas diambil dari
 * download.php portal lama — selama server itu masih hidup — supaya upload
 * baru lewat dt-admin tetap bisa diunduh sebelum mirror dijalankan ulang.
 */
import { error } from '@sveltejs/kit';
import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import http from 'node:http';
import https from 'node:https';
import path from 'node:path';
import { Readable } from 'node:stream';
import { env } from '$env/dynamic/private';
import { DOWNLOAD_CATEGORIES, legacyDownloadUrl, type DownloadCategory } from '$lib/utils';
import type { RequestHandler } from './$types';

const MIME: Record<string, string> = {
	pdf: 'application/pdf',
	doc: 'application/msword',
	docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
	xls: 'application/vnd.ms-excel',
	xlsx: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	ppt: 'application/vnd.ms-powerpoint',
	pptx: 'application/vnd.openxmlformats-officedocument.presentationml.presentation',
	pps: 'application/vnd.ms-powerpoint',
	zip: 'application/zip',
	rar: 'application/vnd.rar',
	jpg: 'image/jpeg',
	jpeg: 'image/jpeg',
	png: 'image/png',
	gif: 'image/gif'
};

/** Header unduhan; nama file non-ASCII dikirim lewat filename* (RFC 6266). */
function downloadHeaders(file: string, size?: number): Headers {
	const ext = file.split('.').pop()?.toLowerCase() ?? '';
	const ascii = file.replace(/[^\x20-\x7e]|["\\]/g, '_');
	const headers = new Headers({
		'Content-Type': MIME[ext] ?? 'application/octet-stream',
		'Content-Disposition': `attachment; filename="${ascii}"; filename*=UTF-8''${encodeURIComponent(file)}`,
		'Cache-Control': 'public, max-age=3600',
		'X-Content-Type-Options': 'nosniff'
	});
	if (size !== undefined) headers.set('Content-Length', String(size));
	return headers;
}

/**
 * GET via node:http, bukan fetch: undici di Node 24 bisa crash (assert !this.paused)
 * saat server PHP menutup koneksi di tengah stream — crash yang tidak bisa di-catch
 * dan ikut mematikan server portal. Timeout 5 detik hanya sampai header diterima.
 */
function legacyGet(url: string): Promise<http.IncomingMessage> {
	return new Promise((resolve, reject) => {
		const req = (url.startsWith('https:') ? https : http).get(url, { timeout: 5000 }, (res) => {
			req.setTimeout(0); // klien lambat jangan sampai memutus transfer
			resolve(res);
		});
		req.on('timeout', () => req.destroy(new Error('timeout')));
		req.on('error', reject);
	});
}

/** Ambil dari portal lama; null bila server mati atau berkasnya tidak ada di sana. */
async function fromLegacy(category: DownloadCategory, file: string): Promise<Response | null> {
	let res: http.IncomingMessage;
	try {
		res = await legacyGet(legacyDownloadUrl(category, file));
	} catch {
		return null;
	}
	// download.php membalas 200 text/html (bukan force-download) bila berkas tidak ada,
	// dan force-download 0 byte bila berkasnya kosong di server.
	const lenHeader = res.headers['content-length'];
	const len = lenHeader === undefined ? NaN : Number(lenHeader);
	if (
		res.statusCode !== 200 ||
		!res.headers['content-type']?.includes('force-download') ||
		len === 0
	) {
		res.on('error', () => {}).resume();
		return null;
	}
	return new Response(Readable.toWeb(res) as ReadableStream, {
		headers: downloadHeaders(file, Number.isFinite(len) ? len : undefined)
	});
}

export const GET: RequestHandler = async ({ params }) => {
	const category = params.category as DownloadCategory;
	const file = params.file;
	if (!DOWNLOAD_CATEGORIES.includes(category)) error(404, 'Berkas tidak ditemukan');
	// Nama file dari DB tidak pernah mengandung pemisah path; tolak agar tidak bisa keluar folder.
	if (!file || /[/\\\0]/.test(file) || file === '.' || file === '..') {
		error(404, 'Berkas tidak ditemukan');
	}

	const full = path.join(path.resolve(env.FILES_DIR || 'files'), category, file);
	const info = await stat(full).catch(() => null);
	if (info?.isFile()) {
		const body = Readable.toWeb(createReadStream(full)) as ReadableStream;
		return new Response(body, { headers: downloadHeaders(file, info.size) });
	}

	const legacy = await fromLegacy(category, file);
	if (legacy) return legacy;

	console.warn(`[unduh] berkas tidak ada: ${category}/${file}`);
	error(404, 'Berkas tidak ditemukan. Hubungi admin portal.');
};
