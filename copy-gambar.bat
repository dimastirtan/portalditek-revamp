@echo off
REM ============================================================================
REM  copy-gambar.bat — Salin HANYA berkas gambar dari server portal lama.
REM
REM  AMAN: robocopy di bawah memakai WHITELIST ekstensi (*.jpg *.png *.gif ...).
REM  Artinya yang disalin CUMA gambar. File executable (.exe .scr .pif) — yaitu
REM  bentuk malware yang ada di server itu — TIDAK akan pernah ikut tersalin.
REM  Folder js/ dan menu/ SENGAJA tidak disalin (itu kode, tidak dibutuhkan).
REM
REM  CARA PAKAI:
REM    1) Edit SRC di bawah → arahkan ke folder portal lama di server.
REM    2) Taruh file ini di root project (sejajar package.json), lalu jalankan:
REM         copy-gambar.bat
REM    3) Setelah selesai, scan folder static\gambar dengan antivirus (opsional,
REM       tapi murah — sekadar memastikan).
REM
REM  Script ini hanya MEMBACA dari server, tidak mengubah apa pun di sana.
REM ============================================================================

REM --- EDIT BARIS INI: lokasi folder portal lama di server -------------------
set "SRC=\\SERVER\portaldittek"
REM contoh lain:  set "SRC=E:\portaldittek"
REM ---------------------------------------------------------------------------

set "DST=%~dp0static\gambar"
set "IMG=*.jpg *.jpeg *.png *.gif *.bmp *.webp *.JPG *.JPEG *.PNG *.GIF"
set "OPT=/S /R:0 /W:0 /NFL /NDL /NJH /NP /XF *.exe *.scr *.pif *.bat *.cmd *.com *.vbs *.js *.hta *.dll"

echo.
echo === Menyalin gambar dari: %SRC%
echo === Tujuan               : %DST%
echo.

if not exist "%SRC%" (
  echo [GAGAL] Folder sumber tidak ditemukan: %SRC%
  echo Edit variabel SRC di dalam file ini dulu.
  pause
  exit /b 1
)

robocopy "%SRC%\images_sekilas_ditt" "%DST%\sekilas"  %IMG% %OPT%
robocopy "%SRC%\images_org"          "%DST%\org"      %IMG% %OPT%
robocopy "%SRC%\images_article"      "%DST%\artikel"  %IMG% %OPT%
robocopy "%SRC%\images"              "%DST%\umum"     %IMG% %OPT%
robocopy "%SRC%\gallery"             "%DST%\gallery"  %IMG% %OPT%

REM Logo/ikon aplikasi (untuk kartu di section Sistem).
robocopy "%SRC%\icons"               "%DST%\sistem"   %IMG% %OPT%

REM Gambar yang tertanam di dalam artikel/berita/capability (136 gambar).
REM Coba dua lokasi yang umum — yang tidak ada akan dilewati begitu saja.
robocopy "%SRC%\dt-admin\addons\imagelibrary\uploads" "%DST%\uploads" %IMG% %OPT%
robocopy "%SRC%\portaldittek\dt-admin\addons\imagelibrary\uploads" "%DST%\uploads" %IMG% %OPT%

echo.
echo === SELESAI. Hasil ada di: %DST%
echo.
echo Cek jumlah file per folder:
for %%D in (sekilas org artikel umum gallery uploads sistem) do (
  if exist "%DST%\%%D" (
    for /f %%C in ('dir /b /a-d "%DST%\%%D" 2^>nul ^| find /c /v ""') do echo    %%D : %%C berkas
  ) else (
    echo    %%D : (folder tidak ada di server)
  )
)
echo.
echo Catatan: TIDAK ada .exe/.scr/.pif yang tersalin — whitelist hanya gambar.
echo Selanjutnya: npm run dev  lalu buka /sekilas-dittek dan /organisasi.
echo.
pause
