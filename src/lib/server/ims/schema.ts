/**
 * Skema Drizzle untuk database IMS (`ptdi_project`). Hanya kolom yang dipakai
 * portal — tabel `admins` sengaja tidak dipetakan, dan kolom `pic` /
 * `responsible` (nama orang) tidak dibaca.
 *
 * Kolom decimal dibaca Drizzle sebagai string; ubah ke number di queries.ts.
 */
import { mysqlTable, int, tinyint, varchar, text, decimal, mysqlEnum } from 'drizzle-orm/mysql-core';

export const programs = mysqlTable('programs', {
	id: int('id').primaryKey().autoincrement(),
	name: varchar('program_name', { length: 100 }).notNull(),
	image: varchar('image', {length: 255}).notNull(),
	description: text('description')
});

export const projects = mysqlTable('projects', {
	id: int('id').primaryKey().autoincrement(),
	code: varchar('project_code', { length: 50 }),
	name: varchar('project_name', { length: 255 }).notNull(),
	programId: int('program_id').notNull(),
	customer: varchar('customer', { length: 150 }),
	category: varchar('category', { length: 100 }),
	classChange: varchar('class_change', { length: 100 }),
	stage: varchar('stage', { length: 150 }),
	progress: decimal('progress', { precision: 5, scale: 2 }),
	status: varchar('status', { length: 100 }),
	problem: mysqlEnum('problem', ['YES', 'NO'])
});

export const projectStages = mysqlTable('project_stages', {
	id: int('id').primaryKey().autoincrement(),
	projectId: int('project_id').notNull(),
	step: tinyint('step_number').notNull(),
	name: varchar('stage_name', { length: 150 }).notNull(),
	progress: decimal('progress', { precision: 5, scale: 2 })
});

export const projectDocuments = mysqlTable('project_documents', {
	id: int('id').primaryKey().autoincrement(),
	projectId: int('project_id').notNull(),
	stageId: int('stage_id'),
	remark: varchar('remark', { length: 100 })
});
