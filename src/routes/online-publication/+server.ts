import { redirect } from '@sveltejs/kit';
import type { RequestHandler } from './$types';

// Online Publication sudah digabung ke halaman Library. Alamat lama tetap jalan.
export const GET: RequestHandler = () => redirect(308, '/library/#publications');
