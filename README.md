# Portal DTP · PT Dirgantara Indonesia

Portal internal Direktorat Teknologi dan Pengembangan (DTP), revamp dari portal PHP lama ke **SvelteKit + TypeScript**, dengan konten dibaca **live dari database MySQL lama (`dittek`)**.

## Stack

- **SvelteKit 2** + **Svelte 5** (rune-based) · **TypeScript**
- **Tailwind CSS v4** (+ `tw-animate-css`) · **shadcn-svelte**
- **`@sveltejs/adapter-node`** — SSR, dijalankan sebagai Node server (`node build`)
- **Drizzle ORM** + **mysql2** — baca database `dittek` (skema di `src/lib/server/db/schema.ts`)
- **Inter Variable** (body) + **IBM Plex Sans** (display) — self-hosted, tidak fetch Google Fonts

## Prasyarat

- Node.js **≥ 20**, npm **≥ 10**
- **MySQL** berisi database `dittek` (dump portal lama), reachable dari mesin yang menjalankan app

## Setup

```bash
npm install
cp .env.example .env   # lalu isi kredensial DB
npm run dev
```

Buka http://localhost:5173.

### Environment (`.env`)

| Variabel | Default | Keterangan |
|---|---|---|
| `DB_HOST` | `127.0.0.1` | host MySQL |
| `DB_PORT` | `3306` | port MySQL |
| `DB_USER` | `root` | user |
| `DB_PASSWORD` | *(kosong)* | password |
| `DB_NAME` | `dittek` | nama database |
| `FILES_DIR` | `./files` | folder berkas dokumen (hasil `npm run mirror-files`) |
| `PUBLIC_LEGACY_PORTAL_URL` | `http://10.1.95.116` | portal PHP lama (`download.php` cadangan, `certification/`) |
| `PUBLIC_DOA_URL` | `http://10.1.95.116:8081` | Web DOA |
| `PUBLIC_DOTPROJECT_URL` | `http://10.1.95.116:8083` | dotProject |
| `PUBLIC_DOA_LIBRARY_URL` | `http://10.1.95.116:8084/library` | DOA Library |

Variabel `PUBLIC_*` opsional (default di `src/lib/config/legacy.ts`) dan ikut terkirim ke browser — jangan isi rahasia. Ubah lalu restart server, tidak perlu rebuild.

`.env` **tidak** di-commit (sudah di-`.gitignore`). Modul DB (`src/lib/server/db`) hanya jalan di server, jadi kredensial tidak pernah ikut ke client.

## Perintah

| Perintah | Kegunaan |
|---|---|
| `npm run dev` | Dev server dengan HMR |
| `npm run build` | Build production ke `build/` |
| `npm run preview` | Preview hasil build lokal |
| `npm start` | Jalankan hasil build (membaca `.env`) |
| `npm run mirror-files` | Salin berkas dokumen dari portal lama ke `FILES_DIR` (`-- --dry-run` untuk cek saja) |
| `npm run check` | Type check (svelte-check) |
| `npm run lint` | Cek ESLint + Prettier |
| `npm run format` | Format code dengan Prettier |

## Deploy

Pakai `adapter-node`, jadi butuh **Node.js runtime + akses ke MySQL `dittek`** (bukan static hosting):

```bash
npm run build          # output ke build/
npm start              # = node --env-file=.env build
```

`node build` **tidak** membaca `.env` sendiri — pakai `npm start` (butuh `.env` di root project) atau set variabelnya langsung di environment server. Port default `3000`, bisa di-override lewat env `PORT`.

Di server yang sama, jalankan `npm run mirror-files` minimal sekali (± 1,8 GB) supaya berkas dokumen tersimpan di `FILES_DIR`. Ulangi berkala selama admin masih meng-upload lewat dt-admin portal lama — berkas yang sudah ada dilewati.

## Data & arsitektur

- Konten (berita, artikel, agenda, unduhan, organisasi, dst.) dibaca **live dari MySQL** tiap request lewat query di `src/lib/server/portal/queries.ts`. Homepage `prerender = false`.
- Data lama sering mengandung mojibake Windows-1252 + HTML mentah; dibersihkan di `src/lib/server/portal/transform.ts` (`fixText`, `stripHtml`, `cleanRichHtml`).
- Berkas dokumen (artikel, download, agenda, JDQ, OC, Online Publication) diunduh lewat endpoint `/unduh/<kategori>/<file>` (`src/routes/unduh`), yang membaca `FILES_DIR/<kategori>/<file>`. Bila berkas belum disalin, endpoint mengambilnya dari `download.php` portal lama selama server itu masih hidup; setelah server lama mati, berkas yang belum disalin → 404.
- Alamat server portal lama & sub-sistem (DOA, dotProject, Certification, DOA Library) terpusat di `src/lib/config/legacy.ts`. Server lama 10.1.95.76 akan di-disable; default sudah ke 10.1.95.116.
- Bila DB tidak terjangkau, tiap `load` menangkap error dan mengembalikan data kosong (section tampil kosong, bukan error 500).

## Struktur

```
src/
├── app.html, app.css        # shell + design tokens (Tailwind v4 + OKLCH)
├── lib/
│   ├── config/              # site.ts (identitas/kontak), mail.ts (Quick Login), legacy.ts (alamat server lama)
│   ├── components/          # layout/, home/, shared/, ui/ (shadcn)
│   ├── server/
│   │   ├── db/              # index.ts (koneksi pool), schema.ts (tabel dittek)
│   │   └── portal/          # queries.ts (baca DB), transform.ts (bersihin data)
│   ├── types/               # content.ts, nav.ts
│   ├── data/nav.ts          # struktur menu + daftar sistem
│   └── utils.ts             # cn(), formatDate(), imgUrl(), downloadUrl()
└── routes/
    ├── +layout.svelte       # topbar + header + footer + modal kalender/pengumuman
    ├── +page.svelte         # landing (hero, sistem, berita, info, ultah, kontak)
    ├── [system]/            # halaman sistem (doa/dotproject/siedm/certificate/telepon)
    ├── unduh/               # endpoint unduh berkas dokumen (FILES_DIR → cadangan portal lama)
    └── ...                  # berita, berita-utama, profil, oc, regulation, library, dll.
static/                      # favicon, logo, gambar/ (foto org, artikel, dsb.)
```

## Business logic yang dipreserve

- **Quick Login Email Internal** — POST ke webmail internal, tab baru. URL di `src/lib/config/mail.ts`.
- **Modal Kalender & Pengumuman** — kalender iframe + pengumuman (dari tabel `tminfo`).
- **Link keluar** — sistem internal (webdoa/dotproject/siedm) + social media official PTDI.

## Design tokens

Warna, radius, dan skala tipografi dideklarasikan sebagai **CSS variables** di `src/app.css`, lalu di-map ke utility Tailwind lewat `@theme inline`. Rebrand: ubah `--brand` / `--brand-foreground` di `:root`. Dark mode: class `dark` pada `<html>` (toggle di topbar).

## Konvensi

- **Alias** `$lib` → `src/lib`.
- **Warna hardcoded di komponen DILARANG** — selalu lewat token (`bg-primary`, `text-muted-foreground`, dst.).
- Query DB baru → tambahkan di `src/lib/server/portal/queries.ts`, tipenya di `src/lib/types/content.ts`.

## Catatan

Beberapa placeholder di `src/lib/config/site.ts` masih perlu dikonfirmasi (email & nomor telepon resmi direktorat, Calendar ID).

## Lisensi

Internal PT Dirgantara Indonesia.
