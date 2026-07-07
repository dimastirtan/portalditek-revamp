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
