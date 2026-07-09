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
