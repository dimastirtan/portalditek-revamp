/** Tipe konten dinamis Portal. Sekarang dibaca dari JSON di $lib/data, nanti bisa dari API. */

export type Article = {
	id: string;
	title: string;
	/** ISO date string, mis. '2026-01-15'. */
	publishedAt: string;
	/** Link unduh berkas; tidak ada bila kolom file kosong. */
	url?: string;
};

export type AgendaEvent = {
	id: string;
	title: string;
	/** ISO date string. */
	date: string;
	location?: string;
	url?: string;
};

export type Download = {
	id: string;
	title: string;
	/** Link unduh berkas; tidak ada bila kolom file kosong. */
	url?: string;
	/** Ukuran file untuk ditampilkan, mis. '2.4 MB'. */
	size?: string;
	/** Jenis file, mis. 'PDF', 'DOCX'. */
	kind?: string;
};

export type NewsItem = {
	id: string;
	title: string;
	excerpt: string;
	/** ISO date string. */
	publishedAt: string;
	url: string;
	/** Path gambar di /static, opsional. */
	image?: string;
	/** true = berita utama (tampil menonjol). */
	featured?: boolean;
};

export type Announcement = {
	id: string;
	title: string;
	body: string;
	/** ISO date string. */
	date: string;
	/** false = tidak ditampilkan (bell tidak bergetar). */
	active: boolean;
};

export type Person = {
	nik: string;
	name: string;
	/** Kode unit organisasi, mis. 'DT0000'. */
	org: string;
};

export type BirthdayGroup = {
	/** Label hari, mis. 'Hari Ini, Selasa, 07-07-2026'. */
	label: string;
	/** ISO date string hari tersebut. */
	date: string;
	/** true bila ini hari ini. */
	today: boolean;
	people: Person[];
};

// ── Tipe untuk halaman Profil / Pojok Media ───────────────────────────────────

/** Baris tabel Personil. */
export type PersonRow = {
	nik: string;
	name: string;
	org: string;
	tlp: string;
	email: string;
	goldar: string;
};

/** Satu berita lengkap (index berita + detail). */
export type BeritaEntry = {
	id: string;
	title: string;
	date: string;
	/** HTML sudah dibersihkan (aman untuk {@html}). */
	html: string;
};

/**
 * Satu headline Berita Utama = satu baris tmmainarticledet (punya judul, tanggal
 * & teks sendiri). Beberapa headline bisa berada di satu berita induk (tmmainarticle).
 */
export type Headline = {
	id: number;
	title: string;
	/** ISO date string. */
	date: string;
	excerpt: string;
	/** URL gambar: gambar pertama di teks, atau gambar berita induk; '' bila tidak ada. */
	image: string;
	/** Halaman detail: /berita-utama/<id>. */
	url: string;
	/** Judul berita induk. */
	story: string;
	storyId: number | null;
	/** HTML sudah dibersihkan (aman untuk {@html}). */
	html: string;
};

/** Headline tanpa isi HTML — untuk daftar & slideshow (HTML tidak ikut dikirim). */
export type HeadlineCard = Omit<Headline, 'html'>;

/** Poster buletin (gambar unggahan di UPLOAD_DIR/buletin — lihat $lib/server/uploads). */
export type Bulletin = {
	/** URL gambar poster (/media/buletin/...). */
	src: string;
	/** Dari nama berkas tanpa ekstensi. */
	title: string;
	/** ISO datetime unggahan/perubahan terakhir. */
	updated: string;
};

/** Unit organisasi + departemen di bawahnya. */
export type OrgUnit = {
	id: string;
	/** 0 = pimpinan direktorat (puncak tree), 1 = pusat/divisi di bawahnya. */
	level: 0 | 1;
	title: string;
	head: string;
	/** URL foto pejabat (thumbnail bila ada); '' bila tidak ada foto. */
	foto: string;
	departments: { id: string; title: string; head: string; foto: string }[];
};

/** Halaman konten kaya (Capability, Kerja Sama). Punya anchor slug. */
export type RichPage = {
	id: string;
	slug: string;
	title: string;
	html: string;
};

/** Volume JDQ + berkasnya. */
export type JdqVolume = {
	id: string;
	title: string;
	subtitle: string;
	files: { id: string; title: string; file: string; url?: string }[];
};

/** Item fasilitas (Ground/Flight Test). */
export type FacilityItem = {
	id: string;
	title: string;
	html: string;
};

// ── Command Media / OC / Online Publication / Our Library ─────────────────────

/** Dokumen dengan berkas PDF (OC, sertifikat). */
export type DocLink = {
	id: string;
	title: string;
	desc: string;
	file: string;
	/** Link unduh berkas; tidak ada bila kolom file kosong. */
	url?: string;
};

/** Satu publikasi (Online Publication). */
export type PubItem = { id: string; title: string; file: string; url?: string };

/** Kategori Online Publication + isinya. */
export type PubCategory = { slug: string; title: string; count: number; items: PubItem[] };

/** Kartu katalog di indeks Our Library. */
export type LibraryCatalog = {
	slug: string;
	title: string;
	description: string;
	count: number;
	/** kalau external, langsung link (mis. DOA Library → /doa). */
	href?: string;
};

/** Tampilan tabel katalog generik (Our Library › katalog). */
export type CatalogView = {
	title: string;
	description: string;
	columns: string[];
	rows: string[][];
};

// ── Link & Regulation ─────────────────────────────────────────────────────────

export type LinkItem = { id: string; desc: string; url: string; external: boolean };
export type LinkGroup = { title: string; items: LinkItem[] };

/** Katalog bernama (untuk seksi Regulation). */
export type NamedCatalog = CatalogView & { slug: string };

/** Seksi accordion untuk halaman OC (Certificate / Operating Certificate). */
export type OcSection = { title: string; docs: DocLink[] };

// ── Telepon Penting & Sekilas Dittek ──────────────────────────────────────────

export type TeleponItem = { id: string; title: string; no: string };
export type TeleponGroup = { title: string; items: TeleponItem[] };
export type SekilasItem = { id: string; caption: string; file: string; date: string };

// ── Program R&D (dari database IMS) ──────────────────────────────────────────

/** Ringkasan satu program pesawat (kartu di beranda & /program). */
export type ImsProgram = {
	id: number;
	slug: string;
	/** program_name di IMS (mis. 'NC212i', 'SIMULATOR'). */
	name: string;
	description: string;
	/** URL gambar program (lihat imsImageUrl); '' bila tidak ada. */
	image: string;
	total: number;
	/** Status diawali 'On Progress'. */
	onProgress: number;
	/** Status mengandung 'Complete'. */
	completed: number;
	/** problem = 'YES'. */
	problem: number;
	/** Rata-rata progres semua proyek, 0–100. */
	avgProgress: number;
};

/** Satu tahap sertifikasi proyek (6 tahap: Application … Final Certification). */
export type ImsStage = {
	step: number;
	name: string;
	/** 0–100. */
	progress: number;
	/** Jumlah dokumen tahap ini (hanya angka — judul & PIC tetap di IMS). */
	docsTotal: number;
	docsApproved: number;
};

export type ImsProject = {
	id: number;
	code: string;
	name: string;
	customer: string;
	category: string;
	classChange: string;
	/** Tahap proyek di IMS (mis. 'Delivery', 'BSI', 'FI') — beda dari tahap sertifikasi. */
	stage: string;
	progress: number;
	status: string;
	problem: boolean;
	stages: ImsStage[];
};

export type ImsProgramDetail = ImsProgram & { projects: ImsProject[] };
