import type { LayoutServerLoad } from './$types';
import { getDoaUpdates } from '$lib/server/doa/watch';

/**
 * Data untuk semua halaman: perubahan dokumen DOA 7 hari terakhir (panel Notifications,
 * dibaca dari memori — tanpa query per request).
 *
 * Pengumuman (getAnnouncements + announcement-panel.svelte) tidak lagi dimuat sejak
 * tombol loncengnya dihapus dari topbar; pasang lagi di sini & di +layout.svelte bila perlu.
 */
export const load: LayoutServerLoad = () => ({ doaUpdates: getDoaUpdates() });
