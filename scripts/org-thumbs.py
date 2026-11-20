"""
Buat thumbnail foto pejabat untuk halaman Organisasi (/organisasi).

Foto asli di static/gambar/org rata-rata ±2500×3400 px (2 MB), padahal di bagan
hanya tampil sebagai lingkaran 32–56 px. Puluhan foto sebesar itu sekaligus
membuat browser hang (tiap foto ±34 MB RAM setelah di-decode). Thumbnail
disimpan di static/gambar/org-thumb dengan NAMA YANG SAMA; server memakai
thumbnail bila ada, selain itu foto asli (lihat orgPhoto di queries.ts).

Jalankan dari root proyek setiap kali ada foto pejabat baru / diganti:
    python scripts/org-thumbs.py
Hanya foto yang belum punya thumbnail, atau fotonya lebih baru, yang diproses.
Butuh Pillow:  pip install pillow
"""

import os
import sys

from PIL import Image, ImageOps

SRC = os.path.join("static", "gambar", "org")
DST = os.path.join("static", "gambar", "org-thumb")
# Lingkaran terbesar 56 px; 168 px = tetap tajam di layar 3× (HP).
SHORT_SIDE = 168
EXTS = (".jpg", ".jpeg", ".png")


def main() -> int:
    if not os.path.isdir(SRC):
        print(f"Folder {SRC} tidak ada — jalankan dari root proyek.")
        return 1
    os.makedirs(DST, exist_ok=True)
    made = skipped = failed = 0
    before = after = 0
    for name in sorted(os.listdir(SRC)):
        src = os.path.join(SRC, name)
        if not name.lower().endswith(EXTS) or not os.path.isfile(src):
            continue
        dst = os.path.join(DST, name)
        if os.path.exists(dst) and os.path.getmtime(dst) >= os.path.getmtime(src):
            skipped += 1
            continue
        try:
            with Image.open(src) as im:
                # Foto kamera sering diputar lewat EXIF; terapkan dulu supaya tidak miring.
                im = ImageOps.exif_transpose(im)
                scale = SHORT_SIDE / min(im.size)
                if scale < 1:
                    im = im.resize(
                        (round(im.width * scale), round(im.height * scale)), Image.LANCZOS
                    )
                if name.lower().endswith(".png"):
                    im.save(dst, "PNG", optimize=True)
                else:
                    im.convert("RGB").save(dst, "JPEG", quality=82, optimize=True, progressive=True)
            made += 1
            before += os.path.getsize(src)
            after += os.path.getsize(dst)
        except Exception as err:  # berkas rusak / bukan gambar — lewati saja
            failed += 1
            print(f"  ! {name}: {err}")
    print(f"Thumbnail dibuat: {made}, dilewati (sudah ada): {skipped}, gagal: {failed}")
    if made:
        print(f"Ukuran: {before / 1048576:.1f} MB -> {after / 1048576:.2f} MB")
    return 0


if __name__ == "__main__":
    sys.exit(main())
