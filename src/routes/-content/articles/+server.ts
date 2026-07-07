import { json } from '@sveltejs/kit';
import articles from '$lib/data/articles.json';

// Prerender ke file JSON statis saat build.
export const prerender = true;

export function GET() {
	return json(articles);
}
