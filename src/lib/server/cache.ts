/**
 * Cache memori per proses server untuk data yang jarang berubah (konten DB
 * portal lama & IMS). Halaman yang dibuka banyak orang tidak menembak DB tiap
 * request, dan portal tetap cepat walau DB sedang gangguan.
 *
 *  - Hasil disimpan selama TTL (default env CACHE_TTL_SECONDS, 300 detik).
 *  - Request bersamaan saat cache kosong berbagi satu query (tidak dobel).
 *  - Bila sumber gagal: data terakhir tetap dipakai, dan percobaan ulang ditahan
 *    RETRY_AFTER supaya request berikutnya tidak ikut menunggu timeout.
 *
 * Konten yang diubah admin di portal lama tampil paling lambat setelah TTL.
 * Dashboard admin mengosongkan cache setelah menyimpan lewat POST /api/cache
 * (clearCache), supaya perubahan langsung tampil.
 */
import { env } from '$env/dynamic/private';

// `||`: baris kosong `CACHE_TTL_SECONDS=` (salinan .env.example) jatuh ke default,
// bukan 0 yang diam-diam mematikan cache. Nilai "0" tetap boleh untuk mematikan.
const ttlSeconds = Number(env.CACHE_TTL_SECONDS || 300);
const DEFAULT_TTL = (Number.isFinite(ttlSeconds) && ttlSeconds >= 0 ? ttlSeconds : 300) * 1000;
const RETRY_AFTER = 60_000;

type Entry = { at: number; value?: unknown; failedAt?: number };
const store = new Map<string, Entry>();
const inflight = new Map<string, Promise<unknown>>();
/** Naik tiap clearCache(): query yang sudah berjalan sebelumnya tidak boleh menyimpan hasil lamanya. */
let generation = 0;

/** Kosongkan seluruh cache; request berikutnya membaca ulang sumber data. */
export function clearCache(): number {
	const entries = store.size;
	store.clear();
	inflight.clear();
	generation++;
	return entries;
}

export function cached<T>(key: string, load: () => Promise<T>, ttl = DEFAULT_TTL): Promise<T> {
	const hit = store.get(key);
	const now = Date.now();
	if (hit?.value !== undefined && now - hit.at < ttl) return Promise.resolve(hit.value as T);
	if (hit?.failedAt && now - hit.failedAt < RETRY_AFTER) {
		if (hit.value !== undefined) return Promise.resolve(hit.value as T);
		return Promise.reject(new Error(`Sumber data "${key}" tidak terjangkau, mencoba ulang...`));
	}

	const pending = inflight.get(key);
	if (pending) return pending as Promise<T>;

	const gen = generation;
	const promise = (async () => {
		try {
			const value = await load();
			if (gen === generation) store.set(key, { at: Date.now(), value });
			return value;
		} catch (err) {
			if (gen === generation) store.set(key, { ...hit, at: hit?.at ?? 0, failedAt: Date.now() });
			if (hit?.value !== undefined) {
				console.warn(`[cache] ${key}: sumber gagal`, err);
				return hit.value as T;
			}
			throw err;
		} finally {
			// Setelah clearCache, entri inflight bisa sudah milik request baru — jangan dihapus.
			if (gen === generation) inflight.delete(key);
		}
	})();
	inflight.set(key, promise);
	return promise;
}
