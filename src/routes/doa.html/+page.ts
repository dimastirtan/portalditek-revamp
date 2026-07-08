import { redirect } from '@sveltejs/kit';
export const prerender = true;
export const trailingSlash = 'ignore';
export function load() {
	redirect(308, '10.1.95.116:8081');
}
