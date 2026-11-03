/**
 * Alamat server portal lama (PHP) dan sub-sistem yang masih di-host di sana.
 *
 * Server lama 10.1.95.76 (portalditek.indonesian-aerospace.com) akan di-disable;
 * salinannya sudah jalan di 10.1.95.116, jadi default di bawah mengarah ke sana.
 *
 * Bisa di-override lewat environment (.env) tanpa rebuild — cukup restart server.
 * Variabel PUBLIC_* ikut terkirim ke browser, jadi jangan taruh rahasia di sini.
 */
import { env } from '$env/dynamic/public';

const url = (value: string | undefined, fallback: string) =>
	(value?.trim() || fallback).replace(/\/+$/, '');

export const LEGACY = {
	/** Portal PHP lama: handler download.php dan folder certification/. */
	portal: url(env.PUBLIC_LEGACY_PORTAL_URL, 'http://10.1.95.116'),
	/** Web DOA (dulu /webdoa/ di server lama). */
	doa: url(env.PUBLIC_DOA_URL, 'http://10.1.95.116:8081'),
	/** dotProject (dulu /dotproject/ di server lama). */
	dotproject: url(env.PUBLIC_DOTPROJECT_URL, 'http://10.1.95.116:8083'),
	/** DOA Library (dulu /library/ di server lama). */
	doaLibrary: url(env.PUBLIC_DOA_LIBRARY_URL, 'http://10.1.95.116:8084/library')
};
