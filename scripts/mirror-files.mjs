/**
 * Salin semua berkas dokumen dari portal lama (download.php) ke FILES_DIR,
 * supaya portal baru tidak bergantung lagi pada server lama.
 *
 *   npm run mirror-files                 # salin yang belum ada
 *   npm run mirror-files -- --dry-run    # hanya hitung, tidak mengunduh
 *   npm run mirror-files -- --only=jdq,oc
 *
 * Aman dijalankan berulang (berkas yang sudah ada dilewati) — jalankan ulang
 * berkala selama admin masih meng-upload lewat dt-admin portal lama.
 * Jalankan di mesin yang menjalankan portal (FILES_DIR harus ada di sana).
 *
 * Env (dibaca dari .env): DB_*, FILES_DIR (default ./files), MIRROR_SOURCES
 * (daftar base URL portal lama dipisah koma, dicoba berurutan; default
 * PUBLIC_LEGACY_PORTAL_URL lalu server lama 10.1.95.76).
 */
import { createWriteStream } from 'node:fs';
import { mkdir, rename, rm, stat } from 'node:fs/promises';
import http from 'node:http';
import https from 'node:https';
import path from 'node:path';
import { pipeline } from 'node:stream/promises';
import mysql from 'mysql2/promise';

// kategori (= parameter `d` download.php = subfolder) → tabel & kolom file.
// Samakan dengan DOWNLOAD_CATEGORIES di src/lib/utils.ts.
const SOURCES = [
	['article', 'tmartikel', 'N_FILE_ARTIKEL'],
	['download', 'tmdownload', 'N_FILE_DOWNLOAD'],
	['agenda', 'tmagenda', 'N_FILE_AGENDA'],
	['jdq', 'tmjdqdet', 'N_FILE_JDQ'],
	['oc', 'tmoc', 'n_file'],
	['certificate', 'tmcertificate', 'n_file'],
	['certificateoc', 'tmcertificateoc', 'n_file'],
	['aeronautics', 'tmaeronautics', 'N_FILE_AERONAUTICS'],
	['astronautics', 'tmastronautics', 'N_FILE_ASTRONAUTICS'],
	['chemats', 'tmchemats', 'N_FILE_CHEMATS'],
	['engineerings', 'tmengineerings', 'N_FILE_ENGINEERINGS'],
	['busmgmnts', 'tmbusmgmnts', 'N_FILE_BUSMGMNTS'],
	['mathcomps', 'tmmathcomps', 'N_FILE_MATHCOMPS'],
	['physics', 'tmphysics', 'N_FILE_PHYSICS'],
	['spacescns', 'tmspacescns', 'N_FILE_SPACESCNS'],
	['generals', 'tmgenerals', 'N_FILE_GENERALS'],
	['regulations', 'tmregulations', 'N_FILE_REGULATIONS']
];

const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const only = args.find((a) => a.startsWith('--only='))?.slice(7).split(',');

const filesDir = path.resolve(process.env.FILES_DIR || 'files');
const bases = (
	process.env.MIRROR_SOURCES ||
	`${process.env.PUBLIC_LEGACY_PORTAL_URL || 'http://10.1.95.116'},http://10.1.95.76`
)
	.split(',')
	.map((s) => s.trim().replace(/\/+$/, ''))
	.filter(Boolean);

const mb = (n) => `${(n / 1048576).toFixed(1)} MB`;

async function listFiles() {
	const conn = await mysql.createConnection({
		host: process.env.DB_HOST ?? '127.0.0.1',
		port: Number(process.env.DB_PORT ?? 3306),
		user: process.env.DB_USER ?? 'root',
		password: process.env.DB_PASSWORD ?? '',
		database: process.env.DB_NAME ?? 'dittek',
		charset: 'utf8mb4'
	});
	const jobs = new Map();
	try {
		for (const [category, table, column] of SOURCES) {
			if (only && !only.includes(category)) continue;
			const [rows] = await conn.query(`SELECT \`${column}\` AS f FROM \`${table}\``);
			for (const { f } of rows) {
				// Trim sama seperti portal (queries.ts) supaya nama file di link dan di disk cocok.
				const file = String(f ?? '').trim();
				if (file) jobs.set(`${category}/${file}`, { category, file });
			}
		}
	} finally {
		await conn.end();
	}
	return [...jobs.values()];
}

/**
 * GET via node:http, bukan fetch: undici di Node 24 bisa crash (assert !this.paused)
 * saat server PHP menutup koneksi di tengah stream, dan crash itu tidak bisa di-catch.
 * Timeout berlaku saat menyambung maupun bila transfer macet.
 */
function get(url, timeout = 30_000) {
	return new Promise((resolve, reject) => {
		const req = (url.startsWith('https:') ? https : http).get(url, { timeout }, resolve);
		req.on('timeout', () => req.destroy(new Error('timeout')));
		req.on('error', reject);
	});
}

/** Unduh satu berkas dari server pertama yang punya; kembalikan [base, bytes] atau null. */
async function fetchOne({ category, file }, dest) {
	for (const base of bases) {
		const url = `${base}/download.php?d=${category}&id=${encodeURIComponent(file)}`;
		let res;
		try {
			res = await get(url);
		} catch {
			continue; // server mati / tidak terjangkau → coba sumber berikutnya
		}
		// download.php membalas 200 text/html (bukan force-download) bila berkas tidak ada,
		// dan force-download 0 byte bila berkasnya kosong di server.
		if (
			res.statusCode !== 200 ||
			!res.headers['content-type']?.includes('force-download') ||
			res.headers['content-length'] === '0'
		) {
			res.on('error', () => {}).resume();
			continue;
		}
		const tmp = `${dest}.part`;
		await mkdir(path.dirname(dest), { recursive: true });
		try {
			await pipeline(res, createWriteStream(tmp));
			const { size } = await stat(tmp);
			const expected = Number(res.headers['content-length']);
			if (!size) throw new Error('berkas kosong');
			if (expected && size !== expected) throw new Error(`ukuran ${size} ≠ ${expected}`);
			await rename(tmp, dest);
			return [base, size];
		} catch (err) {
			await rm(tmp, { force: true });
			console.warn(`  ! gagal dari ${base}: ${category}/${file} (${err.message})`);
		}
	}
	return null;
}

const jobs = await listFiles();
const todo = [];
for (const job of jobs) {
	const dest = path.join(filesDir, job.category, job.file);
	const info = await stat(dest).catch(() => null);
	if (!info?.size) todo.push({ ...job, dest });
}

console.log(`Folder tujuan : ${filesDir}`);
console.log(`Sumber        : ${bases.join(' → ')}`);
console.log(`Berkas di DB  : ${jobs.length} (sudah ada ${jobs.length - todo.length}, perlu disalin ${todo.length})`);
if (dryRun || !todo.length) process.exit(0);

let done = 0;
let bytes = 0;
const missing = [];
const queue = [...todo];
await Promise.all(
	Array.from({ length: 4 }, async () => {
		for (let job; (job = queue.shift()); ) {
			const got = await fetchOne(job, job.dest);
			done++;
			if (got) {
				bytes += got[1];
				console.log(`[${done}/${todo.length}] ✓ ${job.category}/${job.file} (${mb(got[1])}) ← ${got[0]}`);
			} else {
				missing.push(`${job.category}/${job.file}`);
				console.log(`[${done}/${todo.length}] ✗ ${job.category}/${job.file} — tidak ada di semua sumber`);
			}
		}
	})
);

console.log(`\nSelesai: ${todo.length - missing.length} berkas disalin (${mb(bytes)}), ${missing.length} tidak ditemukan.`);
if (missing.length) {
	console.log('Berkas berikut tidak ada di server mana pun — minta file aslinya ke pemilik konten:');
	for (const m of missing.sort()) console.log(`  - ${m}`);
	process.exitCode = 1;
}
