# Portal DTP · PT Dirgantara Indonesia

Portal internal Direktorat Teknologi dan Pengembangan, revamp dari static HTML template BootstrapMade "Impact" ke **SvelteKit + TypeScript**.

## Stack

- **SvelteKit 2** + **Svelte 5** (rune-based)
- **TypeScript** (strict)
- **Tailwind CSS v4** (+ `tw-animate-css`)
- **shadcn-svelte** (ditambahkan mulai M2)
- **`@sveltejs/adapter-static`** — output HTML statis, siap di-serve di server HTTP biasa
- **Inter Variable** (body) + **IBM Plex Sans** (display) — self-hosted, tidak fetch Google Fonts

## Prasyarat

- Node.js **≥ 20**
- npm **≥ 10**

## Setup

```bash
npm install
npm run dev
```

Buka http://localhost:5173.

## Perintah

| Perintah | Kegunaan |
|---|---|
| `npm run dev` | Dev server dengan HMR |
| `npm run build` | Build production ke `build/` |
| `npm run preview` | Preview hasil build lokal |
| `npm run check` | Type check (svelte-check) |
| `npm run lint` | Cek ESLint + Prettier |
| `npm run format` | Format code dengan Prettier |

## Deploy

Karena adapter-static, hasil build adalah HTML biasa:

```bash
npm run build
# Output: build/
```

Upload isi folder `build/` ke document root server HTTP internal (nginx/apache/IIS). Tidak butuh Node.js runtime di server.

## Struktur

```
src/
├── app.html              # shell HTML
├── app.css               # design tokens (Tailwind v4 + OKLCH)
├── app.d.ts
├── lib/
│   ├── config/
│   │   ├── site.ts       # nama direktorat, kontak, jam kerja, social
│   │   └── mail.ts       # URL form Quick Login Email Internal
│   └── utils.ts          # cn() helper untuk merge Tailwind classes
└── routes/
    ├── +layout.svelte    # shell (topbar/header/footer akan masuk sini di M2)
    ├── +layout.ts        # prerender = true, trailingSlash = 'always'
    └── +page.svelte      # landing page

static/                   # asset statis (favicon, logo, gambar)
```

## Business logic yang dipreserve

Poin-poin berikut tidak berubah perilakunya dibanding Portal lama:

- **Form Quick Login Email Internal** — POST ke `https://10.1.0.6/`, tab baru, field `loginname` & `password`. URL di `src/lib/config/mail.ts`.
- **Modal Kalender** — iframe Google Calendar. `calendarIframeSrc` di `src/lib/config/site.ts`.
- **Modal Pengumuman** — konten akan dipindah ke JSON di M3 (`src/lib/data/announcements.json`).
- **Link keluar** — `indonesian-aerospace.com` dan social media official PTDI.

## Design tokens

Semua warna, radius, typography scale dideklarasikan sebagai **CSS variables** di `src/app.css`, lalu di-map ke utility Tailwind lewat `@theme inline`.

Untuk **rebrand**:
1. Ubah `--brand` dan `--brand-foreground` di `:root` — semua `bg-primary`, `text-primary`, dst. ikut berubah.
2. Kalau perlu palette lengkap baru, ganti scale OKLCH neutral di `:root` dan `.dark`.

Untuk **dark mode**: tambahkan class `dark` ke `<html>`. Toggle disediakan di M5.

## Roadmap

- [x] **M1** — Bootstrap SvelteKit + design system
- [ ] **M2** — Layout shell (topbar, header, mobile nav, footer)
- [ ] **M3** — Landing page (hero, about, features, info panel, news, contact + Quick Mail Login)
- [ ] **M4** — Halaman sub placeholder (dashboard/doa/dotproject/siedm/telepon/certificate — integrasi via DNS)
- [ ] **M5** — Endpoint content JSON, dark mode toggle, a11y polish, redirect URL lama

## Konvensi

- **Alias**: `$lib` untuk `src/lib`. Import contoh: `import { SITE } from '$lib/config/site';`
- **Halaman baru** auto di-prerender kecuali `export const prerender = false;`
- **Endpoint API** future memakai prefix `-` (mis. `/-content/articles`) supaya tidak tabrakan dengan halaman
- **Warna hardcoded di komponen DILARANG** — selalu lewat token (`bg-primary`, `text-muted-foreground`, dst.)
- **`!important` di kelas Tailwind DIHINDARI** — kalau butuh, tambahkan variant di primitive yang bersangkutan

## Todo pertama (konfirmasi konten)

Beberapa placeholder di `src/lib/config/site.ts` yang perlu kamu isi/koreksi sebelum M3:

1. **Email direktorat** — Portal lama pakai `kevin@indonesian-aerospace.com` (sepertinya personal). Ganti dengan email resmi direktorat.
2. **Nomor telepon** — Portal lama menuliskan `+91 7218512152` (kode negara India). Ganti dengan nomor operator resmi PT DI.
3. **Calendar ID** — Portal lama pakai placeholder `yourcalendarid`. Sementara Portal baru pakai kalender hari libur Indonesia; ganti kalau kalender direktorat sudah tersedia.

Sisanya akan muncul saat M3 (nama sub-sistem di feature grid, artikel/agenda/download hardcoded awal, dsb).

## Lisensi

Internal PT Dirgantara Indonesia.
