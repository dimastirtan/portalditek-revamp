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
