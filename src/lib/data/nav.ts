import type { NavItem, SystemLink } from '$lib/types/nav';
import { LEGACY } from '$lib/config/legacy';
import { IMS_URL } from '$lib/config/ims';

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
		label: 'Media',
		children: [
			{ label: 'Headlines', href: '/berita-utama' },
			{ label: 'News', href: '/berita' }
			// Articles & Downloads dihapus (2026-11-23): Information center kini hanya buletin.
		]
	},
	{
		label: 'Profile',
		children: [
			{ label: 'Organization', href: '/organisasi' },
			{ label: 'Capability', href: '/capability' },
			{
				label: 'Project',
				children: [
					{ label: 'R&D Programs', href: '/program' },
					{ label: 'N219', href: '/project' }
				]
			},
			{
				label: 'Human Resources',
				children: [
					{ label: 'Personnel', href: '/personil' },
					{ label: 'JDQ', href: '/jdq' }
				]
			},
			{ label: 'Technology Cooperation', href: '/kerjasama' },
			{ label: 'Facilities', href: '/fasilitas' }
		]
	},
	{ label: 'Command Media', href: '/command-media' },
	{ label: 'Certificate', href: '/oc' },
	{ label: 'Regulation', href: '/regulation' },
	{
		label: 'Information',
		children: [
			{ label: 'Work Calendar', href: '/kalender-kerja' },
			{ label: 'Phone Numbers', href: '/telepon-penting' },
			{ label: 'Bandung Train Schedule', href: '/jadwal-kereta-api' },
			{ label: 'Flight Schedule', href: '/jadwal-penerbangan' }
		]
	},
	{ label: 'Link', href: '/link' },
	{ label: 'Contact Us', href: '/#kontak' },
	{ label: 'Library', href: '/library' }
];

/**
 * Sub-sistem internal DTP (kartu di section Sistem + daftar di menu mobile).
 * Alamat sistem yang di-host di server portal lama diatur di $lib/config/legacy.
 */
export const SYSTEMS: SystemLink[] = [
	{
		id: 'doa',
		label: 'DOA',
		href: LEGACY.doa,
		icon: 'document.svg',
		logo: '/gambar/umum/logo43.png'
	},
	{
		id: 'dotproject',
		label: 'dotProject',
		href: LEGACY.dotproject,
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
		id: 'ims',
		label: 'IMS',
		href: IMS_URL,
		icon: 'case.svg',
		logo: '/gambar/sistem/ims.svg'
	},
	{
		id: 'telepon',
		label: 'Phone Numbers',
		href: '/telepon-penting',
		icon: 'number.svg',
		logo: '/gambar/sistem/telepon.png'
	}
];
