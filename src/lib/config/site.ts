/**
 * Konfigurasi site — nama, kontak, jam operasional, social media.
 * Semua konten "identitas" Portal disentralisasi di sini agar mudah di-update.
 *
 * TODO untuk kamu (Dimas):
 *  1. Konfirmasi email resmi direktorat (Portal lama pakai kevin@indonesian-aerospace.com
 *     yang sepertinya alamat personal). Ganti nilai `contact.email` di sini.
 *  2. Nomor telepon Portal lama menuliskan +91 (India) — jelas typo dari template
 *     BootstrapMade. Ganti dengan nomor operator resmi PT DI di `contact.phone`.
 * (Kalender kerja kini berupa gambar unggahan — lihat $lib/server/uploads.)
 */
export const SITE = {
	name: 'Direktorat Teknologi dan Menejemen Resiko',
	shortName: 'Direktorat Teknologi dan Menejemen Resiko',
	tagline: 'Internal portal of Direktorat Teknologi dan Menejemen Resiko, PT Dirgantara Indonesia',
	company: 'PT Dirgantara Indonesia (Persero)',
	companyUrl: 'http://www.indonesian-aerospace.com/',

	// Tombol "Library" di kanan header (katalog + Online Publication).
	// TODO: ganti href ke URL sistem perpustakaan/e-library kalau sudah ada;
	// set external: true kalau membuka domain lain.
	library: {
		label: 'Library',
		href: '/library',
		external: false,
	},
	description:
		'An integrated platform for the information, documents, and internal systems of the Directorate of Technology and Development.',

	address: {
		street: 'Jalan Pajajaran No. 154',
		city: 'Bandung',
		postalCode: '40174',
		region: 'West Java',
		country: 'Indonesia'
	},

	contact: {
		email: 'das@indonesian-aerospace.com', // TODO: konfirmasi email direktorat
	},

	hours: [
		{ days: 'Monday – Thursday', time: '08:00 – 11:30, 12:20 – 16:30' },
		{ days: 'Friday', time: '08:00 – 11:00, 13:10 – 16:30' },
		{ days: 'Saturday – Sunday', time: 'Closed' }
	],

	social: {
		twitter: 'https://twitter.com/@officialptdi',
		facebook: 'https://www.facebook.com/officialptdi/',
		instagram: 'https://instagram.com/officialptdi',
		youtube: 'https://www.youtube.com/@officialptdi2301',
		linkedin: 'https://linkedin.com/in/officialptdi'
	}
} as const;

export type SiteConfig = typeof SITE;
