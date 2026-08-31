# 🧭 Design Decisions & Change Log

Dokumen ini menjaga project tetap dinamis tanpa kehilangan alasan di balik perubahan.

## Cara mencatat perubahan

Gunakan format berikut untuk setiap proposal penting:

```text
## D-XXX — Judul keputusan
Status: Proposed | Accepted | Implemented | Rejected | Superseded
Tanggal: YYYY-MM-DD
Keputusan: ...
Alasan: ...
Dampak ke scope/teknis: ...
Cara verifikasi: ...
```

Keputusan `Accepted` menjadi acuan dokumentasi. Jika berubah, jangan menghapus keputusan lama; tandai `Superseded` dan buat ID baru.

## D-001 — Canonical project folder

Status: Accepted
Keputusan: `/home/Rudi/defol-debt-clash` adalah repository aktif. `game-artemis-docs` adalah duplikat lama dan tidak digunakan.
Alasan: nama project sudah DEFOL dan repository ini terhubung ke remote canonical.
Dampak: semua pekerjaan berikutnya dilakukan di repository ini.

## D-002 — Target platform dan perangkat

Status: Accepted
Keputusan: target awal Android, dikembangkan dari VPS dan diuji pada HP.
Alasan: perangkat yang tersedia dan tidak ada biaya tambahan untuk platform awal.

## D-003 — Bentuk MVP

Status: Accepted
Keputusan: private room dua pemain, satu arena placeholder, kontrol dasar, match 120 detik.
Alasan: membuktikan tujuan utama tanpa membangun seluruh game sekaligus.
Dampak: fitur lanjutan ditunda sampai kriteria MVP terpenuhi.

## D-004 — Urutan online

Status: Accepted
Keputusan: gameplay offline/simulasi diuji lebih dulu, lalu server private room.
Alasan: jaringan menambah kompleksitas dan tidak boleh menyamarkan masalah combat dasar.

## Open questions

- Apakah nama Bank Turki dipertahankan?
- Apakah prototype perlu Godot Android native sejak awal atau spike web lebih cepat?
- Node.js atau Python untuk server?
- Subdomain apa yang akan digunakan?
