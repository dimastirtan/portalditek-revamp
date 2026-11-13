/**
 * Alamat web IMS (Intelligent Management System R&D) untuk tautan "Buka di IMS".
 * Data yang tampil di portal dibaca langsung dari DB IMS (lihat $lib/server/ims);
 * detail dokumen & penanggung jawab tetap hanya di IMS (perlu login di sana).
 *
 * Override lewat PUBLIC_IMS_URL di .env tanpa rebuild — cukup restart server.
 */
import { env } from '$env/dynamic/public';

export const IMS_URL = (env.PUBLIC_IMS_URL?.trim() || 'http://10.1.95.116:81').replace(
	/\/+$/,
	''
);

/**
 * Folder gambar program (kolom programs.image). Default: salinan di
 * static/gambar/ims/assets/images. Bila folder upload IMS berubah, arahkan
 * PUBLIC_IMS_IMAGE_URL ke folder itu (mis. http://10.1.95.116:81/assets/images
 * — gambar IMS bisa diambil tanpa login).
 */
export const IMS_IMAGE_URL = (
	env.PUBLIC_IMS_IMAGE_URL?.trim() || '/gambar/ims/assets/images'
).replace(/\/+$/, '');

/** URL gambar dari nilai kolom image — hanya nama file-nya yang dipakai. '' bila kosong. */
export function imsImageUrl(image: string | null | undefined): string {
	const file = (image ?? '').trim().split(/[/\\]/).pop() ?? '';
	return file ? `${IMS_IMAGE_URL}/${encodeURIComponent(file)}` : '';
}

/** Halaman daftar proyek satu program di IMS (parameter = program_name). */
export const imsProgramUrl = (name: string) =>
	`${IMS_URL}/projects.php?program=${encodeURIComponent(name)}`;

/** Halaman detail proyek (tahap + dokumen) di IMS. */
export const imsProjectUrl = (id: number) => `${IMS_URL}/project_detail.php?id=${id}`;
