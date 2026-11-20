/**
 * Berkas yang diunggah admin (nanti lewat dashboard admin — aplikasi terpisah) dan
 * langsung tampil tanpa build ulang. Disimpan di UPLOAD_DIR (default ./uploads),
 * BUKAN static/: isi static ikut dibekukan saat build, berkas baru di sana tidak
 * tersaji sampai build ulang.
 *
 *   UPLOAD_DIR/kalender/   gambar kalender kerja (.jpg/.png/.webp) — yang tampil
 *                          = berkas yang paling baru diubah/diunggah
 */
import fs from 'node:fs';
import path from 'node:path';
import { env } from '$env/dynamic/private';

const IMAGE_TYPES: Record<string, string> = {
	'.jpg': 'image/jpeg',
	'.jpeg': 'image/jpeg',
	'.png': 'image/png',
	'.webp': 'image/webp',
	'.gif': 'image/gif'
};

export type UploadedImage = {
	file: string;
	full: string;
	type: string;
	size: number;
	mtime: Date;
};

/** Gambar terbaru di UPLOAD_DIR/<folder>; null bila folder kosong / belum ada. */
export function latestImage(folder: string): UploadedImage | null {
	const dir = path.join(path.resolve(env.UPLOAD_DIR || 'uploads'), folder);
	let names: string[];
	try {
		names = fs.readdirSync(dir);
	} catch {
		return null;
	}
	let best: UploadedImage | null = null;
	for (const file of names) {
		const type = IMAGE_TYPES[path.extname(file).toLowerCase()];
		if (!type) continue;
		const full = path.join(dir, file);
		const st = fs.statSync(full, { throwIfNoEntry: false });
		if (!st?.isFile()) continue;
		if (!best || st.mtimeMs > best.mtime.getTime()) {
			best = { file, full, type, size: st.size, mtime: st.mtime };
		}
	}
	return best;
}

/** URL gambar kalender kerja; ?v= berubah tiap ada unggahan baru. */
export function calendarImage(): { src: string; updated: string } | null {
	const img = latestImage('kalender');
	if (!img) return null;
	return {
		src: `/kalender-kerja/gambar?v=${img.mtime.getTime().toString(36)}`,
		updated: img.mtime.toISOString()
	};
}
