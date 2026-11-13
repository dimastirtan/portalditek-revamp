import type { Handle } from '@sveltejs/kit';

/**
 * Header keamanan dasar untuk semua respons halaman & endpoint: portal tidak
 * bisa disisipkan di iframe situs lain, browser tidak menebak tipe berkas, dan
 * URL lengkap halaman tidak ikut terkirim ke situs luar saat tautan diklik.
 */
export const handle: Handle = async ({ event, resolve }) => {
	const response = await resolve(event);
	response.headers.set('X-Content-Type-Options', 'nosniff');
	response.headers.set('X-Frame-Options', 'SAMEORIGIN');
	response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
	return response;
};
