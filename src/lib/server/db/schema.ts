/**
 * Skema Drizzle untuk tabel-tabel portal di database `dittek`.
 *
 * Ini hanya memetakan kolom yang benar-benar dipakai homepage — bukan seluruh
 * 99 tabel. Nama kolom lama (C_/N_/D_/I_) dipetakan ke properti yang lebih enak
 * dibaca di sisi TypeScript. Tanggal dibaca sebagai string ('YYYY-MM-DD') supaya
 * gampang diformat tanpa urusan timezone.
 */
import { mysqlTable, int, varchar, date, datetime, text } from 'drizzle-orm/mysql-core';

export const berita = mysqlTable('tmberita', {
	id: int('C_BERITA').primaryKey().autoincrement(),
	date: date('D_BERITA', { mode: 'string' }),
	judul: varchar('N_JUDUL_BERITA', { length: 100 }),
	intro: text('N_INTRO_BERITA'),
	teks: text('N_TEXT_BERITA'),
	status: int('C_STATUS_BERITA')
});

export const artikel = mysqlTable('tmartikel', {
	id: int('C_ARTIKEL').primaryKey().autoincrement(),
	date: date('D_ENTRY_ARTIKEL', { mode: 'string' }),
	judul: varchar('N_JUDUL_ARTIKEL', { length: 100 }),
	deskripsi: text('N_DESKRIPSI_ARTIKEL'),
	file: varchar('N_FILE_ARTIKEL', { length: 100 })
});

export const agenda = mysqlTable('tmagenda', {
	id: int('C_AGENDA').primaryKey().autoincrement(),
	date: date('D_ENTRY_AGENDA', { mode: 'string' }),
	judul: varchar('N_JUDUL_AGENDA', { length: 100 }),
	deskripsi: text('N_DESKRIPSI_AGENDA'),
	file: varchar('N_FILE_AGENDA', { length: 100 })
});

export const download = mysqlTable('tmdownload', {
	id: int('C_DOWNLOAD').primaryKey().autoincrement(),
	judul: varchar('N_TITLE_DOWNLOAD', { length: 200 }),
	file: varchar('N_FILE_DOWNLOAD', { length: 100 }),
	entryBy: varchar('I_ENTRY', { length: 50 }),
	entryAt: datetime('D_ENTRY', { mode: 'string' })
});

export const info = mysqlTable('tminfo', {
	id: int('C_INFO').primaryKey().autoincrement(),
	date: date('D_INFO', { mode: 'string' }),
	judul: varchar('N_JUDUL_INFO', { length: 100 }),
	teks: text('N_TEXT_INFO'),
	entryAt: datetime('D_ENTRY', { mode: 'string' }),
	entryBy: varchar('I_ENTRY', { length: 100 })
});

export const emp = mysqlTable('tmemp', {
	nik: varchar('C_NIK', { length: 6 }).primaryKey(),
	name: varchar('I_EMP', { length: 100 }),
	org: varchar('C_ORG', { length: 8 }),
	status: varchar('C_STATUS', { length: 10 }),
	birth: date('D_BIRTH', { mode: 'string' }),
	tlp: varchar('N_TLP', { length: 100 }),
	email: varchar('N_EMAIL', { length: 200 }),
	goldar: varchar('C_GOLDAR', { length: 10 })
});

// ── Tabel untuk halaman-halaman Profil / Pojok Media ──────────────────────────

export const mainArticle = mysqlTable('tmmainarticle', {
	id: int('c_mainarticle').primaryKey().autoincrement(),
	date: date('d_mainarticle', { mode: 'string' }),
	judul: varchar('n_judul_mainarticle', { length: 100 }),
	image: varchar('n_image_mainarticle', { length: 100 })
});

export const mainArticleDet = mysqlTable('tmmainarticledet', {
	id: int('c_mainarticle_detail').primaryKey().autoincrement(),
	parentId: int('c_mainarticle'),
	date: date('d_mainarticle', { mode: 'string' }),
	judul: varchar('n_judul_mainarticle', { length: 100 }),
	teks: text('n_text_mainarticle')
});

export const org = mysqlTable('tmorg', {
	id: int('C_ORG').primaryKey().autoincrement(),
	title: varchar('N_TITLE_ORG', { length: 200 }),
	type: int('C_TYPE_ORG'),
	nik: varchar('C_NIK_ORG', { length: 200 }),
	foto: varchar('N_FOTO_ORG', { length: 100 })
});

export const orgDet = mysqlTable('tmorgdet', {
	orgId: int('C_ORG'),
	id: int('C_ORG_DET').primaryKey().autoincrement(),
	title: varchar('N_TITLE_ORG_DET', { length: 200 }),
	nik: int('C_NIK_ORG_DET'),
	foto: varchar('N_FOTO_ORG_DET', { length: 100 })
});

export const capability = mysqlTable('tmcapability', {
	id: int('C_CAPABILITY').primaryKey().autoincrement(),
	date: date('D_ENTRY_CAPABILITY', { mode: 'string' }),
	judul: varchar('N_JUDUL_CAPABILITY', { length: 100 }),
	deskripsi: text('N_DESKRIPSI_CAPABILITY')
});

export const jdq = mysqlTable('tmjdq', {
	id: int('C_JDQ').primaryKey().autoincrement(),
	judul: varchar('N_JUDUL_JDQ', { length: 200 }),
	teks: varchar('N_TEKS_JDQ', { length: 100 }),
	date: datetime('D_JDQ', { mode: 'string' })
});

export const jdqDet = mysqlTable('tmjdqdet', {
	id: int('C_JDQ_DETAIL').primaryKey().autoincrement(),
	jdqId: int('C_JDQ'),
	judul: varchar('N_JUDUL_JDQ', { length: 100 }),
	file: varchar('N_FILE_JDQ', { length: 100 })
});

export const kerTek = mysqlTable('tmker_tek', {
	id: int('C_KER_TEK').primaryKey().autoincrement(),
	date: date('D_ENTRY_KER_TEK', { mode: 'string' }),
	judul: varchar('N_JUDUL_KER_TEK', { length: 100 }),
	deskripsi: text('N_DESKRIPSI_KER_TEK')
});

export const ground = mysqlTable('tmground', {
	id: int('C_GROUND').primaryKey().autoincrement(),
	judul: varchar('N_JUDUL_GROUND', { length: 100 }),
	teks: text('N_TEXT_GROUND')
});

export const flight = mysqlTable('tmflight', {
	id: int('C_FLIGHT').primaryKey().autoincrement(),
	judul: varchar('N_JUDUL_FLIGHT', { length: 100 }),
	teks: text('N_TEXT_FLIGHT')
});

// ── Command Media / Project / OC / HKI ────────────────────────────────────────

export const cmdMedia = mysqlTable('tmcmdmedia', {
	id: int('C_CMDMEDIA').primaryKey().autoincrement(),
	date: date('D_ENTRY_CMDMEDIA', { mode: 'string' }),
	judul: varchar('N_JUDUL_CMDMEDIA', { length: 100 }),
	deskripsi: text('N_DESKRIPSI_CMDMEDIA')
});

export const project = mysqlTable('tmproject', {
	id: int('C_PROJECT').primaryKey().autoincrement(),
	date: date('D_ENTRY_PROJECT', { mode: 'string' }),
	nama: varchar('N_NAMA_PROJECT', { length: 100 }),
	judul: varchar('N_JUDUL_PROJECT', { length: 200 }),
	deskripsi: text('N_DESKRIPSI_PROJECT')
});

export const oc = mysqlTable('tmoc', {
	id: int('c_oc').primaryKey().autoincrement(),
	title: varchar('n_title', { length: 200 }),
	desc: text('n_desc'),
	file: varchar('n_file', { length: 200 }),
	status: int('c_status')
});

export const certificate = mysqlTable('tmcertificate', {
	id: int('c_certificate').primaryKey().autoincrement(),
	title: varchar('n_title', { length: 200 }),
	desc: text('n_desc'),
	file: varchar('n_file', { length: 200 }),
	status: int('c_status')
});

export const certificateOc = mysqlTable('tmcertificateoc', {
	id: int('c_certificateoc').primaryKey().autoincrement(),
	title: varchar('n_title', { length: 200 }),
	desc: text('n_desc'),
	file: varchar('n_file', { length: 200 }),
	status: int('c_status')
});

export const hki = mysqlTable('tmhki', {
	id: int('C_HKI').primaryKey().autoincrement(),
	judul: varchar('N_JUDUL_HKI', { length: 100 }),
	teks: text('N_TEXT_HKI')
});

export const orgHki = mysqlTable('tmorghki', {
	id: int('C_ORGHKI').primaryKey().autoincrement(),
	judul: varchar('N_JUDUL_ORGHKI', { length: 100 }),
	teks: text('N_TEXT_ORGHKI')
});

export const pengertianHki = mysqlTable('tmpengertianhki', {
	id: int('C_PENGERTIANHKI').primaryKey().autoincrement(),
	judul: varchar('N_JUDUL_PENGERTIANHKI', { length: 100 }),
	teks: text('N_TEXT_PENGERTIANHKI')
});

// ── Online Publication (10 kategori subjek, struktur identik) ──────────────────

export const aeronautics = mysqlTable('tmaeronautics', {
	id: int('C_AERONAUTICS').primaryKey().autoincrement(),
	title: varchar('N_TITLE_AERONAUTICS', { length: 255 }),
	file: varchar('N_FILE_AERONAUTICS', { length: 255 })
});
export const astronautics = mysqlTable('tmastronautics', {
	id: int('C_ASTRONAUTICS').primaryKey().autoincrement(),
	title: varchar('N_TITLE_ASTRONAUTICS', { length: 255 }),
	file: varchar('N_FILE_ASTRONAUTICS', { length: 255 })
});
export const chemats = mysqlTable('tmchemats', {
	id: int('C_CHEMATS').primaryKey().autoincrement(),
	title: varchar('N_TITLE_CHEMATS', { length: 255 }),
	file: varchar('N_FILE_CHEMATS', { length: 255 })
});
export const engineerings = mysqlTable('tmengineerings', {
	id: int('C_ENGINEERINGS').primaryKey().autoincrement(),
	title: varchar('N_TITLE_ENGINEERINGS', { length: 255 }),
	file: varchar('N_FILE_ENGINEERINGS', { length: 255 })
});
export const busmgmnts = mysqlTable('tmbusmgmnts', {
	id: int('C_BUSMGMNTS').primaryKey().autoincrement(),
	title: varchar('N_TITLE_BUSMGMNTS', { length: 255 }),
	file: varchar('N_FILE_BUSMGMNTS', { length: 255 })
});
export const mathcomps = mysqlTable('tmmathcomps', {
	id: int('C_MATHCOMPS').primaryKey().autoincrement(),
	title: varchar('N_TITLE_MATHCOMPS', { length: 255 }),
	file: varchar('N_FILE_MATHCOMPS', { length: 255 })
});
export const physics = mysqlTable('tmphysics', {
	id: int('C_PHYSICS').primaryKey().autoincrement(),
	title: varchar('N_TITLE_PHYSICS', { length: 255 }),
	file: varchar('N_FILE_PHYSICS', { length: 255 })
});
export const spacescns = mysqlTable('tmspacescns', {
	id: int('C_SPACESCNS').primaryKey().autoincrement(),
	title: varchar('N_TITLE_SPACESCNS', { length: 255 }),
	file: varchar('N_FILE_SPACESCNS', { length: 255 })
});
export const generals = mysqlTable('tmgenerals', {
	id: int('C_GENERALS').primaryKey().autoincrement(),
	title: varchar('N_TITLE_GENERALS', { length: 255 }),
	file: varchar('N_FILE_GENERALS', { length: 255 })
});
export const regulationsPub = mysqlTable('tmregulations', {
	id: int('C_REGULATIONS').primaryKey().autoincrement(),
	title: varchar('N_TITLE_REGULATIONS', { length: 255 }),
	file: varchar('N_FILE_REGULATIONS', { length: 255 })
});

// ── Our Library (katalog) ─────────────────────────────────────────────────────

export const koltextbook = mysqlTable('tmkoltextbook', {
	id: int('C_koltextbook').primaryKey().autoincrement(),
	title: varchar('N_title', { length: 255 }),
	author: varchar('N_author', { length: 255 }),
	cat: varchar('N_Cat', { length: 100 }),
	lokasi: varchar('N_lokasi', { length: 100 })
});
export const dokavionik = mysqlTable('tmdokavionik', {
	id: int('C_DOKAVIONIK').primaryKey().autoincrement(),
	judul: varchar('N_JUDUL', { length: 255 }),
	racno: varchar('N_RACNO', { length: 100 }),
	lokasi: varchar('N_LOKASI', { length: 100 }),
	thterbit: varchar('N_THTERBIT', { length: 20 }),
	program: varchar('N_PROGRAM', { length: 100 })
});
export const docReqStdInd = mysqlTable('tmdocreqstdind', {
	id: int('C_docreqstdind').primaryKey().autoincrement(),
	tahun: varchar('N_tahun', { length: 10 }),
	nota: varchar('N_nota', { length: 100 }),
	program: varchar('N_program', { length: 100 }),
	nodoc: varchar('N_nodoc', { length: 100 }),
	pages: varchar('N_pages', { length: 20 })
});
export const jurnalTelDt = mysqlTable('tmjurnalteldt', {
	id: int('C_JURNALTELDT').primaryKey().autoincrement(),
	judul: varchar('N_JUDUL_JURNALTELDT', { length: 255 }),
	lokasi: varchar('N_LOKASI_JURNALTELDT', { length: 100 }),
	penerbit: varchar('N_PENERBIT_JURNALTELDT', { length: 255 })
});

// ── Link & Regulation ─────────────────────────────────────────────────────────

export const link = mysqlTable('tmlink', {
	id: int('C_LINK').primaryKey().autoincrement(),
	category: int('C_CTGR_LINK'),
	desc: varchar('N_DESC_LINK', { length: 200 }),
	url: varchar('N_URL_LINK', { length: 255 })
});

export const rsiPmrtH = mysqlTable('tmrsipmrthri', {
	id: int('C_rsipmrthri').primaryKey().autoincrement(),
	docno: varchar('N_docno', { length: 100 }),
	judul: text('N_judul'),
	revdate: varchar('N_revdate', { length: 50 }),
	remarks: text('N_remarks')
});

export const rsiDepHub = mysqlTable('tmrsidephubri', {
	id: int('C_rsidephubri').primaryKey().autoincrement(),
	docno: varchar('N_docno', { length: 100 }),
	judul: text('N_judul'),
	revdate: varchar('n_revdate', { length: 50 }),
	lokasi: varchar('N_lokasi', { length: 100 }),
	remarks: text('N_remarks')
});

export const rsiDepHan = mysqlTable('tmrsidephanri', {
	id: int('C_rsidephanri').primaryKey().autoincrement(),
	docno: varchar('N_docno', { length: 100 }),
	judul: text('N_judul'),
	revdate: varchar('N_revdate', { length: 50 }),
	remarks: text('N_remarks')
});

// ── Jadwal Kereta Api & Penerbangan ───────────────────────────────────────────

export const jadwalKa = mysqlTable('tmjadwalka', {
	id: int('C_JADWALKA').primaryKey().autoincrement(),
	dari: varchar('C_DARI', { length: 10 }),
	tujuan: varchar('C_TUJUAN', { length: 10 }),
	ka: varchar('N_KA', { length: 100 }),
	berangkat: varchar('N_BERANGKAT', { length: 20 }),
	tiba: varchar('N_TIBA', { length: 20 }),
	ket: varchar('N_KET', { length: 200 })
});

export const jadwalPn = mysqlTable('tmjadwalpn', {
	id: int('C_JADWALPN').primaryKey().autoincrement(),
	dari: varchar('C_DARI', { length: 10 }),
	tujuan: varchar('C_TUJUAN', { length: 10 }),
	pn: varchar('N_PN', { length: 100 }),
	berangkat: varchar('N_BERANGKAT', { length: 20 }),
	ket: varchar('N_KET', { length: 200 })
});

// ── Telepon Penting & Sekilas Dittek ──────────────────────────────────────────

export const telp = mysqlTable('tmtelp', {
	id: int('C_TELP').primaryKey().autoincrement(),
	title: varchar('N_TITLE_TELP', { length: 200 }),
	no: varchar('N_TELP', { length: 50 }),
	category: int('C_CTGR_TELP')
});

export const sekilas = mysqlTable('tmsekilas_ditt', {
	id: int('C_SEKILAS_DITT').primaryKey().autoincrement(),
	date: date('D_ENTRY_SEKILAS_DITT', { mode: 'string' }),
	caption: text('N_DESKRIPSI_SEKILAS_DITT'),
	file: varchar('N_FILE_SEKILAS_DITT', { length: 100 })
});
