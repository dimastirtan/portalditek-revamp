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
	items: BeritaEntry[];
};

/** Unit organisasi + departemen di bawahnya. */
export type OrgUnit = {
	id: string;
	title: string;
	head: string;
	departments: { id: string; title: string; head: string }[];
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
