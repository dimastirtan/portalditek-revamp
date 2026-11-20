/**
 * Query portal: baca tabel `dittek`, kembalikan objek yang sudah sesuai tipe di
 * $lib/types/content dan sudah dibersihkan (mojibake/HTML/tanggal).
 *
 * Catatan url: `url` unduhan dokumen (PDF/DOC) mengarah ke endpoint /unduh portal
 * ini (lihat downloadUrl). Kolom N_FILE_* kosong → tanpa `url`.
 */
import { desc, asc, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import {
	berita,
	artikel,
	agenda,
	download,
	info,
	emp,
	mainArticle,
	mainArticleDet,
	org,
	orgDet,
	capability,
	jdq,
	jdqDet,
	kerTek,
	ground,
	flight,
	cmdMedia,
	project,
	oc,
	certificate,
	certificateOc,
	hki,
	orgHki,
	pengertianHki,
	aeronautics,
	astronautics,
	chemats,
	engineerings,
	busmgmnts,
	mathcomps,
	physics,
	spacescns,
	generals,
	regulationsPub,
	koltextbook,
	dokavionik,
	docReqStdInd,
	jurnalTelDt,
	link,
	rsiPmrtH,
	rsiDepHub,
	rsiDepHan,
	jadwalKa,
	jadwalPn,
	telp,
	sekilas
} from '$lib/server/db/schema';
import { STASIUN_KA, KOTA_PN, namaTempat } from '$lib/data/stasiun';
import { fixText, stripHtml, isoDate, truncate, fileKind, cleanRichHtml, firstImage } from './transform';
import { downloadUrl, imgUrl, type DownloadCategory } from '$lib/utils';
import { hasGambar } from '$lib/server/gambar';
import { LEGACY } from '$lib/config/legacy';
import type {
	Article,
	AgendaEvent,
	Download,
	Headline,
	HeadlineCard,
	Announcement,
	BirthdayGroup,
	Person,
	PersonRow,
	BeritaEntry,
	OrgUnit,
	RichPage,
	JdqVolume,
	FacilityItem,
	DocLink,
	PubItem,
	PubCategory,
	LibraryCatalog,
	CatalogView,
	LinkItem,
	LinkGroup,
	NamedCatalog,
	OcSection,
	TeleponGroup,
	SekilasItem
} from '$lib/types/content';

const slugify = (s: string) =>
	fixText(s)
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-+|-+$/g, '');

/** `{ url }` unduhan bila kolom file terisi, `{}` bila kosong. */
const fileLink = (category: DownloadCategory, file: string | null) => {
	const f = (file ?? '').trim();
	return f ? { url: downloadUrl(category, f) } : {};
};

/**
 * Semua headline Berita Utama, terbaru dulu. Satu baris tmmainarticledet = satu
 * headline; tmmainarticle hanya jadi "berita induk" (judul & gambar cadangan).
 * Dipakai slideshow beranda, indeks /berita-utama, dan halaman detailnya —
 * di-cache sekali (± 27 baris), jadi detail tidak perlu query per id.
 */
export async function getHeadlines(): Promise<Headline[]> {
	const [stories, rows] = await Promise.all([
		db.select().from(mainArticle),
		db.select().from(mainArticleDet).orderBy(desc(mainArticleDet.date), desc(mainArticleDet.id))
	]);
	const storyOf = new Map(stories.map((s) => [s.id, s]));
	return rows
		.filter((r) => fixText(r.judul) && (r.teks ?? '').trim())
		.map((r) => {
			const story = r.parentId === null ? undefined : storyOf.get(r.parentId);
			const storyImage = (story?.image ?? '').trim();
			return {
				id: r.id,
				title: fixText(r.judul),
				date: isoDate(r.date) || isoDate(story?.date),
				excerpt: truncate(stripHtml(r.teks), 220),
				image: firstImage(r.teks) || (storyImage ? imgUrl(storyImage, 'artikel') : ''),
				url: `/berita-utama/${r.id}`,
				story: fixText(story?.judul),
				storyId: story?.id ?? null,
				html: cleanRichHtml(r.teks)
			};
		});
}

export async function getArticles(limit = 8): Promise<Article[]> {
	const rows = await db.select().from(artikel).orderBy(desc(artikel.date)).limit(limit);
	return rows
		.filter((r) => isoDate(r.date))
		.map((r) => ({
			id: `art-${r.id}`,
			title: fixText(r.judul),
			publishedAt: isoDate(r.date),
			...fileLink('article', r.file)
		}));
}

export async function getEvents(limit = 6): Promise<AgendaEvent[]> {
	const rows = await db.select().from(agenda).orderBy(desc(agenda.date)).limit(limit);
	return rows.map((r) => ({
		id: `evt-${r.id}`,
		title: fixText(r.judul),
		date: isoDate(r.date),
		// Berkas materi (bila ada) → unduh lewat handler portal lama.
		...fileLink('agenda', r.file)
	}));
}

export async function getDownloads(limit = 8): Promise<Download[]> {
	const rows = await db.select().from(download).orderBy(desc(download.entryAt)).limit(limit);
	return rows.map((r) => {
		const kind = fileKind(r.file);
		return {
			id: `dl-${r.id}`,
			title: fixText(r.judul),
			...fileLink('download', r.file),
			...(kind ? { kind } : {})
		};
	});
}

export async function getAnnouncements(limit = 5): Promise<Announcement[]> {
	const rows = await db.select().from(info).orderBy(desc(info.date)).limit(limit + 3);
	const cleaned = rows
		.map((r) => ({ r, title: fixText(r.judul) }))
		// 'Quotes of The Week' masuk fitur kutipan mingguan, bukan pengumuman.
		.filter(({ title }) => !title.toLowerCase().startsWith('quote'))
		.filter(({ r }) => isoDate(r.date))
		.slice(0, limit);
	return cleaned.map(({ r, title }, i) => ({
		id: `anc-${r.id}`,
		title,
		body: truncate(stripHtml(r.teks), 400),
		date: isoDate(r.date),
		active: i === 0
	}));
}

/**
 * Ulang tahun untuk hari ini + 2 hari berikutnya (mengikuti tampilan portal lama).
 * Hanya nama, NIK, dan unit yang dikirim ke client — tahun lahir tidak diekspos.
 * Perhitungan hari memakai zona Asia/Jakarta agar tidak meleset saat tengah malam.
 */
export async function getBirthdays(): Promise<BirthdayGroup[]> {
	const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const jakarta = (offset: number) => {
		const base = new Date(Date.now() + offset * 86_400_000);
		const parts = new Intl.DateTimeFormat('en-CA', {
			timeZone: 'Asia/Jakarta',
			year: 'numeric',
			month: '2-digit',
			day: '2-digit'
		}).formatToParts(base);
		const get = (t: string) => parts.find((p) => p.type === t)!.value;
		const iso = `${get('year')}-${get('month')}-${get('day')}`;
		// Baca hari dari tanggal kalender itu sendiri (UTC midnight → getUTCDay cocok).
		// Jangan pakai offset +07:00 lalu getUTCDay(): UTC 7 jam di belakang → nama hari meleset 1.
		const d = new Date(`${iso}T00:00:00Z`);
		return { iso, mmdd: `${get('month')}-${get('day')}`, dow: d.getUTCDay() };
	};

	const groups: BirthdayGroup[] = [];
	for (let offset = 0; offset < 3; offset++) {
		const { iso, mmdd, dow } = jakarta(offset);
		const rows = await db
			.select({ nik: emp.nik, name: emp.name, org: emp.org })
			.from(emp)
			.where(sql`DATE_FORMAT(${emp.birth}, '%m-%d') = ${mmdd}`);
		const people: Person[] = rows.map((r) => ({
			nik: (r.nik ?? '').trim(),
			name: fixText(r.name),
			org: (r.org ?? '').trim()
		}));
		const [dd, mm, yyyy] = [iso.slice(8, 10), iso.slice(5, 7), iso.slice(0, 4)];
		const prefix = offset === 0 ? 'Today, ' : '';
		groups.push({
			label: `${prefix}${dayNames[dow]}, ${dd}-${mm}-${yyyy}`,
			date: iso,
			today: offset === 0,
			people
		});
	}
	return groups;
}

// ── Halaman Pojok Media / Profil ──────────────────────────────────────────────

/** Index Berita (semua, terbaru dulu) dengan teks lengkap yang sudah dibersihkan. */
export async function getBeritaIndex(): Promise<BeritaEntry[]> {
	const rows = await db.select().from(berita).orderBy(desc(berita.date));
	return rows
		.filter((r) => isoDate(r.date))
		.map((r) => ({
			id: `berita-${r.id}`,
			title: fixText(r.judul),
			date: isoDate(r.date),
			html: cleanRichHtml(r.teks || r.intro)
		}));
}

/** Headline tanpa HTML-nya — untuk daftar & slideshow (isi berita tidak ikut dikirim). */
export const headlineCard = ({ id, title, date, excerpt, image, url, story, storyId }: Headline): HeadlineCard => ({
	id,
	title,
	date,
	excerpt,
	image,
	url,
	story,
	storyId
});

/**
 * Struktur organisasi: unit + departemen, nama pejabat di-resolve dari tmemp.
 * C_TYPE_ORG 0 = pimpinan direktorat (puncak tree), 1 = pusat/divisi di bawahnya.
 * Departemen yang unitnya sudah tidak ada (data lama 2010) otomatis tidak ikut.
 */
/**
 * URL foto pejabat untuk bagan organisasi. Foto asli ±2500×3400 px (2 MB) padahal
 * tampil sebagai lingkaran 32–56 px — puluhan foto sekaligus membuat browser hang.
 * Jadi pakai thumbnail di static/gambar/org-thumb (dibuat scripts/org-thumbs.py)
 * bila ada, selain itu foto asli. '' bila kosong, placeholder, atau berkasnya tidak ada.
 */
function orgPhoto(file: string | null | undefined): string {
	const f = (file ?? '').trim();
	if (!f || f.toLowerCase() === 'blank.jpg') return '';
	const thumb = hasGambar(`org-thumb/${f}`);
	if (thumb) return imgUrl(f, 'org-thumb');
	if (thumb === null) return imgUrl(f, 'org'); // tidak bisa dicek → perilaku lama
	return hasGambar(`org/${f}`) ? imgUrl(f, 'org') : '';
}

export async function getOrgStructure(): Promise<OrgUnit[]> {
	const [units, dets, people] = await Promise.all([
		db.select().from(org).orderBy(asc(org.type), asc(org.id)),
		db.select().from(orgDet).orderBy(asc(orgDet.id)),
		db.select({ nik: emp.nik, name: emp.name }).from(emp)
	]);
	const nameOf = new Map(people.map((p) => [(p.nik ?? '').trim(), fixText(p.name)]));
	return units.map((u) => ({
		id: `org-${u.id}`,
		level: u.type === 0 ? 0 : 1,
		title: fixText(u.title),
		head: nameOf.get((u.nik ?? '').trim()) ?? '',
		foto: orgPhoto(u.foto),
		departments: dets
			.filter((d) => d.orgId === u.id)
			.map((d) => ({
				id: `orgdet-${d.id}`,
				title: fixText(d.title),
				head: nameOf.get(String(d.nik ?? '')) ?? '',
				foto: orgPhoto(d.foto)
			}))
			// Baris tanpa jabatan & tanpa pejabat = sisa data kosong.
			.filter((d) => d.title || d.head)
	}));
}

/** Daftar Personil (semua, difilter/paginate di client). */
export async function getPersonil(): Promise<PersonRow[]> {
	const rows = await db
		.select({
			nik: emp.nik,
			name: emp.name,
			org: emp.org,
			tlp: emp.tlp,
			email: emp.email,
			goldar: emp.goldar
		})
		.from(emp)
		.orderBy(asc(emp.name));
	return rows.map((r) => ({
		nik: (r.nik ?? '').trim(),
		name: fixText(r.name),
		org: (r.org ?? '').trim(),
		tlp: (r.tlp ?? '').trim(),
		email: (r.email ?? '').trim(),
		goldar: (r.goldar ?? '').trim()
	}));
}

/** Halaman Capability (Brainware / CAD-CAM / Software Development). */
export async function getCapability(): Promise<RichPage[]> {
	const rows = await db.select().from(capability).orderBy(asc(capability.id));
	return rows.map((r) => ({
		id: `cap-${r.id}`,
		slug: slugify(r.judul || `cap-${r.id}`),
		title: fixText(r.judul),
		html: cleanRichHtml(r.deskripsi)
	}));
}

/** Halaman Kerja Sama Teknologi (Experience / Kerjasama / PT DI-Hankam). */
export async function getKerjasama(): Promise<RichPage[]> {
	const rows = await db.select().from(kerTek).orderBy(asc(kerTek.id));
	return rows.map((r) => ({
		id: `ker-${r.id}`,
		slug: slugify(r.judul || `ker-${r.id}`),
		title: fixText(r.judul),
		html: cleanRichHtml(r.deskripsi)
	}));
}

/** JDQ: daftar volume + berkas PDF-nya. */
export async function getJdq(): Promise<JdqVolume[]> {
	const [vols, files] = await Promise.all([
		db.select().from(jdq).orderBy(asc(jdq.id)),
		db.select().from(jdqDet).orderBy(asc(jdqDet.id))
	]);
	return vols.map((v) => ({
		id: `jdq-${v.id}`,
		title: fixText(v.judul),
		subtitle: fixText(v.teks),
		files: files
			.filter((f) => f.jdqId === v.id)
			.map((f) => ({
				id: `jdqf-${f.id}`,
				title: fixText(f.judul),
				file: (f.file ?? '').trim(),
				...fileLink('jdq', f.file)
			}))
	}));
}

/** Fasilitas › Ground Test. */
export async function getGround(): Promise<FacilityItem[]> {
	const rows = await db.select().from(ground).orderBy(asc(ground.id));
	return rows.map((r) => ({ id: `gr-${r.id}`, title: fixText(r.judul), html: cleanRichHtml(r.teks) }));
}

/** Fasilitas › Flight Test. */
export async function getFlight(): Promise<FacilityItem[]> {
	const rows = await db.select().from(flight).orderBy(asc(flight.id));
	return rows.map((r) => ({ id: `fl-${r.id}`, title: fixText(r.judul), html: cleanRichHtml(r.teks) }));
}

// ── Command Media / Project / OC / HKI ────────────────────────────────────────

export async function getCommandMedia(): Promise<RichPage[]> {
	const rows = await db.select().from(cmdMedia).orderBy(asc(cmdMedia.id));
	return rows.map((r) => ({
		id: `cm-${r.id}`,
		slug: slugify(r.judul || `cm-${r.id}`),
		title: fixText(r.judul),
		html: cleanRichHtml(r.deskripsi)
	}));
}

export async function getProject(): Promise<RichPage[]> {
	const rows = await db.select().from(project).orderBy(asc(project.id));
	return rows.map((r) => ({
		id: `prj-${r.id}`,
		slug: slugify(r.judul || `prj-${r.id}`),
		title: fixText(r.judul),
		html: cleanRichHtml(r.deskripsi)
	}));
}

export async function getOc(): Promise<OcSection[]> {
	const [ocRows, certRows, certOcRows] = await Promise.all([
		db.select().from(oc),
		db.select().from(certificate),
		db.select().from(certificateOc)
	]);
	const map = (prefix: string, category: DownloadCategory) => (r: { id: number; title: string | null; desc: string | null; file: string | null }): DocLink => ({
		id: `${prefix}-${r.id}`,
		title: fixText(r.title),
		desc: fixText(r.desc),
		file: (r.file ?? '').trim(),
		...fileLink(category, r.file)
	});
	return [
		{
			title: 'Certificate',
			docs: [...certRows.map(map('cert', 'certificate')), ...certOcRows.map(map('certoc', 'certificateoc'))].filter((d) => d.title)
		},
		{
			title: 'Operating Certificate',
			docs: ocRows.map(map('oc', 'oc')).filter((d) => d.title)
		}
	];
}

// ── Jadwal ────────────────────────────────────────────────────────────────────

export async function getJadwalKa(): Promise<CatalogView> {
	const rows = await db.select().from(jadwalKa).orderBy(asc(jadwalKa.ka));
	return {
		title: 'Train Schedule',
		description: 'Train departure schedule. Type a station or train name to filter.',
		columns: ['From', 'To', 'Train', 'Departs', 'Arrives', 'Notes'],
		rows: rows.map((r) => [
			namaTempat(r.dari, STASIUN_KA),
			namaTempat(r.tujuan, STASIUN_KA),
			fixText(r.ka),
			(r.berangkat ?? '').trim(),
			(r.tiba ?? '').trim(),
			fixText(r.ket)
		])
	};
}

export async function getJadwalPn(): Promise<CatalogView> {
	const rows = await db.select().from(jadwalPn).orderBy(asc(jadwalPn.pn));
	return {
		title: 'Flight Schedule from Husein Sastranegara Airport',
		description: 'Flights departing Husein Sastranegara Airport, Bandung. Type an airline or city to filter.',
		columns: ['Airline', 'From', 'To', 'Departs', 'Notes'],
		rows: rows.map((r) => [
			fixText(r.pn),
			namaTempat(r.dari, KOTA_PN),
			namaTempat(r.tujuan, KOTA_PN),
			(r.berangkat ?? '').trim(),
			fixText(r.ket)
		])
	};
}

export async function getHki(): Promise<RichPage[]> {
	const [peng, orgh, patents] = await Promise.all([
		db.select().from(pengertianHki).orderBy(asc(pengertianHki.id)),
		db.select().from(orgHki).orderBy(asc(orgHki.id)),
		db.select().from(hki).orderBy(asc(hki.id))
	]);
	const toPage = (prefix: string) => (r: { id: number; judul: string | null; teks: string | null }) => ({
		id: `${prefix}-${r.id}`,
		slug: slugify(r.judul || `${prefix}-${r.id}`),
		title: fixText(r.judul),
		html: cleanRichHtml(r.teks)
	});
	return [
		...peng.map(toPage('hki-peng')),
		...orgh.map(toPage('hki-org')),
		...patents.map(toPage('hki'))
	];
}

// ── Online Publication ────────────────────────────────────────────────────────

export async function getOnlinePublication(): Promise<PubCategory[]> {
	const [aero, astro, chem, eng, bus, math, phy, reg, space, gen] = await Promise.all([
		db.select().from(aeronautics).orderBy(asc(aeronautics.title)),
		db.select().from(astronautics).orderBy(asc(astronautics.title)),
		db.select().from(chemats).orderBy(asc(chemats.title)),
		db.select().from(engineerings).orderBy(asc(engineerings.title)),
		db.select().from(busmgmnts).orderBy(asc(busmgmnts.title)),
		db.select().from(mathcomps).orderBy(asc(mathcomps.title)),
		db.select().from(physics).orderBy(asc(physics.title)),
		db.select().from(regulationsPub).orderBy(asc(regulationsPub.title)),
		db.select().from(spacescns).orderBy(asc(spacescns.title)),
		db.select().from(generals).orderBy(asc(generals.title))
	]);
	const cat = (
		slug: string,
		title: string,
		rows: { id: number; title: string | null; file: string | null }[],
		category: DownloadCategory
	): PubCategory => ({
		slug,
		title,
		count: rows.length,
		items: rows.map((r) => ({
			id: `pub-${slug}-${r.id}`,
			title: fixText(r.title),
			file: (r.file ?? '').trim(),
			...fileLink(category, r.file)
		}))
	});
	return [
		cat('aeronautics', 'Aeronautics', aero, 'aeronautics'),
		cat('astronautics', 'Astronautics', astro, 'astronautics'),
		cat('chemistry', 'Chemistry and Materials', chem, 'chemats'),
		cat('engineering', 'Engineering', eng, 'engineerings'),
		cat('business', 'Business and Management', bus, 'busmgmnts'),
		cat('math-cs', 'Mathematical and Computer Sciences', math, 'mathcomps'),
		cat('physics', 'Physics', phy, 'physics'),
		cat('regulations', 'Regulations', reg, 'regulations'),
		cat('space', 'Space Sciences', space, 'spacescns'),
		cat('general', 'General', gen, 'generals')
	];
}

// ── Our Library ───────────────────────────────────────────────────────────────

export async function getLibraryIndex(): Promise<LibraryCatalog[]> {
	const cnt = sql<number>`count(*)`;
	const [avionic, jurnal, docreq, textbook] = await Promise.all([
		db.select({ n: cnt }).from(dokavionik),
		db.select({ n: cnt }).from(jurnalTelDt),
		db.select({ n: cnt }).from(docReqStdInd),
		db.select({ n: cnt }).from(koltextbook)
	]);
	return [
		{ slug: 'document-avionic', title: 'Document Avionic', description: 'Catalog of avionics documents.', count: avionic[0]?.n ?? 0 },
		{ slug: 'jurnal-tel-dt', title: 'TEL - DT Journal Catalog', description: 'Journal catalog of the Directorate of Technology.', count: jurnal[0]?.n ?? 0 },
		{ slug: 'doc-req', title: 'Report of Doc. Req. (Stand. Industry)', description: 'Industry-standard requirement documents.', count: docreq[0]?.n ?? 0 },
		{ slug: 'textbook', title: 'DT Library Textbook Collection', description: 'Books and textbooks in the DT library.', count: textbook[0]?.n ?? 0 },
		{ slug: 'doa-library', title: 'DOA Library', description: 'Library of the DOA system.', count: 0, href: LEGACY.doaLibrary }
	];
}

export async function getLibraryCatalog(slug: string): Promise<CatalogView | null> {
	switch (slug) {
		case 'document-avionic': {
			const rows = await db.select().from(dokavionik).orderBy(asc(dokavionik.judul));
			return {
				title: 'Document Avionic',
				description: 'Avionics document catalog of the Directorate of Technology.',
				columns: ['Title', 'RAC No.', 'Location', 'Published', 'Program'],
				rows: rows.map((r) => [
					fixText(r.judul),
					(r.racno ?? '').trim(),
					(r.lokasi ?? '').trim(),
					(r.thterbit ?? '').trim(),
					(r.program ?? '').trim()
				])
			};
		}
		case 'jurnal-tel-dt': {
			const rows = await db.select().from(jurnalTelDt).orderBy(asc(jurnalTelDt.judul));
			return {
				title: 'TEL - DT Journal Catalog',
				description: 'Journal catalog of the Directorate of Technology.',
				columns: ['Title', 'Location', 'Publisher'],
				rows: rows.map((r) => [fixText(r.judul), (r.lokasi ?? '').trim(), fixText(r.penerbit)])
			};
		}
		case 'doc-req': {
			const rows = await db.select().from(docReqStdInd).orderBy(asc(docReqStdInd.id));
			return {
				title: 'Report of Doc. Req. (Stand. Industry)',
				description: 'Industry-standard requirement documents.',
				columns: ['Year', 'Memo', 'Document No.', 'Program', 'Pages'],
				rows: rows.map((r) => [
					fixText(r.tahun),
					fixText(r.nota),
					fixText(r.nodoc),
					fixText(r.program),
					fixText(r.pages)
				])
			};
		}
		case 'textbook': {
			const rows = await db.select().from(koltextbook).orderBy(asc(koltextbook.title));
			return {
				title: 'DT Library Textbook Collection',
				description: 'Books and textbooks in the Directorate of Technology library.',
				columns: ['Title', 'Author', 'Category', 'Location'],
				rows: rows.map((r) => [
					fixText(r.title),
					fixText(r.author),
					(r.cat ?? '').trim(),
					(r.lokasi ?? '').trim()
				])
			};
		}
		default:
			return null;
	}
}

// ── Link & Regulation ─────────────────────────────────────────────────────────

export async function getLinks(): Promise<LinkGroup[]> {
	const rows = await db.select().from(link).orderBy(asc(link.desc));
	const toItem = (r: { id: number; desc: string | null; url: string | null }, external: boolean): LinkItem => ({
		id: `link-${r.id}`,
		desc: fixText(r.desc),
		url: (r.url ?? '').trim(),
		external
	});
	const eksternal = rows.filter((r) => r.category === 1).map((r) => toItem(r, true));
	const internal = rows.filter((r) => r.category !== 1).map((r) => toItem(r, false));
	return [
		{ title: 'External', items: eksternal },
		{ title: 'PT DI Internal', items: internal }
	];
}

export async function getRegulations(): Promise<NamedCatalog[]> {
	const columns = ['Document No.', 'Document Title', 'Revision / Date', 'Remarks'];
	const [pmrt, hub, han] = await Promise.all([
		db.select().from(rsiPmrtH).orderBy(asc(rsiPmrtH.id)),
		db.select().from(rsiDepHub).orderBy(asc(rsiDepHub.id)),
		db.select().from(rsiDepHan).orderBy(asc(rsiDepHan.id))
	]);
	const map = (r: { docno: string | null; judul: string | null; revdate: string | null; remarks: string | null }) => [
		fixText(r.docno),
		fixText(r.judul),
		fixText(r.revdate),
		fixText(r.remarks)
	];
	return [
		{
			slug: 'pemerintah-ri',
			title: 'Government of Indonesia',
			description: 'Indonesian certification regulations — Government of Indonesia.',
			columns,
			rows: pmrt.map(map)
		},
		{
			slug: 'perhubungan-ri',
			title: 'Ministry of Transportation',
			description: 'Indonesian certification regulations — Ministry of Transportation.',
			columns,
			rows: hub.map(map)
		},
		{
			slug: 'pertahanan-ri',
			title: 'Ministry of Defense',
			description: 'Indonesian certification regulations — Ministry of Defense.',
			columns,
			rows: han.map(map)
		}
	];
}

// ── Telepon Penting & Sekilas Dittek ──────────────────────────────────────────

export async function getTelepon(): Promise<TeleponGroup[]> {
	const rows = await db.select().from(telp).orderBy(asc(telp.title));
	const pick = (cat: number, title: string): TeleponGroup => ({
		title,
		items: rows
			.filter((r) => r.category === cat)
			.map((r) => ({ id: `telp-${r.id}`, title: fixText(r.title), no: (r.no ?? '').trim() }))
	});
	return [pick(0, 'PT DI'), pick(1, 'Bandung'), pick(2, 'National')];
}

export async function getSekilas(): Promise<SekilasItem[]> {
	const rows = await db.select().from(sekilas).orderBy(desc(sekilas.date));
	return rows.map((r) => ({
		id: `sk-${r.id}`,
		caption: stripHtml(r.caption),
		file: (r.file ?? '').trim(),
		date: isoDate(r.date)
	}));
}
