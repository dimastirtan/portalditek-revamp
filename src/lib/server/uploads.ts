/**
 * Berkas yang diunggah admin (nanti lewat dashboard admin — aplikasi terpisah) dan
 * langsung tampil tanpa build ulang. Disimpan di UPLOAD_DIR (default ./uploads),
 * BUKAN static/: isi static ikut dibekukan saat build, berkas baru di sana tidak
 * tersaji sampai build ulang.
 *
 *   UPLOAD_DIR/kalender/   gambar kalender kerja (.jpg/.png/.webp) — yang tampil
 *                          = berkas yang paling baru diubah/diunggah
 *   UPLOAD_DIR/buletin/    poster buletin — 3 terbaru tampil di Information center;
 *                          judul = nama berkas tanpa ekstensi
 *                          ("Cyber Security Bulletin #139.png")
 *   UPLOAD_DIR/headline/   gambar headline, nama = id headline (c_mainarticle_detail)
 *                          + ekstensi ("172.webp"); didahulukan dari gambar di isi
 *   UPLOAD_DIR/org/        foto pejabat; nama berkas = nilai kolom foto tmorg/tmorgdet
 *   UPLOAD_DIR/org-thumb/  thumbnail foto pejabat (± 168 px, nama sama) — dipakai
 *                          lebih dulu karena foto asli bisa berukuran besar
 *
 * Semua folder di atas (kecuali kalender) disajikan lewat /media/<folder>/<file>.
 * Data DB yang merujuk gambar ini ikut di-cache — dashboard memanggil POST /api/cache
 * setelah menyimpan (lihat src/routes/api/cache).
 */
import fs from 'node:fs';
import path from 'node:path';
import { Readable } from 'node:stream';
import { env } from '$env/dynamic/private';
import type { Bulletin } from '$lib/types/content';

const IMAGE_TYPES: Record<string, string> = {
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png',
	'.webp': 'image/webp',
	'.gif': 'image/gif'
};

/** Folder UPLOAD_DIR yang boleh diakses publik lewat /media/<folder>/<file>. */
const MEDIA_FOLDERS = new Set(['buletin', 'headline', 'org', 'org-thumb']);

export type UploadedImage = {
	file: string;
	full: string;
	type: string;
	size: number;
	mtime: Date;
};

const folderPath = (folder: string) => path.join(path.resolve(env.UPLOAD_DIR || 'uploads'), folder);

function imageAt(dir: string, file: string): UploadedImage | null {
	const type = IMAGE_TYPES[path.extname(file).toLowerCase()];
	if (!type) return null;
	const full = path.join(dir, file);
	const st = fs.statSync(full, { throwIfNoEntry: false });
	return st?.isFile() ? { file, full, type, size: st.size, mtime: st.mtime } : null;
}

/** Semua gambar di UPLOAD_DIR/<folder>, terbaru dulu; [] bila folder kosong / belum ada. */
export function listImages(folder: string): UploadedImage[] {
	const dir = folderPath(folder);
	let names: string[];
	try {
		names = fs.readdirSync(dir);
	} catch {
		return [];
	}
	return names
		.map((file) => imageAt(dir, file))
		.filter((img): img is UploadedImage => img !== null)
		.sort((a, b) => b.mtime.getTime() - a.mtime.getTime());
}

/** Gambar terbaru di UPLOAD_DIR/<folder>; null bila folder kosong / belum ada. */
export const latestImage = (folder: string): UploadedImage | null => listImages(folder)[0] ?? null;

/** ?v= berubah tiap berkas diganti, supaya browser tidak memakai versi lama. */
const version = (img: UploadedImage) => img.mtime.getTime().toString(36);

/** URL gambar kalender kerja. */
export function calendarImage(): { src: string; updated: string } | null {
	const img = latestImage('kalender');
	if (!img) return null;
	return { src: `/kalender-kerja/gambar?v=${version(img)}`, updated: img.mtime.toISOString() };
}

/** Poster buletin terbaru untuk Information center. */
export function bulletins(limit = 3): Bulletin[] {
	return listImages('buletin')
		.slice(0, limit)
		.map((img) => ({
			src: `/media/buletin/${encodeURIComponent(img.file)}?v=${version(img)}`,
			title: path.parse(img.file).name.replace(/[_]+/g, ' ').trim(),
			updated: img.mtime.toISOString()
		}));
}

/**
 * Berkas untuk endpoint /media/<folder>/<file>: hanya folder di MEDIA_FOLDERS dan nama
 * berkas tanpa pemisah path (tidak bisa keluar folder). null bila tidak diizinkan / tidak ada.
 */
export function mediaImage(folder: string, file: string): UploadedImage | null {
	if (!MEDIA_FOLDERS.has(folder)) return null;
	if (!file || /[/\\\0]/.test(file) || file.startsWith('.')) return null;
	return imageAt(folderPath(folder), file);
}

/** URL /media/... untuk berkas unggahan (dengan ?v= versi); null bila tidak ada. */
export function mediaUrl(folder: string, file: string): string | null {
	const img = mediaImage(folder, file);
	return img ? `/media/${folder}/${encodeURIComponent(img.file)}?v=${version(img)}` : null;
}

/**
 * true bila URL "/media/<folder>/<file>[?v=...]" menunjuk berkas unggahan yang ada
 * (dipakai pembersih HTML untuk <img> yang disisipkan dashboard).
 */
export function isExistingMedia(url: string): boolean {
	const m = /^\/media\/([\w-]+)\/([^/?#]+)/.exec(url);
	if (!m) return false;
	try {
		return mediaImage(m[1], decodeURIComponent(m[2])) !== null;
	} catch {
		return false;
	}
}

/** Gambar headline unggahan: id headline → URL (berkas "<id>.<ext>", terbaru menang). */
export function headlineImages(): Map<number, string> {
	const map = new Map<number, string>();
	for (const img of listImages('headline')) {
		const id = Number(path.parse(img.file).name);
		if (Number.isInteger(id) && id > 0 && !map.has(id)) {
			map.set(id, `/media/headline/${encodeURIComponent(img.file)}?v=${version(img)}`);
		}
	}
	return map;
}

/**
 * Respons gambar unggahan. Selalu divalidasi ulang ke server (ETag) supaya gambar
 * yang diganti langsung tampil; bila tidak berubah browser cukup menerima 304.
 */
export function imageResponse(img: UploadedImage, request: Request): Response {
	const etag = `"${img.size.toString(36)}-${version(img)}"`;
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
	const body = Readable.toWeb(fs.createReadStream(img.full)) as ReadableStream;
	return new Response(body, { headers: { ...headers, 'Content-Length': String(img.size) } });
}
