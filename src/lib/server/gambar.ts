/**
 * Indeks berkas di static/gambar — untuk memastikan gambar yang dirujuk benar-benar
 * ada sebelum dikirim ke browser (tidak ada ikon gambar rusak / request 404).
 *
 * Dev dan `node build` dari root proyek → static/gambar; build yang dijalankan tanpa
 * folder static → build/client/gambar. Folder tidak ketemu → indeks null, dan
 * pemanggil kembali ke perilaku lama (tanpa pengecekan).
 * Dibangun ulang tiap menit supaya gambar yang baru disalin ikut terbaca.
 */
import fs from 'node:fs';
import path from 'node:path';

const GAMBAR_DIRS = ['static/gambar', 'build/client/gambar'];
const INDEX_TTL = 60_000;
/** Folder turunan (thumbnail) — bukan sumber untuk pencarian berdasarkan nama. */
const DERIVED = /^org-thumb\//;

type GambarIndex = { at: number; dir: string; files: Set<string>; byName: Map<string, string> };
let gambarIndex: GambarIndex | null = null;

/** "uploads/pilot_11.gif" → "/gambar/uploads/pilot_11.gif" (tiap segmen di-encode). */
const toUrl = (rel: string) => `/gambar/${rel.split('/').map(encodeURIComponent).join('/')}`;

function getGambarIndex(): GambarIndex | null {
	if (gambarIndex && Date.now() - gambarIndex.at < INDEX_TTL) return gambarIndex;
	const dir = GAMBAR_DIRS.map((d) => path.resolve(d)).find((d) => fs.existsSync(d));
	if (!dir) return null;
	const files = new Set<string>(); // "uploads/pilot_11.gif" — persis seperti di disk
	const byName = new Map<string, string>(); // "pilot_11.gif" (huruf kecil) → URL
	for (const d of fs.readdirSync(dir, { recursive: true, withFileTypes: true })) {
		if (!d.isFile()) continue;
		const rel = path.relative(dir, path.join(d.parentPath, d.name)).split(path.sep).join('/');
		files.add(rel);
		const key = d.name.toLowerCase();
		if (!DERIVED.test(rel) && !byName.has(key)) byName.set(key, toUrl(rel));
	}
	gambarIndex = { at: Date.now(), dir, files, byName };
	return gambarIndex;
}

/** "/gambar/a%20b.jpg" → "a b.jpg" (relatif ke folder gambar); null bila bukan URL /gambar/. */
function relOf(url: string): string | null {
	if (!url.startsWith('/gambar/')) return null;
	try {
		return decodeURIComponent(url.slice('/gambar/'.length));
	} catch {
		return url.slice('/gambar/'.length);
	}
}

/**
 * Apakah static/gambar/<rel> ada (rel persis, mis. "org/eka.jpg")?
 * null = tidak bisa dicek (folder gambar tidak ditemukan).
 */
export function hasGambar(rel: string): boolean | null {
	const index = getGambarIndex();
	return index ? index.files.has(rel) : null;
}

/**
 * Pastikan URL /gambar/... ada di disk. Bila tidak, cari berkas bernama sama di
 * folder lain (HTML lama kadang menunjuk images/ padahal berkasnya di uploads/,
 * atau beda huruf besar-kecil). Tetap tidak ada → null.
 */
export function ensureLocal(url: string): string | null {
	const index = getGambarIndex();
	const rel = relOf(url);
	if (!index || rel === null) return url;
	if (index.files.has(rel)) return url;
	return index.byName.get((rel.split('/').pop() ?? '').toLowerCase()) ?? null;
}

/**
 * Lebar (px) gambar lokal /gambar/... dibaca dari header berkasnya (JPEG/PNG/GIF/WebP),
 * tanpa men-decode gambar. null bila bukan gambar lokal atau formatnya tidak dikenali.
 */
export function imageWidth(url: string): number | null {
	const index = getGambarIndex();
	const rel = relOf(url);
	if (!index || rel === null || !index.files.has(rel)) return null;
	try {
		return readWidth(path.join(index.dir, ...rel.split('/')));
	} catch {
		return null;
	}
}

function readWidth(file: string): number | null {
	const fd = fs.openSync(file, 'r');
	try {
		const head = Buffer.alloc(30);
		if (fs.readSync(fd, head, 0, 30, 0) < 30) return null;
		if (head.readUInt32BE(0) === 0x89504e47) return head.readUInt32BE(16); // PNG
		if (head.toString('ascii', 0, 3) === 'GIF') return head.readUInt16LE(6);
		if (head.toString('ascii', 0, 4) === 'RIFF' && head.toString('ascii', 8, 12) === 'WEBP') {
			const kind = head.toString('ascii', 12, 16);
			if (kind === 'VP8 ') return head.readUInt16LE(26) & 0x3fff;
			if (kind === 'VP8L') return 1 + (((head[22] & 0x3f) << 8) | head[21]);
			if (kind === 'VP8X') return 1 + head.readUIntLE(24, 3);
			return null;
		}
		if (head[0] !== 0xff || head[1] !== 0xd8) return null;
		// JPEG: telusuri segmen sampai frame header (SOFn) yang memuat ukuran.
		const seg = Buffer.alloc(9);
		let pos = 2;
		for (let guard = 0; guard < 1000; guard++) {
			if (fs.readSync(fd, seg, 0, 9, pos) < 9 || seg[0] !== 0xff) return null;
			const marker = seg[1];
			if (marker === 0xff) {
				pos++; // byte pengisi
				continue;
			}
			if (marker >= 0xc0 && marker <= 0xcf && marker !== 0xc4 && marker !== 0xc8 && marker !== 0xcc) {
				return seg.readUInt16BE(7);
			}
			pos += marker === 0x01 || (marker >= 0xd0 && marker <= 0xd8) ? 2 : 2 + seg.readUInt16BE(2);
		}
		return null;
	} finally {
		fs.closeSync(fd);
	}
}
