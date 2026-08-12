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
			{ label: 'Download', href: '/#informasi' },
			{ label: 'Sekilas Dittek', href: '/sekilas-dittek' }
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
				children: [{ label: 'N219', href: '/project' }]
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
			{ label: 'Sistem Command Media', href: '/command-media' },
			{ label: 'Sekilas Info Command Media', href: '/command-media' }
		]
	},
	{
		label: 'OC',
		children: [
			{ label: 'Certificate', href: '/oc' },
			{ label: 'OC', href: '/oc' }
		]
	},
	{
		label: 'Regulation',
		children: [
			{ label: 'Pemerintah RI', href: '/regulation' },
			{ label: 'Kementrian Perhubungan RI', href: '/regulation' },
			{ label: 'Kementrian Pertahanan RI', href: '/regulation' }
		]
	},
	{
		label: 'Information',
		children: [
			{ label: 'Kalender Kerja', href: '/kalender-kerja' },
			{ label: 'Telepon Penting', href: '/telepon-penting' },
			{ label: 'Jadwal Kereta Api Jur. Bandung', href: '/jadwal-kereta-api' },
			{ label: 'Jadwal Penerbangan', href: '/jadwal-penerbangan' }
		]
	},
	{ label: 'Contact Us', href: '/#kontak' },
	{ label: 'Link', href: '/link' },
	{ label: 'HKI', href: '/hki' },
	{ label: 'Online Publication', href: '/online-publication' }
];

/**
 * Sub-sistem internal DTP (kartu di section Sistem + daftar di menu mobile).
 * Ganti `href` ke URL DNS sistem asli begitu siap, dan set external: true.
 */
export const SYSTEMS: SystemLink[] = [
	{
		id: 'doa',
		label: 'DOA',
		href: 'http://portalditek.indonesian-aerospace.com/webdoa/',
		icon: 'document.svg',
		logo: '/gambar/sistem/doa.png'
	},
	{
		id: 'dotproject',
		label: 'dotProject',
		href: 'http://portalditek.indonesian-aerospace.com/dotproject/',
		icon: 'case.svg',
		logo: '/gambar/sistem/dotproject.png'
	},
	{
		id: 'siedm',
		label: 'SIEDM',
		href: 'http://siedm.indonesian-aerospace.com/',
		icon: 'engineering standard.svg',
		logo: '/gambar/sistem/siedm.png'
	},
	{
		id: 'certificate',
		label: 'Certification',
		href: 'http://portalditek.indonesian-aerospace.com/certification/',
		icon: 'certificate.svg',
		logo: '/gambar/sistem/certificate.png'
	},
	{
		id: 'telepon',
		label: 'Telepon Penting',
		href: '/telepon-penting',
		icon: 'number.svg',
		logo: '/gambar/sistem/telepon.png'
	}
];
