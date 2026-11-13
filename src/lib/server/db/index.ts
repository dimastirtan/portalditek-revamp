/**
 * Koneksi database. Modul ini ada di $lib/server sehingga SvelteKit menjamin
 * ia TIDAK PERNAH ikut ter-bundle ke client — kredensial aman di sisi server.
 *
 * Kredensial dibaca dari environment (.env), jangan pernah di-hardcode/di-commit.
 * Lihat .env.example untuk daftar variabel.
 */
import { drizzle } from 'drizzle-orm/mysql2';
import mysql from 'mysql2/promise';
import { env } from '$env/dynamic/private';
import * as schema from './schema';

const pool = mysql.createPool({
	host: env.DB_HOST ?? '127.0.0.1',
	port: Number(env.DB_PORT ?? 3306),
	user: env.DB_USER ?? 'root',
	password: env.DB_PASSWORD ?? '',
	database: env.DB_NAME ?? 'dittek',
	// Data lama tersimpan sebagai byte UTF-8 di kolom ber-charset latin1.
	// utf8mb4 pada koneksi + fixText() di transform.ts menangani sisa mojibake.
	charset: 'utf8mb4',
	connectionLimit: 5,
	waitForConnections: true,
	// Gagal cepat bila DB tidak terjangkau (default 10 detik); cache di
	// $lib/server/cache yang menahan percobaan ulang & memakai data terakhir.
	connectTimeout: 3000,
	// Jaga koneksi idle tetap hidup melewati firewall antar-jaringan.
	enableKeepAlive: true
});

export const db = drizzle(pool, { schema, mode: 'default' });
