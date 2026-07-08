import 'dotenv/config';
import { defineConfig } from 'drizzle-kit';

// Opsional — untuk `drizzle-kit studio` / introspeksi. Aplikasi sendiri tidak
// menjalankan migrasi (DB `dittek` sudah ada dari hasil import SQL).
export default defineConfig({
	dialect: 'mysql',
	schema: './src/lib/server/db/schema.ts',
	dbCredentials: {
		host: process.env.DB_HOST ?? '127.0.0.1',
		port: Number(process.env.DB_PORT ?? 3306),
		user: process.env.DB_USER ?? 'root',
		password: process.env.DB_PASSWORD ?? '',
		database: process.env.DB_NAME ?? 'dittek'
	}
});
