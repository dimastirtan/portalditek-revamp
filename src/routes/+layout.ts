// Default: halaman di-render di server (SSR, adapter-node) agar konten DB selalu
// terbaru. Halaman statis/redirect (mis. /[system], *.html) opt-in prerender
// sendiri lewat `export const prerender = true` di masing-masing route-nya.
export const prerender = false;

// Trailing slash konsisten agar output berupa `route/index.html` yang aman
// di semua static host (nginx, apache, IIS, Cloudflare Pages, dll).
export const trailingSlash = 'always';
