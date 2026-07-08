import type { NavItem, SystemLink } from '$lib/types/nav';
import onOpenCalendar from '$lib/components/layout/topbar.svelte';

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
			{ label: 'Berita Utama', href: '/#berita' },
			{ label: 'Berita', href: '/#berita' },
			{ label: 'Artikel', href: '/#informasi' },
			{ label: 'Download', href: '/#informasi' }
		]
	},
	{
		label: 'Profil',
		children: [
			{ label: 'Organisasi', soon: true },
			{
				label: 'Capability',
				children: [
					{ label: 'Brainware', soon: true },
					{ label: 'CAD/CAM', soon: true },
					{ label: 'Software Development', soon: true }
				]
			},
			{
				label: 'Project',
				children: [{ label: 'N219', soon: true }]
			},
			{
				label: 'SDM',
				children: [
					{ label: 'Personil', soon: true },
					{ label: 'JDQ', soon: true }
				]
			},
			{
				label: 'Kerjasama Teknologi',
				children: [
					{ label: 'Experience', soon: true },
					{ label: 'Kerjasama Teknologi', soon: true },
					{ label: 'PT DI - Hankam', soon: true }
				]
			},
			{
				label: 'Fasilitas',
				children: [
					{ label: 'Ground Test', soon: true },
					{ label: 'Flight Test', soon: true }
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
			{ label: 'Kalender Kerja', onClick: () => { onOpenCalendar(); } },
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
		href: 'http://portalditek.indonesian-aerospace.com/webdoa/',
		icon: 'document.svg'
	},
	{
		id: 'dotproject',
		label: 'DotProject',
		description: 'Manajemen proyek dan penjadwalan tim.',
		href: 'http://portalditek.indonesian-aerospace.com/dotproject/',
		icon: 'case.svg'
	},
	{
		id: 'dashboard',
		label: 'Dashboard',
		description: 'Ringkasan indikator dan aktivitas direktorat.',
		href: '/',
		icon: 'note.svg'
	},
	{
		id: 'siedm',
		label: 'SIEDM',
		description: 'Sistem Informasi Engineering Data Management.',
		href: 'http://siedm.indonesian-aerospace.com/',
		icon: 'engineering standard.svg'
	},
	{
		id: 'certificate',
		label: 'Certificate',
		description: 'Manajemen sertifikasi produk dan proses.',
		href: 'http://portalditek.indonesian-aerospace.com/certificate/',
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
