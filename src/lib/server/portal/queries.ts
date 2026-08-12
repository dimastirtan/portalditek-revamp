/**
 * Query portal: baca tabel `dittek`, kembalikan objek yang sudah sesuai tipe di
 * $lib/types/content dan sudah dibersihkan (mojibake/HTML/tanggal).
 *
 * Catatan url: dokumen (PDF/DOC) belum di-host, jadi `url` diisi '#'. Saat folder
 * aset lama dipulihkan, arahkan ke path file yang sebenarnya (kolom N_FILE_*).
 */
import { desc, asc, eq, sql } from 'drizzle-orm';
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
import { fixText, stripHtml, isoDate, truncate, fileKind, cleanRichHtml } from './transform';
import type {
	Article,
	AgendaEvent,
	Download,
	NewsItem,
	Announcement,
	BirthdayGroup,
	Person,
	PersonRow,
	BeritaEntry,
	MainArticleGroup,
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

export async function getNews(limit = 7): Promise<NewsItem[]> {
	const rows = await db.select().from(berita).orderBy(desc(berita.date)).limit(limit);
	return rows
		.filter((r) => isoDate(r.date))
		.map((r, i) => ({
			id: `news-${r.id}`,
			title: fixText(r.judul),
			excerpt: truncate(stripHtml(r.intro || r.teks), 200),
			publishedAt: isoDate(r.date),
			url: '#',
			...(i === 0 ? { featured: true } : {})
		}));
}

export async function getArticles(limit = 8): Promise<Article[]> {
	const rows = await db.select().from(artikel).orderBy(desc(artikel.date)).limit(limit);
	return rows
		.filter((r) => isoDate(r.date))
		.map((r) => ({
			id: `art-${r.id}`,
			title: fixText(r.judul),
			publishedAt: isoDate(r.date),
			url: '#'
		}));
}

export async function getEvents(limit = 6): Promise<AgendaEvent[]> {
	const rows = await db.select().from(agenda).orderBy(desc(agenda.date)).limit(limit);
	return rows.map((r) => ({
		id: `evt-${r.id}`,
		title: fixText(r.judul),
		date: isoDate(r.date),
		url: '#'
	}));
}

export async function getDownloads(limit = 8): Promise<Download[]> {
	const rows = await db.select().from(download).orderBy(desc(download.entryAt)).limit(limit);
	return rows.map((r) => {
		const kind = fileKind(r.file);
		return {
			id: `dl-${r.id}`,
			title: fixText(r.judul),
			url: '#',
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
	const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
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
		const d = new Date(`${iso}T00:00:00+07:00`);
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
		const prefix = offset === 0 ? 'Hari Ini, ' : '';
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

/** Index Berita Utama: headline + sub-artikel. */
export async function getMainArticleIndex(): Promise<MainArticleGroup[]> {
	const [heads, dets] = await Promise.all([
		db.select().from(mainArticle).orderBy(desc(mainArticle.date)),
		db.select().from(mainArticleDet)
	]);
	return heads.map((h) => ({
		id: `ma-${h.id}`,
		title: fixText(h.judul),
		date: isoDate(h.date),
		image: (h.image ?? '').trim(),
		items: dets
			.filter((d) => d.parentId === h.id)
			.map((d) => ({
				id: `mad-${d.id}`,
				title: fixText(d.judul),
				date: isoDate(d.date),
				html: cleanRichHtml(d.teks)
			}))
	}));
}

/** Struktur organisasi: unit + departemen, nama pejabat di-resolve dari tmemp. */
export async function getOrgStructure(): Promise<OrgUnit[]> {
	const [units, dets, people] = await Promise.all([
		db.select().from(org).orderBy(asc(org.id)),
		db.select().from(orgDet).orderBy(asc(orgDet.id)),
		db.select({ nik: emp.nik, name: emp.name }).from(emp)
	]);
	const nameOf = new Map(people.map((p) => [(p.nik ?? '').trim(), fixText(p.name)]));
	return units.map((u) => ({
		id: `org-${u.id}`,
		title: fixText(u.title),
		head: nameOf.get((u.nik ?? '').trim()) ?? '',
		foto: (u.foto ?? '').trim(),
		departments: dets
			.filter((d) => d.orgId === u.id)
			.map((d) => ({
				id: `orgdet-${d.id}`,
				title: fixText(d.title),
				head: nameOf.get(String(d.nik ?? '')) ?? '',
				foto: (d.foto ?? '').trim()
			}))
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
				file: (f.file ?? '').trim()
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
	const map = (prefix: string) => (r: { id: number; title: string | null; desc: string | null; file: string | null }): DocLink => ({
		id: `${prefix}-${r.id}`,
		title: fixText(r.title),
		desc: fixText(r.desc),
		file: (r.file ?? '').trim()
	});
	return [
		{
			title: 'Certificate',
			docs: [...certRows.map(map('cert')), ...certOcRows.map(map('certoc'))].filter((d) => d.title)
		},
		{
			title: 'Operating Certificate',
			docs: ocRows.map(map('oc')).filter((d) => d.title)
		}
	];
}

// ── Jadwal ────────────────────────────────────────────────────────────────────

export async function getJadwalKa(): Promise<CatalogView> {
	const rows = await db.select().from(jadwalKa).orderBy(asc(jadwalKa.ka));
	return {
		title: 'Jadwal Kereta Api',
		description: 'Jadwal keberangkatan kereta api. Ketik nama stasiun atau kereta untuk menyaring.',
		columns: ['Dari', 'Tujuan', 'Nama Kereta', 'Berangkat', 'Tiba', 'Keterangan'],
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
		title: 'Jadwal Penerbangan Dari Bandara Husein Sastranegara',
		description: 'Jadwal penerbangan dari Bandara Husein Sastranegara, Bandung. Ketik maskapai atau kota untuk menyaring.',
		columns: ['Nama Maskapai', 'Dari', 'Tujuan', 'Berangkat', 'Keterangan'],
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
		rows: { id: number; title: string | null; file: string | null }[]
	): PubCategory => ({
		slug,
		title,
		count: rows.length,
		items: rows.map((r) => ({
			id: `pub-${slug}-${r.id}`,
			title: fixText(r.title),
			file: (r.file ?? '').trim()
		}))
	});
	return [
		cat('aeronautics', 'Aeronautics', aero),
		cat('astronautics', 'Astronautics', astro),
		cat('chemistry', 'Chemistry and Materials', chem),
		cat('engineering', 'Engineering', eng),
		cat('business', 'Business and Management', bus),
		cat('math-cs', 'Mathematical and Computer Sciences', math),
		cat('physics', 'Physics', phy),
		cat('regulations', 'Regulations', reg),
		cat('space', 'Space Sciences', space),
		cat('general', 'General', gen)
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
		{ slug: 'document-avionic', title: 'Document Avionic', description: 'Katalog dokumen avionik.', count: avionic[0]?.n ?? 0 },
		{ slug: 'jurnal-tel-dt', title: 'Katalog Jurnal TEL - DT', description: 'Katalog jurnal Direktorat Teknologi.', count: jurnal[0]?.n ?? 0 },
		{ slug: 'doc-req', title: 'Report of Doc. Req. (Stand. Industry)', description: 'Dokumen requirement standar industri.', count: docreq[0]?.n ?? 0 },
		{ slug: 'textbook', title: 'Koleksi Textbook - Library DT', description: 'Koleksi buku/textbook perpustakaan DT.', count: textbook[0]?.n ?? 0 },
		{ slug: 'doa-library', title: 'DOA Library', description: 'Perpustakaan sistem DOA.', count: 0, href: '/doa' }
	];
}

export async function getLibraryCatalog(slug: string): Promise<CatalogView | null> {
	switch (slug) {
		case 'document-avionic': {
			const rows = await db.select().from(dokavionik).orderBy(asc(dokavionik.judul));
			return {
				title: 'Document Avionic',
				description: 'Katalog dokumen avionik Direktorat Teknologi.',
				columns: ['Judul', 'RAC No.', 'Lokasi', 'Th. Terbit', 'Program'],
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
				title: 'Katalog Jurnal TEL - DT',
				description: 'Katalog jurnal Direktorat Teknologi.',
				columns: ['Judul', 'Lokasi', 'Penerbit'],
				rows: rows.map((r) => [fixText(r.judul), (r.lokasi ?? '').trim(), fixText(r.penerbit)])
			};
		}
		case 'doc-req': {
			const rows = await db.select().from(docReqStdInd).orderBy(asc(docReqStdInd.id));
			return {
				title: 'Report of Doc. Req. (Stand. Industry)',
				description: 'Dokumen requirement standar industri.',
				columns: ['Tahun', 'Nota', 'No. Dokumen', 'Program', 'Hal.'],
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
				title: 'Koleksi Textbook - Library DT',
				description: 'Koleksi buku/textbook perpustakaan Direktorat Teknologi.',
				columns: ['Judul', 'Penulis', 'Kategori', 'Lokasi'],
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
		{ title: 'Eksternal PT DI', items: eksternal },
		{ title: 'Internal PT DI', items: internal }
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
			title: 'Pemerintah RI',
			description: 'Regulasi sertifikasi Indonesia — Pemerintah RI.',
			columns,
			rows: pmrt.map(map)
		},
		{
			slug: 'perhubungan-ri',
			title: 'Kementerian Perhubungan RI',
			description: 'Regulasi sertifikasi Indonesia — Kementerian Perhubungan RI.',
			columns,
			rows: hub.map(map)
		},
		{
			slug: 'pertahanan-ri',
			title: 'Kementerian Pertahanan RI',
			description: 'Regulasi sertifikasi Indonesia — Kementerian Pertahanan RI.',
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
	return [pick(0, 'PT DI'), pick(1, 'Bandung'), pick(2, 'Nasional')];
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
