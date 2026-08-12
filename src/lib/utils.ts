import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

/**
 * Merge Tailwind class names dengan aman. Menghilangkan duplikat/konflik.
 * Contoh: cn('px-2 py-1', condition && 'px-4') → 'py-1 px-4'
 */
export function cn(...inputs: ClassValue[]) {
	return twMerge(clsx(inputs));
}

/** Format ISO date ('2026-01-20') ke format Indonesia ('20 Januari 2026'). */
export function formatDate(iso: string, opts?: Intl.DateTimeFormatOptions): string {
	const d = new Date(iso);
	if (Number.isNaN(d.getTime())) return iso;
	return new Intl.DateTimeFormat('id-ID', {
		day: 'numeric',
		month: 'long',
		year: 'numeric',
		...opts
	}).format(d);
}

// Helper types untuk komponen shadcn-svelte (dipakai mulai M2).
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChild<T> = T extends { child?: any } ? Omit<T, 'child'> : T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type WithoutChildren<T> = T extends { children?: any } ? Omit<T, 'children'> : T;
export type WithoutChildrenOrChild<T> = WithoutChildren<WithoutChild<T>>;
export type WithElementRef<T, U extends HTMLElement = HTMLElement> = T & { ref?: U | null };

/**
 * URL berkas dokumen. Letakkan file asli di `static/dokumen/` (disajikan
 * otomatis oleh SvelteKit tanpa route tambahan). Nama file berasal dari kolom
 * N_FILE_* di database.
 */
export function docUrl(file: string): string {
	return `/dokumen/${encodeURIComponent((file ?? '').trim())}`;
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
