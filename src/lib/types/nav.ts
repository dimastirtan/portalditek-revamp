/** Item navigasi utama. `href` bisa anchor (#id) di landing atau route penuh. */
export type NavItem = {
	label: string;
	href: string;
	/** true = link ke section di landing (pakai smooth scroll), false = route/eksternal. */
	anchor?: boolean;
	/** true = buka di tab baru (link eksternal). */
	external?: boolean;
};

/** Sub-sistem yang diakses lewat Portal (integrasi via DNS). */
export type SystemLink = {
	id: string;
	label: string;
	description: string;
	/** Route internal (halaman placeholder) ATAU URL DNS sistem asli. */
	href: string;
	/** Nama file icon SVG di /static, atau nama lucide (dipakai di M3). */
	icon?: string;
	external?: boolean;
};
