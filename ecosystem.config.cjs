/**
 * Konfigurasi pm2 untuk portal (production). Semua pengaturan (DB, PORT, ORIGIN,
 * FILES_DIR, …) tetap di .env — file ini hanya cara menjalankannya.
 *
 * Pertama kali (dari root proyek):
 *   npm ci && npm run build
 *   pm2 start ecosystem.config.cjs
 *   pm2 save
 *
 * Update kode : git pull && npm ci && npm run build && pm2 restart portal-ditek
 * Ubah .env   : pm2 restart portal-ditek   (.env dibaca saat proses start)
 * Log         : pm2 logs portal-ditek
 */
module.exports = {
	apps: [
		{
			name: 'portal-ditek',
			cwd: __dirname,
			script: 'build/index.js',
			// Node ≥ 20.6 membaca .env sendiri — sama seperti `npm start`.
			node_args: '--env-file=.env',
			// Satu proses saja: cache data ada di memori proses; mode cluster membuat
			// cache & koneksi DB berlipat tanpa manfaat berarti untuk portal internal.
			exec_mode: 'fork',
			instances: 1,
			autorestart: true,
			max_memory_restart: '700M',
			// Beri waktu request yang sedang berjalan untuk selesai saat restart.
			kill_timeout: 10000,
			time: true, // timestamp di log
			env: { NODE_ENV: 'production' }
		}
	]
};
