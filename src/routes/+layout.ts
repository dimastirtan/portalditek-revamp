// Semua halaman di-prerender ke HTML statis saat build (adapter-static).
export const prerender = true;

// Trailing slash konsisten agar output berupa `route/index.html` yang aman
// di semua static host (nginx, apache, IIS, Cloudflare Pages, dll).
export const trailingSlash = 'always';
