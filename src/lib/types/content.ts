/** Tipe konten dinamis Portal. Sekarang dibaca dari JSON di $lib/data, nanti bisa dari API. */

export type Article = {
	id: string;
	title: string;
	/** ISO date string, mis. '2026-01-15'. */
	publishedAt: string;
	url: string;
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
	url: string;
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

/** Grup Berita Utama: satu headline + beberapa sub-artikel. */
export type MainArticleGroup = {
	id: string;
	title: string;
	date: string;
	/** Nama berkas gambar headline (di static/gambar/artikel/). */
	image: string;
	items: BeritaEntry[];
};

/** Unit organisasi + departemen di bawahnya. */
export type OrgUnit = {
	id: string;
	title: string;
	head: string;
	/** Nama berkas foto pejabat (di static/gambar/org/). */
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
	files: { id: string; title: string; file: string }[];
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
};

/** Satu publikasi (Online Publication). */
export type PubItem = { id: string; title: string; file: string };

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
