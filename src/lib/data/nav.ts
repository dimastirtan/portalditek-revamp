import type { NavItem, SystemLink } from '$lib/types/nav';

/**
 * Navigasi utama Portal — mengikuti struktur informasi Portal DITTEK lama.
 *
 * Aturan href:
 *  - `/#xxx`  → scroll ke section di landing (berita, informasi, kontak, dst).
 *  - `/xxx`   → route yang sudah ada (mis. /telepon, /certificate).
 *  - `soon:true` (tanpa href) → halaman belum dibangun, tampil redup & non-klik.
 *
 * Begitu sebuah halaman dibuat, ganti `soon:true` jadi `href:'/route'`.
 * Catatan: section "Perusahaan/About" dihapus — portal internal satu direktorat
 * tidak perlu profil perusahaan.
 */
export const MAIN_NAV: NavItem[] = [
	{ label: 'Home', href: '/' },
	{
		label: 'Pojok Media',
		children: [
			{ label: 'Berita Utama', href: '/berita-utama' },
			{ label: 'Berita', href: '/berita' },
			{ label: 'Artikel', href: '/#informasi' },
			{ label: 'Download', href: '/#informasi' }
		]
	},
	{
		label: 'Profil',
		children: [
			{ label: 'Organisasi', href: '/organisasi' },
			{
				label: 'Capability',
				children: [
					{ label: 'Brainware', href: '/capability' },
					{ label: 'CAD/CAM', href: '/capability' },
					{ label: 'Software Development', href: '/capability' }
				]
			},
			{
				label: 'Project',
				children: [{ label: 'N219', soon: true }]
			},
			{
				label: 'SDM',
				children: [
					{ label: 'Personil', href: '/personil' },
					{ label: 'JDQ', href: '/jdq' }
				]
			},
			{
				label: 'Kerjasama Teknologi',
				children: [
					{ label: 'Experience', href: '/kerjasama' },
					{ label: 'Kerjasama Teknologi', href: '/kerjasama' },
					{ label: 'PT DI - Hankam', href: '/kerjasama' }
				]
			},
			{
				label: 'Fasilitas',
				children: [
					{ label: 'Ground Test', href: '/fasilitas#ground-test' },
					{ label: 'Flight Test', href: '/fasilitas#flight-test' }
				]
			}
		]
	},
	{
		label: 'Command Media',
		children: [
			{ label: 'Sistem Command Media', soon: true },
			{ label: 'Sekilas Info Command Media', soon: true }
		]
	},
	{
		label: 'OC',
		children: [
			{ label: 'Certificate', href: '/certificate' },
			{ label: 'OC', soon: true }
		]
	},
	{
		label: 'Regulation',
		children: [
			{ label: 'Pemerintah RI', soon: true },
			{ label: 'Kementrian Perhubungan RI', soon: true },
			{ label: 'Kementrian Pertahanan RI', soon: true }
		]
	},
	{
		label: 'Information',
		children: [
			{ label: 'Kalender Kerja', href: '/kalender-kerja' },
			{ label: 'Telepon Penting', href: '/telepon' },
			{ label: 'Jadwal Kereta Api Jur. Bandung', soon: true },
			{ label: 'Jadwal Penerbangan', soon: true }
		]
	},
	{ label: 'Contact Us', href: '/#kontak' },
	{ label: 'Link', soon: true },
	{ label: 'HKI', soon: true },
	{ label: 'Online Publication', soon: true }
];

/**
 * Sub-sistem internal DTP (kartu di section Sistem + daftar di menu mobile).
 * Ganti `href` ke URL DNS sistem asli begitu siap, dan set external: true.
 */
export const SYSTEMS: SystemLink[] = [
	{
		id: 'doa',
		label: 'DOA',
		description: 'Design Organization Approval — manajemen dokumen standar desain.',
		href: '/doa',
		icon: 'document.svg'
	},
	{
		id: 'dotproject',
		label: 'dotProject',
		description: 'Manajemen proyek dan penjadwalan tim.',
		href: '/dotproject',
		icon: 'case.svg'
	},
	{
		id: 'siedm',
		label: 'SIEDM',
		description: 'Sistem Informasi Engineering Data Management.',
		href: '/siedm',
		icon: 'engineering standard.svg'
	},
	{
		id: 'certificate',
		label: 'Certification',
		description: 'Manajemen sertifikasi produk dan proses.',
		href: '/certificate',
		icon: 'certificate.svg'
	},
	{
		id: 'telepon',
		label: 'Telepon Penting',
		description: 'Direktori nomor telepon internal penting.',
		href: '/telepon',
		icon: 'number.svg'
	}
];
