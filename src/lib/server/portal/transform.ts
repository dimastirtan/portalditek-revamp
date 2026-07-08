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

/** Perbaiki mojibake Windows-1252 pada teks. */
export function fixText(input: string | null | undefined): string {
	let s = (input ?? '').trim();
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
