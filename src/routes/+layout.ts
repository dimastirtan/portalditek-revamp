// Default: halaman di-render di server (SSR, adapter-node) agar konten DB selalu
// terbaru. Route yang benar-benar statis bisa opt-in `export const prerender = true`.
export const prerender = false;

// Trailing slash konsisten agar output berupa `route/index.html` yang aman
// di semua static host (nginx, apache, IIS, Cloudflare Pages, dll).
export const trailingSlash = 'always';
