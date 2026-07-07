/**
 * Konfigurasi Quick Login Email Internal.
 *
 * Perilaku sekarang (identik dengan Portal lama):
 *   - Form POST ke MAIL_LOGIN_URL secara langsung dari browser
 *   - Buka tab baru (target="_blank")
 *   - Field: `loginname`, `password`
 *
 * Kalau nanti kamu mau ganti perilaku (mis. auth mandiri Portal, atau proxy
 * di backend), cukup ubah nilai di sini — komponen QuickMailLogin akan
 * mengikuti tanpa perubahan.
 *
 * Catatan adapter-static: /-mail/login sebagai proxy endpoint TIDAK bisa
 * dijalankan runtime di build production static. Kalau butuh, migrasi ke
 * adapter-node.
 */

export const MAIL_LOGIN_URL = 'https://10.1.0.6/';

/** Target window untuk form submit. */
export const MAIL_LOGIN_TARGET: '_blank' | '_self' = '_blank';

/** Nama field di form (sesuai server mail internal). Jangan diubah kecuali server berubah. */
export const MAIL_FIELD_USERNAME = 'loginname';
export const MAIL_FIELD_PASSWORD = 'password';
