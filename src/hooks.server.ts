import type { Handle, ServerInit } from '@sveltejs/kit';
import { building } from '$app/environment';
import { startDoaWatch } from '$lib/server/doa/watch';

/**
 * Saat server menyala: mulai pemantauan perubahan dokumen DOA di latar (panel
 * Notifications). Dilewati saat build supaya proses build tidak menunggu timer.
 */
export const init: ServerInit = () => {
	if (!building) startDoaWatch();
};

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
