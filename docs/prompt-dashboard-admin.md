# Prompt: sesi Claude Code untuk Dashboard Admin Portal DITTEK

> Cara pakai: buat folder baru (mis. `E:\Playground\portal-admin`), buka sesi Claude Code
> di sana, lalu tempel semua teks di bawah garis.

---

Kamu akan membuat **dashboard admin** (aplikasi terpisah) untuk mengelola konten **Portal
Direktorat Teknologi dan Pengembangan PT Dirgantara Indonesia**. Bicara dengan saya dalam
Bahasa Indonesia. **Jangan langsung menulis kode** — baca konteks di bawah, periksa repo
portal & struktur tabel, lalu ajukan rencana singkat dan tunggu persetujuan saya.

## Prinsip utama: ringan & cepat
Dipakai beberapa admin di jaringan internal, sebagian masih di Windows 7/8.1 (Chrome/Edge 109).
- Halaman dirender server, form biasa + SvelteKit form actions (tetap jalan tanpa JS).
  Tanpa state management, tanpa library UI/komponen berat, tanpa rich-text editor.
- Daftar data: paginasi di server (25 baris), pencarian lewat query string, hanya kolom
  yang perlu.
- Isi berita cukup `<textarea>` teks polos — portal sudah merender teks polos per baris
  sebagai paragraf (lihat "Kontrak dengan portal").
- Gambar unggahan dikecilkan di server sebelum disimpan (mis. sisi panjang maks. 1920 px
  untuk headline, 1600 px untuk poster buletin; JPEG/WebP ±80%). Jangan simpan foto kamera
  2–5 MB apa adanya — portal dibuka banyak orang.

## Stack (samakan dengan portal supaya schema & pola bisa dipakai ulang)
SvelteKit 2 + Svelte 5 (runes), `@sveltejs/adapter-node`, Tailwind v4, Drizzle ORM + mysql2,
Node 24. Jalan di server Linux yang sama dengan portal (`ptdi@n219-web1`, portal di
`~/portal`) lewat **pm2** (nama app mis. `portal-admin`, port bebas — cek dulu `ss -tlnp`).
- **Chrome 109 tidak mendukung oklch / color-mix / CSS nesting** (dipakai Tailwind v4).
  Salin plugin `scripts/postcss-legacy-colors.js` dari portal + pasang seperti di
  `vite.config.ts` portal (`css.postcss.plugins`).
- `ORIGIN` wajib diisi di `.env` production (tanpa itu adapter-node menganggap https).
- Contoh konfigurasi pm2: `ecosystem.config.cjs` di repo portal.

## Repo portal (referensi, BACA SAJA — jangan diubah dari sesi ini)
`E:\Playground\portal-clean` (branch `develop`). File yang wajib dibaca:
- `src/lib/server/db/schema.ts` — schema Drizzle tabel lama (salin yang perlu).
- `src/lib/server/db/index.ts` — koneksi: kolom lama ber-charset **latin1** berisi byte
  UTF-8; koneksi pakai utf8mb4 + `fixText()` membersihkan mojibake saat dibaca.
- `src/lib/server/portal/queries.ts` — **kolom mana yang dipakai portal & bagaimana**
  (`getHeadlines`, `getOrgStructure`/`orgPhoto`, `getLinks`, `getTelepon`, dst.).
  Apa pun yang ditulis dashboard harus tetap terbaca benar oleh query ini.
- `src/lib/server/portal/transform.ts` — `cleanRichHtml`, `stripHtml`, `fixText`,
  `dropLeadingTitle` (cara isi konten diolah sebelum tampil).
- `src/lib/server/uploads.ts` — kontrak folder unggahan (kalender, buletin, headline, org).
- `src/routes/api/cache/+server.ts` — endpoint pengosongan cache yang dipanggil dashboard.
- `src/lib/server/cache.ts`, `README.md`, `.env.example`.

## Database
MySQL `dittek` di `10.1.95.116:3306` — skema warisan portal PHP lama (tabel `tm*`, kolom
`N_*`/`C_*`/`D_*`, sebagian huruf kecil). Banyak data lama berisi HTML mentah & mojibake.
- Sebelum menulis apa pun: `SHOW CREATE TABLE` untuk tabel modul di bawah (charset, kolom
  wajib, default, auto increment, kolom audit seperti `I_ENTRY`/`D_ENTRY`).
- Minta saya membuat **user MySQL khusus dashboard** dengan hak SELECT/INSERT/UPDATE/DELETE
  hanya pada tabel modul di bawah — bukan root. Tuliskan SQL GRANT-nya untuk saya jalankan.
- Sarankan `mysqldump` tabel-tabel itu sebelum uji tulis pertama.
- Uji bolak-balik karakter (kutip lengkung “ ”, em dash —, é) setelah simpan → harus
  tampil benar di portal, bukan mojibake/`?`. Emoji tidak didukung latin1 — tolak/bersihkan.
- Tanggal: `'0000-00-00'` dianggap kosong oleh portal; simpan tanggal valid.
- DB IMS (`ptdi_project`, port 3307) **di luar cakupan** — read-only milik aplikasi IMS.

## Modul (hanya ini)
| Modul | Penyimpanan | Tampil di portal |
|---|---|---|
| Headline / Berita Utama | tabel `tmmainarticle` (berita induk) + `tmmainarticledet` (tiap headline: judul, tanggal, isi) | hero beranda (5 terbaru), `/berita-utama`, detail `/berita-utama/<id>` |
| Struktur organisasi | tabel `tmorg` (pimpinan `C_TYPE_ORG`=0, divisi =1) + `tmorgdet` (departemen) + foto pejabat; nama pejabat dari `tmemp` lewat NIK (pilih, jangan ketik bebas) | `/organisasi` |
| Link | tabel `tmlink` | `/link` |
| Telepon penting | tabel `tmtelp` | `/telepon-penting` |
| Kalender kerja | folder `UPLOAD_DIR/kalender/` (tanpa tabel) | `/kalender-kerja`, panel Calendar di topbar |
| Buletin | folder `UPLOAD_DIR/buletin/` (tanpa tabel) | Information center beranda: 3 kartu poster terbaru, klik = popup layar penuh (bagian ini hanya berisi buletin) |

Urutan kerja yang disarankan: buat **satu modul end-to-end dulu** (Link atau Telepon — paling
sederhana) untuk memantapkan pola login + list + form + hapus, saya cek, baru Headline,
Struktur organisasi, Kalender, Buletin.

## Kontrak dengan portal (sudah didukung portal)
- `UPLOAD_DIR` = folder unggahan portal, default `~/portal/uploads` di server. Dashboard
  berjalan di server yang sama, jadi menulis langsung ke folder itu (jadikan path-nya
  variabel env dashboard). Berkas di sana tampil di portal **tanpa build ulang**.
- **Kalender kerja**: simpan gambar (.jpg/.png/.webp) ke `UPLOAD_DIR/kalender/`. Portal
  menampilkan berkas yang **paling baru diubah** (mtime). CRUD: unggah baru, lihat riwayat,
  hapus; sediakan "jadikan aktif" (mis. sentuh mtime) bila ingin kembali ke versi lama.
- **Buletin**: poster gambar di `UPLOAD_DIR/buletin/`. Portal menampilkan **3 berkas
  terbaru** (mtime) sebagai 3 kartu; **judul = nama berkas tanpa ekstensi** (garis bawah
  jadi spasi), mis. `Cyber Security Bulletin #139.webp`. Disajikan portal lewat
  `/media/buletin/<nama berkas>`. CRUD: unggah (form: judul → nama berkas aman), ganti
  judul (= rename), ganti gambar, hapus, urutan = waktu unggah. Nama berkas tanpa `/`, `\`,
  dan tidak diawali titik.
- **Isi teks headline**: teks tanpa tag HTML → tiap baris jadi paragraf; baris pertama yang
  sama dengan judul dibuang. HTML tetap didukung tapi dibersihkan (`cleanRichHtml`). Jangan
  sisipkan `<img>` ke isi teks polos — sekali ada tag HTML, isi diperlakukan sebagai HTML
  dan baris baru tidak lagi jadi paragraf.
- **Gambar headline**: simpan ke `UPLOAD_DIR/headline/<id headline>.<webp|jpg|png>`
  (id = `c_mainarticle_detail`, mis. `172.webp`; berkas terbaru menang bila ada beberapa
  ekstensi). Portal mendahulukan gambar ini, lalu `<img>` pertama di isi, lalu gambar berita
  induk. Tanpa kolom DB. Di hero gambar di-crop, di halaman detail utuh — minta admin
  mengunggah gambar landscape ≥ 1920 px (kecilkan ke maks. 1920 px saat simpan).
  Hapus headline → hapus juga berkas gambarnya.
- **Foto pejabat**: simpan foto ke `UPLOAD_DIR/org/<nama berkas>` **dan** thumbnail
  (sisi pendek ±168 px) ke `UPLOAD_DIR/org-thumb/<nama berkas yang sama>`, lalu tulis
  `<nama berkas>` ke kolom foto `tmorg`/`tmorgdet`. Portal: unggahan thumbnail → unggahan
  asli → foto lama di `static/`. Pakai nama unik (mis. `<nik>-<timestamp>.webp`) supaya
  tidak menimpa foto lama tanpa sengaja. Kosongkan kolom = tanpa foto (`blank.jpg` juga
  dianggap kosong).
- **Pengosongan cache**: data DB di-cache di memori portal (`CACHE_TTL_SECONDS`, default
  300 s). Setelah setiap simpan/hapus, panggil
  `POST http://127.0.0.1:<port portal>/api/cache` dengan header
  `Authorization: Bearer <CACHE_CLEAR_TOKEN>` (token sama di `.env` portal & dashboard; isi
  di `.env` portal kosong = endpoint mati). Respons `{ ok, cleared }`. Gagal memanggil tidak
  boleh menggagalkan simpan — tampilkan peringatan "perubahan tampil maks. 5 menit lagi".
  Kalender & buletin tidak kena cache (dibaca langsung dari folder).
- Semua folder unggahan selain kalender disajikan portal lewat `/media/<folder>/<file>`;
  nama berkas tanpa `/`, `\`, dan tidak diawali titik.

Jangan mengubah repo portal dari sesi ini. Bila butuh perubahan di portal, tuliskan
spesifikasinya untuk saya bawa ke sesi portal.

## Keamanan
- Login wajib. Mulai sederhana: daftar admin di `.env` (username + hash bcrypt/argon2),
  sesi cookie httpOnly + SameSite=Strict, batasi percobaan login. Semua route di belakang
  login (hooks.server.ts).
- Validasi semua input di server; unggahan: cek tipe dari isi berkas (bukan ekstensi saja),
  batas ukuran, nama berkas disanitasi.
- Hapus = konfirmasi dulu; catat log siapa mengubah apa (cukup ke file/console dulu).
- `.env` tidak pernah di-commit. Repo portal di GitHub bersifat **public** — repo dashboard
  sebaiknya private, dan jangan menyalin kredensial ke kode.

## Git & alur kerja
- Commit hanya kalau saya minta. **Jangan `git push`** kecuali saya minta di pesan itu
  (firewall kantor sering memblokir GitHub).
- Verifikasi setiap modul di browser sebelum bilang selesai; jalankan `svelte-check` & lint.

## Langkah pertama
1. Baca file portal di atas dan `SHOW CREATE TABLE` untuk `tmmainarticle`,
   `tmmainarticledet`, `tmorg`, `tmorgdet`, `tmemp` (kolom NIK & nama saja), `tmlink`, `tmtelp`.
2. Laporkan singkat: kolom tiap tabel yang akan diisi form, kolom yang dipakai portal,
   dan risiko (charset, kolom wajib tanpa default, relasi induk–anak).
3. Ajukan rencana: struktur route, skema login, cara unggah & kecilkan gambar, urutan
   modul. Tunggu "oke".
