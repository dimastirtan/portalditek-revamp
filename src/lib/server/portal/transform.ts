/**
 * Helper pembersih data lama sebelum ditampilkan.
 *
 * Kolom lama menyimpan mojibake Windows-1252 (kutip lengkung & em-dash rusak)
 * dan teks berformat HTML. Fungsi di sini merapikannya di sisi server.
 *
 * Catatan: bila suatu saat dump di-import ulang dengan konversi latin1→utf8mb4
 * yang benar, fixText() bisa dilepas.
 */

const MOJIBAKE: [RegExp, string][] = [
	[/â€œ/g, '“'],
	[/â€\x9d/g, '”'],
	[/â€™/g, '’'],
	[/â€˜/g, '‘'],
	[/â€”/g, '—'],
	[/â€“/g, '–'],
	[/â€¦/g, '…'],
	[/â€¢/g, '•'],
	[/â€/g, '”'], // kutip penutup yang byte ke-3-nya hilang
	[/Ã©/g, 'é'],
	[/Ã¨/g, 'è'],
	[/Ã¢/g, 'â'],
	[/Ã /g, 'à'],
	[/Ã´/g, 'ô'],
	[/Ã§/g, 'ç'],
	[/Ã¼/g, 'ü'],
	[/Ã±/g, 'ñ'],
	[/â‚¬/g, '€'],
	[/Â°/g, '°'],
	[/Â /g, ' '],
	[/Â/g, '']
];

const ENTITIES: [RegExp, string][] = [
	[/&amp;/g, '&'],
	[/&lt;/g, '<'],
	[/&gt;/g, '>'],
	[/&quot;/g, '"'],
	[/&#0?39;/g, "'"],
	[/&apos;/g, "'"],
	[/&nbsp;/g, ' ']
];

/** Perbaiki mojibake Windows-1252 pada teks. Aman untuk angka/tahun/tanggal (di-coerce ke string). */
export function fixText(input: unknown): string {
	let s = String(input ?? '').trim();
	for (const [re, to] of MOJIBAKE) s = s.replace(re, to);
	return s;
}

/** Buang tag HTML, decode entity, rapikan whitespace, lalu perbaiki mojibake. */
export function stripHtml(input: string | null | undefined): string {
	let s = (input ?? '').replace(/<[^>]+>/g, ' ');
	for (const [re, to] of ENTITIES) s = s.replace(re, to);
	s = fixText(s);
	return s.replace(/\s+/g, ' ').trim();
}

/** Ambil bagian 'YYYY-MM-DD' dari string date/datetime; '' bila tidak valid. */
export function isoDate(input: string | null | undefined): string {
	const m = /^(\d{4}-\d{2}-\d{2})/.exec(input ?? '');
	const d = m?.[1];
	return d && d !== '0000-00-00' ? d : '';
}

/** Potong teks di batas kata dan tambahkan elipsis. */
export function truncate(input: string, max = 200): string {
	if (input.length <= max) return input;
	return input.slice(0, max - 1).replace(/\s+\S*$/, '').trimEnd() + '…';
}

/** Turunkan label jenis berkas dari ekstensi nama file. */
export function fileKind(file: string | null | undefined): string | undefined {
	if (!file || !file.includes('.')) return undefined;
	const ext = file.split('.').pop()!.toLowerCase();
	const map: Record<string, string> = {
		pdf: 'PDF',
		doc: 'DOC',
		docx: 'DOCX',
		xls: 'XLS',
		xlsx: 'XLSX',
		ppt: 'PPT',
		pptx: 'PPTX',
		zip: 'ZIP',
		rar: 'RAR',
		dat: 'DAT'
	};
	return map[ext] ?? ext.toUpperCase();
}

/**
 * Petakan src gambar lama → berkas lokal di static/gambar/<folder>/.
 * Mengembalikan null bila sumbernya tidak dikenali (tag <img> lalu dibuang).
 * Folder tujuan mengikuti hasil salin copy-gambar.bat.
 */
function mapImgSrc(src: string): string | null {
	const s = (src ?? '').trim();
	if (!s) return null;
	const base = s.split('?')[0].split('/').pop() ?? '';
	if (!base) return null;
	const enc = encodeURIComponent(base);

	if (/imagelibrary\/uploads\//i.test(s)) return `/gambar/uploads/${enc}`;
	if (/images_sekilas_ditt\//i.test(s)) return `/gambar/sekilas/${enc}`;
	if (/images_org\//i.test(s)) return `/gambar/org/${enc}`;
	if (/images_article\//i.test(s)) return `/gambar/artikel/${enc}`;
	if (/(^|\/)gallery\//i.test(s)) return `/gambar/gallery/${enc}`;
	if (/(^|\/)images\//i.test(s)) return `/gambar/umum/${enc}`;

	// Sudah menunjuk ke portal baru → biarkan.
	if (s.startsWith('/gambar/')) return s;

	// URL absolut ke server lama yang polanya tak dikenali → buang.
	if (/^https?:\/\//i.test(s)) {
		if (/(\d{1,3}(?:\.\d{1,3}){3}|dittek|portaldittek)/i.test(s)) return null;
		return s; // gambar eksternal lain (mis. situs publik) — biarkan.
	}
	return null;
}

/**
 * Bersihkan HTML lama agar aman dirender via {@html}.
 * Membuang <script>/<style>/<iframe>, atribut event handler, link javascript:,
 * dan <img> yang menunjuk ke server lama (IP/portaldittek) karena sudah mati.
 * Untuk konten internal tepercaya; bila kelak menerima input tak tepercaya,
 * ganti dengan DOMPurify.
 */
export function cleanRichHtml(input: string | null | undefined): string {
	let s = input ?? '';
	s = s.replace(/<(script|style|iframe|object|embed|link|meta)\b[\s\S]*?<\/\1>/gi, '');
	s = s.replace(/<(script|style|iframe|object|embed|link|meta)\b[^>]*\/?>/gi, '');
	s = s.replace(/\son\w+\s*=\s*"[^"]*"/gi, '');
	s = s.replace(/\son\w+\s*=\s*'[^']*'/gi, '');
	s = s.replace(/\son\w+\s*=\s*[^\s>]+/gi, '');
	// Alihkan <img> lama (server mati: http://dittek/..., http://10.1.x/...) ke
	// berkas lokal di static/gambar/. Kalau sumbernya tak dikenali → tag dibuang
	// supaya tidak muncul ikon gambar rusak.
	s = s.replace(/<img\b[^>]*>/gi, (tag) => {
		const m = /\ssrc\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/i.exec(tag);
		const raw = m ? (m[2] ?? m[3] ?? m[4] ?? '') : '';
		const mapped = mapImgSrc(raw);
		if (!mapped) return '';
		return tag.replace(/\ssrc\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/i, ` src="${mapped}"`);
	});
	s = s.replace(/href\s*=\s*(["'])\s*javascript:[^"']*\1/gi, 'href="#"');
	// Buang warna & style inline lama (hardcoded 2009) agar teks mengikuti warna
	// tema — kalau tidak, di dark mode teks jadi tak terbaca.
	s = s.replace(/\s(?:color|bgcolor|background|text|link|vlink|alink)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
	s = s.replace(/\sstyle\s*=\s*("[^"]*"|'[^']*')/gi, '');
	s = s.replace(/<font\b[^>]*>/gi, '<span>').replace(/<\/font>/gi, '</span>');
	return fixText(s).trim();
}
