import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { LEGACY } from '$lib/config/legacy';

/**
 * Merge Tailwind class names dengan aman. Menghilangkan duplikat/konflik.
 * Contoh: cn('px-2 py-1', condition && 'px-4') → 'py-1 px-4'
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/** Format ISO date ('2026-01-20') ke format Inggris ('20 January 2026'). */
export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions): string {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	return new Intl.DateTimeFormat('en-GB', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		...opts
	}).format(d);
}

/** Format persen tanpa tanda %: 23.32 → '23.32', 1.4583 → '1.46'. */
export function formatPercent(value: number, digits = 2): string {
	return new Intl.NumberFormat('en-US', { maximumFractionDigits: digits }).format(value);
}

// Helper types untuk komponen shadcn-svelte (dipakai mulai M2).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

/**
 * Kategori berkas unduhan. Sama dengan parameter `d` di download.php portal lama
 * (sudah dites di 10.1.95.116) dan nama subfolder di FILES_DIR. Umumnya nama
 * tabel tanpa awalan `tm`, kecuali artikel. Daftar yang sama ada di
 * scripts/mirror-files.mjs — ubah keduanya bila menambah kategori.
 */
export const DOWNLOAD_CATEGORIES = [
	'article',
	'download',
	'agenda',
	'jdq',
	'oc',
	'certificate',
	'certificateoc',
	'aeronautics',
	'astronautics',
	'chemats',
	'engineerings',
	'busmgmnts',
	'mathcomps',
	'physics',
	'spacescns',
	'generals',
	'regulations'
] as const;

export type DownloadCategory = (typeof DOWNLOAD_CATEGORIES)[number];

/**
 * URL unduh berkas lewat endpoint portal sendiri (src/routes/unduh). Berkas
 * dibaca dari FILES_DIR/<category>/<file>; bila belum disalin, endpoint
 * mengambilnya dari portal lama selama server itu masih hidup.
 *   file → nama berkas dari kolom N_FILE_* di database
 */
export function downloadUrl(category: DownloadCategory, file: string): string {
	return `/unduh/${category}/${encodeURIComponent(file.trim())}`;
}

/**
 * URL berkas yang sama di handler `download.php` portal lama (dipakai endpoint
 * /unduh sebagai cadangan). Alamat server diatur di $lib/config/legacy.
 */
export function legacyDownloadUrl(category: DownloadCategory, file: string): string {
	return `${LEGACY.portal}/download.php?d=${category}&id=${encodeURIComponent(file.trim())}`;
}

/**
 * URL gambar. Berkas disalin dari server lama ke `static/gambar/<folder>/`
 * (lihat copy-gambar.bat) dan disajikan otomatis oleh SvelteKit.
 *
 *   sekilas  ← images_sekilas_ditt   (foto Sekilas Dittek)
 *   org      ← images_org            (foto pejabat)
 *   artikel  ← images_article        (gambar Berita Utama)
 *   umum     ← images                (gambar umum)
 *   uploads  ← dt-admin/.../uploads  (gambar di dalam konten artikel)
 */
export type GambarFolder = 'sekilas' | 'org' | 'artikel' | 'umum' | 'uploads' | 'gallery' | 'sistem';

export function imgUrl(file: string, folder: GambarFolder = 'umum'): string {
	return `/gambar/${folder}/${encodeURIComponent((file ?? '').trim())}`;
}
