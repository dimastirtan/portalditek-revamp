# Portal DTP · PT Dirgantara Indonesia

Portal internal Direktorat Teknologi dan Pengembangan (DTP), revamp dari portal PHP lama ke **SvelteKit + TypeScript**, dengan konten dibaca **live dari database MySQL lama (`dittek`)**.

## Stack

- **SvelteKit 2** + **Svelte 5** (rune-based) · **TypeScript**
- **Tailwind CSS v4** (+ `tw-animate-css`) · **shadcn-svelte**
- **`@sveltejs/adapter-node`** — SSR, dijalankan sebagai Node server (`node build`)
- **Drizzle ORM** + **mysql2** — baca database `dittek` (skema di `src/lib/server/db/schema.ts`)
- **Inter Variable** (body) + **IBM Plex Sans** (display) — self-hosted, tidak fetch Google Fonts

## Prasyarat

- Node.js **24 LTS** (atau 26 LTS; minimal 20.19 / 22.12 — Node 20 sudah EOL), npm **≥ 10**
- Server: Windows 10/11 atau Windows Server 2016+ **64-bit** (atau Linux)
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
| `UPLOAD_DIR` | `./uploads` | unggahan admin yang tampil tanpa build ulang — `kalender/` gambar kalender kerja (yang tampil = berkas terbaru); `buletin/` poster buletin (3 terbaru di Information center, judul = nama berkas, disajikan lewat `/media/buletin/<file>`) |
| `CACHE_TTL_SECONDS` | `300` | lama data DB portal di-cache; perubahan admin tampil paling lambat setelah ini |
| `ORIGIN` | *(kosong)* | alamat publik portal, mis. `http://portalditek.indonesian-aerospace.com` (lihat Deploy) |
| `PORT` | `3000` | port server |
| `IMS_DB_HOST` | *(kosong)* | host MySQL IMS; kosong = bagian Program R&D disembunyikan |
| `IMS_DB_PORT` | `3306` | port MySQL IMS |
| `IMS_DB_USER` / `IMS_DB_PASSWORD` | *(kosong)* | user **read-only** IMS (lihat di bawah) |
| `IMS_DB_NAME` | `ptdi_project` | database IMS |
| `PUBLIC_IMS_URL` | `http://10.1.95.116:81` | web IMS untuk tautan "Buka di IMS" |
| `PUBLIC_IMS_IMAGE_URL` | `/gambar/ims/assets/images` | folder gambar program; nama file diambil dari kolom `programs.image`. Arahkan ke folder upload IMS bila ingin ikut IMS langsung |
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

Di server dijalankan dengan **pm2** lewat `ecosystem.config.cjs` (membaca `.env` sama seperti `npm start`):

```bash
pm2 start ecosystem.config.cjs   # pertama kali, lalu: pm2 save
pm2 restart portal-ditek         # setelah git pull + npm ci + npm run build, atau setelah ubah .env
pm2 logs portal-ditek
```

Di server yang sama, jalankan `npm run mirror-files` minimal sekali (± 1,8 GB) supaya berkas dokumen tersimpan di `FILES_DIR`. Ulangi berkala selama admin masih meng-upload lewat dt-admin portal lama — berkas yang sudah ada dilewati.

### Checklist sebelum go-live

1. **`.env` production** di root project: `DB_*` ke MySQL `dittek`, dan `IMS_DB_*` ke MySQL IMS (`ptdi_project`, web IMS di `http://10.1.95.116:81`). `IMS_DB_HOST=127.0.0.1` hanya benar bila portal berjalan **di server yang sama** dengan DB IMS (10.1.95.116) — dari mesin lain pakai `10.1.95.116` dengan user yang boleh login dari jaringan. Disarankan **user read-only** (SQL GRANT di bagian Data & arsitektur), bukan `root`.
2. **`ORIGIN`** = alamat yang diketik pengguna (mis. `http://portalditek.indonesian-aerospace.com`). Tanpa ini adapter-node menganggap alamatnya `https://<host>`.
3. **Berkas dokumen**: `npm run mirror-files` di server ini; pastikan `FILES_DIR` (default `./files`) ikut dibackup.
4. **Jalankan sebagai service** supaya hidup lagi setelah restart/logoff — `pm2 start ecosystem.config.cjs` lalu `pm2 save` (di Windows, `pm2 startup` tidak tersedia: pakai `pm2-installer`/`pm2-windows-startup`, atau NSSM dengan program `node`, argumen `--env-file=.env build`, *startup directory* = folder project). Buka port (`PORT`) di Windows Firewall.
   Bila portal ini menggantikan portal lama di port 80: pindahkan container portal lama ke port lain (jangan dihapus dulu — dt-admin masih dipakai untuk input konten) dan isi `PUBLIC_LEGACY_PORTAL_URL` dengan alamat barunya. Folder `files/` (± 1,8 GB) tidak ikut git — salin manual atau jalankan `npm run mirror-files` di server.
5. **Cek dari jaringan server**: DB portal (`DB_HOST:3306`), DB IMS (`IMS_DB_HOST:3306`), dan portal lama (`PUBLIC_LEGACY_PORTAL_URL`) bisa dijangkau.

### Performa & ketahanan

- Data DB di-cache di memori (`src/lib/server/cache.ts`, TTL `CACHE_TTL_SECONDS`; IMS 15 menit). Request bersamaan berbagi satu query.
- Bila DB tidak terjangkau: koneksi gagal dalam 3 detik, data terakhir tetap ditampilkan, dan percobaan ulang ditahan 1 menit — portal tidak ikut lambat.
- Uji beban lokal (50 pengguna bersamaan): beranda ± 200 request/detik, 0 gagal; saat DB mati tetap ± 300 request/detik, 0 gagal.
- Header keamanan dasar dipasang di `src/hooks.server.ts`.

## Data & arsitektur

- Konten (berita, artikel, agenda, unduhan, organisasi, dst.) dibaca dari MySQL lewat query di `src/lib/server/portal/queries.ts`, di-cache per halaman di loader (`cached()` dari `src/lib/server/cache.ts`). Homepage `prerender = false`.
- Data lama sering mengandung mojibake Windows-1252 + HTML mentah; dibersihkan di `src/lib/server/portal/transform.ts` (`fixText`, `stripHtml`, `cleanRichHtml`).
- Berkas dokumen (artikel, download, agenda, JDQ, OC, Online Publication) diunduh lewat endpoint `/unduh/<kategori>/<file>` (`src/routes/unduh`), yang membaca `FILES_DIR/<kategori>/<file>`. Bila berkas belum disalin, endpoint mengambilnya dari `download.php` portal lama selama server itu masih hidup; setelah server lama mati, berkas yang belum disalin → 404.
- Alamat server portal lama & sub-sistem (DOA, dotProject, Certification, DOA Library) terpusat di `src/lib/config/legacy.ts`. Server lama 10.1.95.76 akan di-disable; default sudah ke 10.1.95.116.
- Bila DB tidak terjangkau, tiap `load` menangkap error dan mengembalikan data kosong (section tampil kosong, bukan error 500).
- **Program R&D** (section beranda, `/program`, `/program/[slug]`) dibaca dari DB IMS `ptdi_project` (`src/lib/server/ims`), di-cache 15 menit; bila IMS gagal, data terakhir tetap dipakai. Hanya ringkasan sampai level tahap sertifikasi + jumlah dokumen — judul dokumen dan nama penanggung jawab tetap di IMS. Minta pemilik IMS membuat user read-only khusus tabel yang dipakai (tabel `admins` tidak perlu):

  ```sql
  CREATE USER 'portal_ro'@'<IP server portal>' IDENTIFIED BY '<password kuat>';
  GRANT SELECT ON ptdi_project.programs TO 'portal_ro'@'<IP server portal>';
  GRANT SELECT ON ptdi_project.projects TO 'portal_ro'@'<IP server portal>';
  GRANT SELECT ON ptdi_project.project_stages TO 'portal_ro'@'<IP server portal>';
  GRANT SELECT ON ptdi_project.project_documents TO 'portal_ro'@'<IP server portal>';
  ```

## Struktur

```
src/
├── app.html, app.css        # shell + design tokens (Tailwind v4 + OKLCH)
├── lib/
│   ├── config/              # site.ts (identitas/kontak), mail.ts (Quick Login), legacy.ts (alamat server lama)
│   ├── components/          # layout/, home/, shared/, ui/ (shadcn)
│   ├── server/
│   │   ├── db/              # index.ts (koneksi pool), schema.ts (tabel dittek)
│   │   ├── portal/          # queries.ts (baca DB), transform.ts (bersihin data)
│   │   └── ims/             # koneksi read-only + query DB IMS (Program R&D)
│   ├── types/               # content.ts, nav.ts
│   ├── data/nav.ts          # struktur menu + daftar sistem
│   └── utils.ts             # cn(), formatDate(), imgUrl(), downloadUrl()
└── routes/
    ├── +layout.svelte       # topbar + header + footer + modal kalender/pengumuman
    ├── +page.svelte         # landing (hero, sistem, berita, info, ultah, kontak)
    ├── [system]/            # halaman sistem (doa/dotproject/siedm/certificate/telepon)
    ├── unduh/               # endpoint unduh berkas dokumen (FILES_DIR → cadangan portal lama)
    ├── program/             # Program R&D dari DB IMS (indeks + [slug] detail proyek)
    └── ...                  # berita, berita-utama, profil, oc, regulation, library, dll.
static/                      # favicon, logo, gambar/ (foto org, artikel, dsb.)
```

## Business logic yang dipreserve

- **Quick Login Email Internal** — POST ke webmail internal, tab baru. URL di `src/lib/config/mail.ts`.
- **Modal Kalender & Pengumuman** — kalender iframe + pengumuman (dari tabel `tminfo`).
- **Link keluar** — sistem internal (webdoa/dotproject/siedm) + social media official PTDI.

## Design tokens

Warna, radius, dan skala tipografi dideklarasikan sebagai **CSS variables** di `src/app.css`, lalu di-map ke utility Tailwind lewat `@theme inline`. Rebrand: ubah `--brand` / `--brand-foreground` di `:root`. Dark mode: class `dark` pada `<html>` (toggle di topbar).

## Dukungan browser

| Pengguna | Browser | Status |
|---|---|---|
| Windows 10 / 11 | Edge, Chrome, Firefox terbaru | Normal |
| Windows 7 / 8 / 8.1 | Chrome / Edge 109 (versi terakhir di OS itu) | Didukung lewat warna cadangan (lihat bawah) |
| Windows 7 / 8 / 8.1 | Firefox 115 ESR | Didukung |
| Semua | Internet Explorer | Tidak didukung |

Chrome/Edge < 111 belum mengenal `oklch()`, `color-mix()`, dan gradien `in oklab` yang dipakai Tailwind v4. Plugin PostCSS `scripts/postcss-legacy-colors.js` (dipasang di `vite.config.ts`) membuat cadangannya otomatis saat build:

- token OKLCH di `:root` / `.dark` → nilai `rgb()` di dalam `@supports not (color: oklch(0 0 0))`;
- tiap token dapat kanal `--x-rgb`, dipakai untuk opacity (`bg-primary/10` → `rgb(var(--primary-rgb) / 10%)`); cadangan bawaan Tailwind berupa warna penuh;
- gradien `to right in oklab` → `to right`.

Tetap tulis token dalam OKLCH di `src/app.css` — tidak perlu menulis warna dua kali. Yang **tidak** dapat cadangan: warna OKLCH langsung di class (`bg-[oklch(...)]`) — pakai token. Hanya build production yang didukung di browser lama (`npm run dev` memakai CSS nesting).

## Konvensi

- **Alias** `$lib` → `src/lib`.
- **Warna hardcoded di komponen DILARANG** — selalu lewat token (`bg-primary`, `text-muted-foreground`, dst.).
- Query DB baru → tambahkan di `src/lib/server/portal/queries.ts`, tipenya di `src/lib/types/content.ts`.

## Catatan

Beberapa placeholder di `src/lib/config/site.ts` masih perlu dikonfirmasi (email & nomor telepon resmi direktorat, Calendar ID).

## Lisensi

Internal PT Dirgantara Indonesia.
