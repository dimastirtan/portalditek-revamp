/**
 * Query portal: baca tabel `dittek`, kembalikan objek yang sudah sesuai tipe di
 * $lib/types/content dan sudah dibersihkan (mojibake/HTML/tanggal).
 *
 * Catatan url: dokumen (PDF/DOC) belum di-host, jadi `url` diisi '#'. Saat folder
 * aset lama dipulihkan, arahkan ke path file yang sebenarnya (kolom N_FILE_*).
 */
import { desc, sql } from 'drizzle-orm';
import { db } from '$lib/server/db';
import { berita, artikel, agenda, download, info, emp } from '$lib/server/db/schema';
import { fixText, stripHtml, isoDate, truncate, fileKind } from './transform';
import type {
	Article,
	AgendaEvent,
	Download,
	NewsItem,
	Announcement,
	BirthdayGroup,
	Person
} from '$lib/types/content';

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
