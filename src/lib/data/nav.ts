import type { NavItem, SystemLink } from '$lib/types/nav';

/**
 * Navigasi utama Portal.
 *
 * Portal lama punya DUA navbar: top nav (6 item) + bottom pill nav penuh
 * dropdown dengan puluhan anchor mati (#organisasi, #capability, dst yang
 * tidak eksis). Untuk revamp, disederhanakan jadi SATU nav yang mengarah ke
 * section yang benar-benar ada di landing.
 *
 * Kalau nanti section-nya bertambah, tinggal tambah item di sini.
 */
export const MAIN_NAV: NavItem[] = [
	{ label: 'Beranda', href: '#beranda', anchor: true },
	{ label: 'Perusahaan', href: '#perusahaan', anchor: true },
	{ label: 'Sistem', href: '#sistem', anchor: true },
	{ label: 'Informasi', href: '#informasi', anchor: true },
	{ label: 'Berita', href: '#berita', anchor: true },
	{ label: 'Kontak', href: '#kontak', anchor: true }
];

/**
 * Sub-sistem internal DTP.
 *
 * Di Portal lama ini adalah kartu "portfolio" yang link ke halaman .html dummy
 * (dashboard.html, doa.html, dst — semuanya masih template BootstrapMade).
 *
 * Keputusan (M1): halaman placeholder tipis dulu; integrasi sistem asli via DNS.
 * Ganti `href` ke URL DNS begitu sistem asli siap, dan set external: true.
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
		id: 'dashboard',
		label: 'Dashboard DTP',
		description: 'Ringkasan indikator dan aktivitas direktorat.',
		href: '/dashboard',
		icon: 'note.svg'
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
