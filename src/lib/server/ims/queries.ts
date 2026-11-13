/**
 * Query IMS untuk halaman Program R&D. Progres & status dibaca apa adanya dari
 * kolom IMS (projects.progress / status, project_stages.progress) — portal
 * tidak menghitung ulang.
 *
 * Hasil di-cache 15 menit lewat $lib/server/cache supaya IMS tidak dibebani
 * tiap request; bila IMS gagal, data terakhir tetap dipakai.
 */
import { asc, eq, inArray, sql } from 'drizzle-orm';
import { imsDb } from '.';
import { programs, projects, projectStages, projectDocuments } from './schema';
import { imsImageUrl } from '$lib/config/ims';
import { cached } from '$lib/server/cache';
import type { ImsProgram, ImsProgramDetail } from '$lib/types/content';

const TTL = 15 * 60_000;

/** false bila IMS_DB_HOST belum di-set — bagian IMS di portal disembunyikan. */
export const imsConfigured = imsDb !== null;

const num = (v: unknown) => {
	const n = Number(v);
	return Number.isFinite(n) ? n : 0;
};

/** IMS menulis '-' untuk kolom yang belum diisi; anggap kosong. */
const str = (v: string | null | undefined) => {
	const s = (v ?? '').trim();
	return s === '-' ? '' : s;
};

const slugify = (s: string) =>
	s
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

/** Semua program + ringkasan proyeknya, urut seperti di beranda IMS. */
export function getImsPrograms(): Promise<ImsProgram[]> {
	const db = imsDb;
	if (!db) return Promise.resolve([]);
	return cached('ims:programs', async () => {
		const rows = await db
			.select({
				id: programs.id,
				name: programs.name,
				image: programs.image,
				description: programs.description,
				total: sql<number>`count(${projects.id})`,
				onProgress: sql<number>`coalesce(sum(${projects.status} like 'On Progress%'), 0)`,
				completed: sql<number>`coalesce(sum(${projects.status} like '%Complete%'), 0)`,
				problem: sql<number>`coalesce(sum(${projects.problem} = 'YES'), 0)`,
				avgProgress: sql<number>`coalesce(avg(${projects.progress}), 0)`
			})
			.from(programs)
			.leftJoin(projects, eq(projects.programId, programs.id))
			.groupBy(programs.id)
			.orderBy(asc(programs.id));
		return rows.map((r) => ({
			id: r.id,
			slug: slugify(r.name),
			name: r.name.trim(),
			description: str(r.description),
			image: imsImageUrl(r.image),
			total: num(r.total),
			onProgress: num(r.onProgress),
			completed: num(r.completed),
			problem: num(r.problem),
			avgProgress: num(r.avgProgress)
		}));
	}, TTL);
}

/** Satu program + proyek + 6 tahap sertifikasinya. null bila slug tidak ada. */
export async function getImsProgram(slug: string): Promise<ImsProgramDetail | null> {
	const db = imsDb;
	if (!db) return null;
	const program = (await getImsPrograms()).find((p) => p.slug === slug);
	if (!program) return null;
	return cached(`ims:program:${program.id}`, async () => {
		const rows = await db
			.select()
			.from(projects)
			.where(eq(projects.programId, program.id))
			.orderBy(asc(projects.id));
		const ids = rows.map((r) => r.id);
		const [stageRows, docRows] = await Promise.all([
			ids.length
				? db
						.select()
						.from(projectStages)
						.where(inArray(projectStages.projectId, ids))
						.orderBy(asc(projectStages.step))
				: Promise.resolve([]),
			// Hanya jumlah dokumen per tahap; judul, nomor & penanggung jawab tetap di IMS.
			ids.length
				? db
						.select({
							stageId: projectDocuments.stageId,
							total: sql<number>`count(*)`,
							approved: sql<number>`coalesce(sum(${projectDocuments.remark} like 'Approved%'), 0)`
						})
						.from(projectDocuments)
						.where(inArray(projectDocuments.projectId, ids))
						.groupBy(projectDocuments.stageId)
				: Promise.resolve([])
		]);
		const docs = new Map(docRows.map((d) => [d.stageId, d]));
		return {
			...program,
			projects: rows.map((p) => ({
				id: p.id,
				code: str(p.code),
				name: p.name.trim(),
				customer: str(p.customer),
				category: str(p.category),
				classChange: str(p.classChange),
				stage: str(p.stage),
				progress: num(p.progress),
				status: str(p.status),
				problem: p.problem === 'YES',
				stages: stageRows
					.filter((s) => s.projectId === p.id)
					.map((s) => ({
						step: s.step,
						name: s.name.trim(),
						progress: num(s.progress),
						docsTotal: num(docs.get(s.id)?.total),
						docsApproved: num(docs.get(s.id)?.approved)
					}))
			}))
		};
	}, TTL);
}
