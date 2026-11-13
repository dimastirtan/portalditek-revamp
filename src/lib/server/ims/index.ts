/**
 * Koneksi read-only ke database IMS (`ptdi_project` di server IMS). Terpisah
 * dari DB portal (`dittek`). Bila IMS_DB_HOST belum di-set, `imsDb` = null dan
 * semua bagian IMS di portal disembunyikan.
 *
 * Pakai user DB yang hanya punya hak SELECT (lihat README) — jangan akun
 * aplikasi IMS atau root.
 */
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

export const imsDb = env.IMS_DB_HOST
	? drizzle(
			mysql.createPool({
				host: env.IMS_DB_HOST,
				port: Number(env.IMS_DB_PORT || 3307),
				user: env.IMS_DB_USER,
				password: env.IMS_DB_PASSWORD,
				database: env.IMS_DB_NAME || 'ptdi_project',
				charset: 'utf8mb4',
				connectionLimit: 3,
				waitForConnections: true,
				connectTimeout: 3000,
				enableKeepAlive: true
			}),
			{ schema, mode: 'default' }
		)
	: null;
