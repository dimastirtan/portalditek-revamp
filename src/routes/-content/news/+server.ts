import { json } from '@sveltejs/kit';
import data from '$lib/data/news.json';

// Prerender ke file JSON statis saat build.
export const prerender = true;

export function GET() {
	return json(data);
}
