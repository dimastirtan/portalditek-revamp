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

type GambarIndex = { at: number; files: Set<string>; byName: Map<string, string> };
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
	gambarIndex = { at: Date.now(), files, byName };
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
