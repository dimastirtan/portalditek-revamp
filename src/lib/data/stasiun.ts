/**
 * Peta kode → nama stasiun/kota untuk halaman jadwal (kolom C_DARI/C_TUJUAN
 * di tmjadwalka / tmjadwalpn hanya menyimpan kode 2 huruf).
 *
 * Yang sudah pasti (dari screenshot portal lama) diisi di bawah. Sisanya masih
 * memakai kodenya sendiri sebagai fallback — silakan lengkapi seiring waktu
 * (daftar lengkap bisa dilihat dari dropdown "Pilih Stasiun/Kota" di portal lama).
 */
export const STASIUN_KA: Record<string, string> = {
	BD: 'Bandung',
	JG: 'Jakarta (Gambir)',
	SB: 'Surabaya (Ps. Turi)',
	YO: 'Yogyakarta',
	CM: 'Cimahi',
	CR: 'Cirebon'
	// BJ, BK, BP, BY, JB, KB, KD, KL, KO, KS, KT, MD, NG, SG, SP, SR, ST, TM, WT — lengkapi bila perlu
};

export const KOTA_PN: Record<string, string> = {
	BD: 'Bandung',
	HP: 'Halim Perdanakusuma',
	SU: 'Surabaya',
	BT: 'Batam',
	KL: 'Kuala Lumpur',
	YG: 'Yogyakarta',
	SM: 'Semarang'
	// BJ, KT, PB, SA, SB, SD, SI, SK — lengkapi bila perlu
};

/** Ambil nama dari peta; fallback ke kode kalau belum dipetakan. */
export function namaTempat(code: string | null | undefined, map: Record<string, string>): string {
	const c = (code ?? '').trim();
	return map[c] ?? c;
}
