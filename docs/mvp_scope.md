# 🎯 MVP Scope — Online 1v1 Android

**Status:** Accepted
**Versi:** 0.1
**Tujuan:** dua orang dapat memainkan satu pertandingan singkat dari dua HP.

## Termasuk

- Phaser 3 webapp client
- Satu arena placeholder.
- Satu avatar universal; Osman menjadi identitas pertama setelah gameplay stabil.
- Private room dengan kode.
- Dua pemain maksimal per room.
- Gerak kiri/kanan, attack, block.
- HP, timer 120 detik, hasil menang/kalah/draw.
- Tombol rematch dan keluar.
- Server berjalan di VPS melalui subdomain.
- Logging dasar untuk room, koneksi, dan error.

## Tidak termasuk

Combo, jump, dash, special, Bunga Meter, ultimate, best-of-3, bot, akun, matchmaking publik, ranking, monetisasi, chat, skin, cutscene, dan asset final.

## Kriteria penerimaan

MVP diterima jika:

1. Server dapat dijalankan ulang tanpa konfigurasi manual yang tidak terdokumentasi.
2. Dua HP dapat membuat dan memasuki room yang sama.
3. Input masing-masing pemain tidak tertukar.
4. Posisi, serangan, HP, timer, dan hasil match konsisten di kedua HP.
5. Room menolak pemain ketiga dengan pesan yang jelas.
6. Disconnect tidak meninggalkan room macet.
7. Match selesai dalam 2–3 menit atau lebih cepat karena KO.
8. Build dapat dipasang ulang dan diuji dari HP.

Jika satu kriteria belum terpenuhi, MVP tetap `In Progress`.
