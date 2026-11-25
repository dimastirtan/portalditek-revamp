/**
 * Pemantau perubahan dokumen DOA untuk panel Notifications portal.
 *
 * Database DOA (`standard`, tabel `standard`) tidak mencatat kapan admin menambah atau
 * mengubah dokumen — kolom `date` adalah tanggal dokumen dibuat, bukan diunggah, dan
 * tidak ada tabel log perubahan. Jadi portal membandingkan sendiri: tiap SCAN_INTERVAL
 * sidik tiap baris (jenis, nomor, revisi, judul, berkas, status) dibandingkan dengan
 * pemindaian sebelumnya; yang baru/berubah dicatat beserta waktu terdeteksi ke
 * DATA_DIR/doa-watch.json. Panel menampilkan perubahan WINDOW (7 hari) terakhir; yang
 * lebih lama hilang sendiri. Dokumen yang dihapus admin (remark 'D') tidak ditampilkan.
 *
 * Batasan: waktu = saat terdeteksi (≤ SCAN_INTERVAL setelah admin menyimpan; perubahan
 * selama portal mati tercatat saat portal menyala lagi). Pemindaian pertama hanya
 * mencatat kondisi awal — dokumen yang sudah ada tidak dianggap baru.
 *
 * Koneksi: DOA_DB_* (default host/port/user/password ikut IMS_DB_*, database `standard`).
 * Cukup user read-only dengan SELECT pada standard.standard.
 */
import fs from 'node:fs';
import path from 'node:path';
import mysql, { type RowDataPacket } from 'mysql2/promise';
import { env } from '$env/dynamic/private';
import { fixText } from '$lib/server/portal/transform';
import type { DoaUpdate } from '$lib/types/content';

const SCAN_INTERVAL = 5 * 60_000;
const WINDOW = 7 * 24 * 60 * 60_000;
const MAX_ITEMS = 30;

type Kind = DoaUpdate['kind'];
type Row = [hash: string, revision: string];
/** no → [sidik baris, revisi] */
type Snapshot = Record<string, Row>;
/**
 * Satu catatan per dokumen (perubahan berikutnya menimpa, bukan menambah baris).
 * `base` = kondisi dokumen sebelum perubahan pertama dalam jendela 7 hari (tidak ada =
 * dokumen baru). Label dihitung dari base → kondisi sekarang, jadi salah update yang
 * dikembalikan persis ke base hilang dari daftar.
 */
type Change = { no: number; kind: Kind; at: string; fromRev?: string; base?: Row };
type State = { version: 1; baselineAt: string; rows: Snapshot; changes: Change[] };

const host = env.DOA_DB_HOST || env.IMS_DB_HOST;
const pool = host
	? mysql.createPool({
			host,
			port: Number(env.DOA_DB_PORT || env.IMS_DB_PORT || 3307),
			user: env.DOA_DB_USER || env.IMS_DB_USER,
			password: env.DOA_DB_PASSWORD || env.IMS_DB_PASSWORD,
			database: env.DOA_DB_NAME || 'standard',
			charset: 'utf8mb4',
			connectionLimit: 2,
			waitForConnections: true,
			connectTimeout: 5000
		})
	: null;

const statePath = () => path.join(path.resolve(env.DATA_DIR || 'data'), 'doa-watch.json');

function readState(): State | null {
	try {
		const state = JSON.parse(fs.readFileSync(statePath(), 'utf8'));
		return state?.version === 1 ? state : null;
	} catch {
		return null;
	}
}

/** Tulis lewat berkas sementara + rename supaya tidak pernah setengah tertulis. */
function writeState(state: State) {
	const file = statePath();
	fs.mkdirSync(path.dirname(file), { recursive: true });
	fs.writeFileSync(`${file}.tmp`, JSON.stringify(state));
	fs.renameSync(`${file}.tmp`, file);
}

/** Kode jenis di tabel standard → label (kategori di web DOA). */
function typeLabel(code: string): string {
	const t = code.trim();
	const k = t.toLowerCase();
	if (k.startsWith('pro')) return 'Procedure';
	if (k.startsWith('wi')) return 'Work Instruction';
	if (k.startsWith('man')) return 'Manual';
	if (k.startsWith('cer')) return 'Certificate';
	if (k.startsWith('doc')) return 'Document';
	if (k.startsWith('form') || k === 'standard') return 'Form';
	if (k === 'cmd') return 'Command Media';
	if (k.startsWith('qp')) return 'Quality Plan';
	if (k === 'wa') return 'Working Arrangement';
	if (k === 'awo' || k === 'cve') return 'Personnel Assignment';
	if (/^41/.test(k)) return 'Engineering Standard';
	return t ? t.toUpperCase() : 'Document';
}

const clean = (v: unknown) => fixText(String(v ?? '')).trim();

/** Daftar terakhir (sudah lengkap dengan judul) — dibaca layout tanpa query DB. */
let latest: DoaUpdate[] = [];
let scanning: Promise<void> | null = null;
let scannedOnce = false;

/** Perubahan dokumen DOA dalam 7 hari terakhir, terbaru dulu. */
export function getDoaUpdates(): DoaUpdate[] {
	// Belum pernah memindai (mis. modul baru dimuat ulang) → mulai di latar.
	if (!scannedOnce) void scanDoa();
	const cutoff = Date.now() - WINDOW;
	return latest.filter((u) => Date.parse(u.at) >= cutoff);
}

/** Pindai sekali (pemindaian yang sedang berjalan dipakai bersama). */
export function scanDoa(): Promise<void> {
	if (!pool) return Promise.resolve();
	scanning ??= runScan()
		.then(() => {
			scannedOnce = true;
		})
		.catch((err) => console.error('[doa-watch] gagal memindai database DOA:', err))
		.finally(() => {
			scanning = null;
		});
	return scanning;
}

async function runScan() {
	if (!pool) return;
	const [rows] = await pool.query<RowDataPacket[]>(
		`SELECT no, IFNULL(revision, '') AS revision, IFNULL(remark, '') AS remark,
		        MD5(CONCAT_WS('|', type, number, revision, title, nmpath, pdf, remark)) AS h
		 FROM standard`
	);
	const now = new Date();
	const nowIso = now.toISOString();
	const cutoff = now.getTime() - WINDOW;

	const current: Snapshot = {};
	const deleted = new Set<number>();
	for (const r of rows) {
		current[r.no] = [String(r.h), String(r.revision).trim()];
		if (String(r.remark).trim().toUpperCase() === 'D') deleted.add(Number(r.no));
	}

	const prev = readState();
	if (!prev) {
		writeState({ version: 1, baselineAt: nowIso, rows: current, changes: [] });
		latest = [];
		console.info(`[doa-watch] kondisi awal dicatat (${rows.length} dokumen)`);
		return;
	}

	const kept = prev.changes.filter((c) => Date.parse(c.at) >= cutoff);
	let dirty = kept.length !== prev.changes.length;
	const changes = new Map(kept.map((c) => [c.no, c]));
	let found = 0;
	let reverted = 0;

	for (const [key, [hash, rev]] of Object.entries(current)) {
		const old = prev.rows[key];
		if (old?.[0] === hash) continue;
		dirty = true;
		const no = Number(key);
		if (deleted.has(no)) {
			changes.delete(no); // dihapus admin → tidak ditampilkan
			continue;
		}
		const base = baseOf(changes.get(no), old);
		if (base && base[0] === hash) {
			// Dikembalikan persis seperti sebelum perubahan pertama → tidak ada yang berubah.
			if (changes.delete(no)) reverted++;
			continue;
		}
		let change: Change;
		if (!base) change = { no, kind: 'new', at: nowIso };
		else if (base[1] !== rev) change = { no, kind: 'revised', at: nowIso, fromRev: base[1], base };
		else change = { no, kind: 'updated', at: nowIso, base };
		changes.set(no, change);
		found++;
	}
	// Baris yang hilang dari tabel (dihapus permanen) → buang dari snapshot & notifikasi.
	for (const key of Object.keys(prev.rows)) {
		if (key in current) continue;
		dirty = true;
		changes.delete(Number(key));
	}

	const list = [...changes.values()].sort((a, b) => b.at.localeCompare(a.at));
	if (dirty) writeState({ version: 1, baselineAt: prev.baselineAt, rows: current, changes: list });
	if (found) console.info(`[doa-watch] ${found} perubahan dokumen DOA terdeteksi`);
	if (reverted)
		console.info(`[doa-watch] ${reverted} dokumen kembali seperti semula — dihapus dari daftar`);
	latest = await withDetails(list.slice(0, MAX_ITEMS));
}

/**
 * Kondisi dokumen sebelum perubahan pertama dalam jendela: dari catatan yang sudah ada,
 * atau snapshot sebelumnya bila ini perubahan pertama. undefined = dokumen baru.
 * Catatan lama (sebelum ada `base`) diturunkan dari kind/fromRev — sidiknya tidak
 * diketahui, jadi hanya revert pada catatan baru yang bisa dikenali.
 */
function baseOf(earlier: Change | undefined, old: Row | undefined): Row | undefined {
	if (!earlier) return old;
	if (earlier.base) return earlier.base;
	if (earlier.kind === 'new') return undefined;
	return ['', earlier.fromRev ?? old?.[1] ?? ''];
}

/** Lengkapi perubahan dengan jenis, nomor, revisi & judul terkini. */
async function withDetails(changes: Change[]): Promise<DoaUpdate[]> {
	if (!pool || !changes.length) return [];
	const [rows] = await pool.query<RowDataPacket[]>(
		'SELECT no, type, number, revision, title FROM standard WHERE no IN (?)',
		[changes.map((c) => c.no)]
	);
	const byNo = new Map(rows.map((r) => [Number(r.no), r]));
	return changes.flatMap((c) => {
		const r = byNo.get(c.no);
		if (!r) return [];
		const revision = clean(r.revision);
		const fromRevision =
			c.kind === 'revised' && c.fromRev && c.fromRev !== revision ? c.fromRev : '';
		return [
			{
				id: c.no,
				kind: c.kind,
				at: c.at,
				type: typeLabel(String(r.type ?? '')),
				number: clean(r.number),
				revision,
				fromRevision,
				title: clean(r.title)
			}
		];
	});
}

/**
 * Mulai pemantauan di latar (dipanggil sekali saat server start — hooks.server.ts).
 * Timer lama dibersihkan dulu (HMR di dev) dan tidak menahan proses tetap hidup.
 */
export function startDoaWatch() {
	if (!pool) {
		console.info('[doa-watch] nonaktif: DOA_DB_HOST / IMS_DB_HOST belum di-set');
		return;
	}
	const g = globalThis as { __doaWatchTimer?: ReturnType<typeof setInterval> };
	if (g.__doaWatchTimer) clearInterval(g.__doaWatchTimer);
	g.__doaWatchTimer = setInterval(() => void scanDoa(), SCAN_INTERVAL);
	g.__doaWatchTimer.unref?.();
	void scanDoa();
}
