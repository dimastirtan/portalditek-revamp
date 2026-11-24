/**
 * Helper pembersih data lama sebelum ditampilkan.
 *
 * Kolom lama menyimpan mojibake Windows-1252 (kutip lengkung & em-dash rusak)
 * dan teks berformat HTML. Fungsi di sini merapikannya di sisi server.
 *
 * Catatan: bila suatu saat dump di-import ulang dengan konversi latin1→utf8mb4
 * yang benar, fixText() bisa dilepas.
 */
import { ensureLocal } from '$lib/server/gambar';
import { isExistingMedia } from '$lib/server/uploads';

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

/**
 * Buang tag HTML, decode entity, rapikan whitespace, lalu perbaiki mojibake.
 * Isi <style>/<script>/<xml> dan komentar (sisa salin-tempel dari Word) ikut
 * dibuang — kalau tidak, kode CSS-nya muncul sebagai teks.
 */
export function stripHtml(input: string | null | undefined): string {
	let s = (input ?? '')
		.replace(/<!--[\s\S]*?-->/g, ' ')
		.replace(/<(style|script|xml)\b[\s\S]*?<\/\1>/gi, ' ')
		.replace(/<[^>]+>/g, ' ');
	for (const [re, to] of ENTITIES) s = s.replace(re, to);
	s = fixText(s);
	return s.replace(/\s+/g, ' ').trim();
}

/**
 * true bila isi tidak mengandung tag HTML sama sekali — diketik/ditempel langsung
 * ke database sebagai teks polos (data lama selalu HTML dari editor dt-admin).
 */
const isPlainText = (s: string) => !/<\/?[a-z][^>]*>/i.test(s);

/**
 * Teks polos → HTML: tiap baris jadi satu paragraf. Tanpa ini baris baru hilang
 * (di HTML dianggap spasi) dan seluruh isi berita menyatu jadi satu blok.
 * Karakter < > & di-escape; entity yang sudah ada (&amp;, &#39;) dibiarkan.
 */
function plainTextToHtml(s: string): string {
	return s
		.replace(/\r\n?/g, '\n')
		.split('\n')
		.map((line) => line.trim())
		.filter(Boolean)
		.map(
			(line) =>
				`<p>${line
					.replace(/&(?![a-z]+;|#\d+;|#x[\da-f]+;)/gi, '&amp;')
					.replace(/</g, '&lt;')
					.replace(/>/g, '&gt;')}</p>`
		)
		.join('\n');
}

/**
 * Buang baris pertama teks polos bila sama dengan judul — isi yang ditempel dari
 * berita online sering ikut membawa judulnya, sehingga judul tampil dua kali.
 */
export function dropLeadingTitle(text: string | null | undefined, title: string): string {
	const s = text ?? '';
	if (!title || !isPlainText(s)) return s;
	const norm = (t: string) => fixText(t).replace(/\s+/g, ' ').trim().toLowerCase();
	const lines = s.replace(/\r\n?/g, '\n').split('\n');
	const first = lines.findIndex((line) => line.trim());
	if (first >= 0 && norm(lines[first]) === norm(title)) lines.splice(first, 1);
	return lines.join('\n');
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
 * Petakan src gambar lama → berkas lokal di static/gambar/<folder>/ yang benar-benar ada
 * (lihat ensureLocal: berkas di folder lain ikut dicari). Mengembalikan null bila
 * sumbernya tidak dikenali atau berkasnya tidak ada → tag <img> dibuang, tidak
 * muncul ikon gambar rusak. Folder tujuan mengikuti hasil salin copy-gambar.bat.
 */
function mapImgSrc(src: string): string | null {
	const s = (src ?? '').trim();
	// Gambar unggahan dashboard yang disisipkan ke isi (UPLOAD_DIR, lihat uploads.ts).
	if (s.startsWith('/media/')) return isExistingMedia(s) ? s : null;
	const url = mapLegacySrc(s);
	return url?.startsWith('/gambar/') ? ensureLocal(url) : url;
}

function mapLegacySrc(src: string): string | null {
	const s = (src ?? '').trim();
	if (!s) return null;
	let base = s.split('?')[0].split('/').pop() ?? '';
	if (!base) return null;
	// Nama di HTML lama sering sudah ter-encode ("haji%20ditek.jpg"); decode dulu
	// supaya tidak jadi "%2520" (gambar tidak ketemu).
	try {
		base = decodeURIComponent(base);
	} catch {
		// nama berisi % yang bukan escape — pakai apa adanya
	}
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

/** URL lokal gambar pertama di HTML lama (lihat mapImgSrc); '' bila tidak ada. */
export function firstImage(html: string | null | undefined): string {
	for (const m of (html ?? '').matchAll(/<img\b[^>]*\ssrc\s*=\s*("([^"]*)"|'([^']*)'|([^\s>]+))/gi)) {
		const mapped = mapImgSrc(m[2] ?? m[3] ?? m[4] ?? '');
		if (mapped) return mapped;
	}
	return '';
}

/** true bila nilai atribut URL memakai skema berbahaya — juga yang disamarkan entity/spasi. */
function isDangerousUrl(value: string): boolean {
	const url = value
		.replace(/^["']|["']$/g, '')
		.replace(/&#(x?)([0-9a-f]+);?/gi, (_, hex: string, n: string) =>
			String.fromCharCode(parseInt(n, hex ? 16 : 10))
		)
		.replace(/&colon;/gi, ':')
		.replace(/&(tab|newline);/gi, '')
		// Browser mengabaikan spasi & karakter kontrol di dalam skema URL ("java\tscript:").
		// eslint-disable-next-line no-control-regex
		.replace(/[\s\u0000-\u001f]/g, '')
		.toLowerCase();
	return /^(javascript|vbscript|data):/.test(url);
}

/**
 * Bersihkan HTML lama agar aman dirender via {@html}.
 * Membuang <script>/<style>/<iframe>/<base>, atribut event handler, URL
 * javascript:/vbscript:/data:, dan <img> yang menunjuk ke server lama
 * (IP/portaldittek) karena sudah mati.
 * Untuk konten internal tepercaya; bila kelak menerima input tak tepercaya,
 * ganti dengan DOMPurify.
 */
export function cleanRichHtml(input: string | null | undefined): string {
	let s = input ?? '';
	if (isPlainText(s)) return fixText(plainTextToHtml(s)).trim();
	s = s.replace(/<(script|style|iframe|object|embed|link|meta|base)\b[\s\S]*?<\/\1>/gi, '');
	s = s.replace(/<(script|style|iframe|object|embed|link|meta|base)\b[^>]*\/?>/gi, '');
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
	s = s.replace(
		/\s(href|src|action|formaction|xlink:href)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi,
		(attr, name: string, value: string) => (isDangerousUrl(value) ? ` ${name}="#"` : attr)
	);
	// Buang warna & style inline lama (hardcoded 2009) agar teks mengikuti warna
	// tema — kalau tidak, di dark mode teks jadi tak terbaca.
	s = s.replace(/\s(?:color|bgcolor|background|text|link|vlink|alink)\s*=\s*("[^"]*"|'[^']*'|[^\s>]+)/gi, '');
	s = s.replace(/\sstyle\s*=\s*("[^"]*"|'[^']*')/gi, '');
	s = s.replace(/<font\b[^>]*>/gi, '<span>').replace(/<\/font>/gi, '</span>');
	return fixText(s).trim();
}
