/** Item navigasi utama. Bisa bertingkat lewat `children`. */
export type NavItem = {
	label: string;
	/** Anchor (#id / /#id) di landing atau route penuh. Kosong = parent/menu atau item "segera". */
	href?: string;
	/** true = link ke section di landing. */
	anchor?: boolean;
	/** true = buka di tab baru (link eksternal). */
	external?: boolean;
	/** true = halaman belum dibangun → tampil redup & tidak bisa diklik. */
	soon?: boolean;
	/** Sub-menu (boleh bertingkat). */
	children?: NavItem[];
};

/** Sub-sistem yang diakses lewat Portal (integrasi via DNS). */
export type SystemLink = {
	id: string;
	label: string;
	/** Route internal (halaman placeholder) ATAU URL DNS sistem asli. */
	href: string;
	/** Nama file icon SVG di /static, atau nama lucide (dipakai di M3). */
	icon?: string;
	/** Logo aplikasi (di static/gambar/sistem/). Fallback ke monogram bila tidak ada. */
	logo?: string;
	external?: boolean;
};
