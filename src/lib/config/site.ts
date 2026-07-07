/**
 * Konfigurasi site — nama, kontak, jam operasional, social media.
 * Semua konten "identitas" Portal disentralisasi di sini agar mudah di-update.
 *
 * TODO untuk kamu (Dimas):
 *  1. Konfirmasi email resmi direktorat (Portal lama pakai kevin@indonesian-aerospace.com
 *     yang sepertinya alamat personal). Ganti nilai `contact.email` di sini.
 *  2. Nomor telepon Portal lama menuliskan +91 (India) — jelas typo dari template
 *     BootstrapMade. Ganti dengan nomor operator resmi PT DI di `contact.phone`.
 *  3. Isi calendarIframeSrc dengan Calendar ID direktorat (Portal lama pakai
 *     placeholder `yourcalendarid`). Sementara diisi kalender hari libur Indonesia.
 */
export const SITE = {
	name: 'Direktorat Teknologi dan Pengembangan',
	shortName: 'Portal DTP',
	tagline: 'Portal internal Direktorat Teknologi dan Pengembangan PT Dirgantara Indonesia',
	company: 'PT Dirgantara Indonesia (Persero)',
	companyUrl: 'https://www.indonesian-aerospace.com/',
	description:
		'Platform terintegrasi untuk mengakses informasi, dokumen, dan sistem-sistem internal Direktorat Teknologi dan Pengembangan.',

	address: {
		street: 'Jalan Pajajaran No. 154',
		city: 'Bandung',
		postalCode: '40174',
		region: 'Jawa Barat',
		country: 'Indonesia'
	},

	contact: {
		email: 'kevin@indonesian-aerospace.com', // TODO: konfirmasi email direktorat
		phone: '+62 22 6031-679' // TODO: konfirmasi nomor operator resmi
	},

	hours: [
		{ days: 'Senin – Kamis', time: '09.00 – 11.30, 13.00 – 16.00' },
		{ days: 'Jumat', time: '09.00 – 11.00, 14.00 – 17.00' },
		{ days: 'Sabtu – Minggu', time: 'Tutup' }
	],

	social: {
		twitter: 'https://twitter.com/@officialptdi',
		facebook: 'https://www.facebook.com/officialptdi/',
		instagram: 'https://instagram.com/officialptdi',
		youtube: 'https://www.youtube.com/@officialptdi2301',
		linkedin: 'https://linkedin.com/in/officialptdi'
	},

	// Google Calendar iframe src.
	// Ganti calendar ID dengan kalender resmi direktorat kalau sudah ada.
	calendarIframeSrc:
		'https://calendar.google.com/calendar/embed?src=id.indonesian%23holiday%40group.v.calendar.google.com&ctz=Asia%2FJakarta'
} as const;

export type SiteConfig = typeof SITE;
