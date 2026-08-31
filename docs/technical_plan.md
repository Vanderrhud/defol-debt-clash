# 🧱 Technical Plan — Prototype

**Status:** Proposed, perlu divalidasi lewat build percobaan.

## Arsitektur awal

- **Client:** Godot 4, scene 2D sederhana, export Android.
- **Transport:** WebSocket untuk koneksi dua arah.
- **Server:** service kecil di VPS; satu process mengelola room privat.
- **Routing:** subdomain menuju service melalui reverse proxy dan koneksi aman.
- **State:** server menjadi sumber kebenaran untuk room, pemain, HP, timer, dan hasil.

Database, akun, matchmaking, dan sistem ranking belum diperlukan.

## Alur room

1. Client meminta create room.
2. Server mengembalikan kode pendek.
3. Client kedua mengirim kode untuk join.
4. Server menerima maksimal dua pemain.
5. Server mengirim status `waiting`, `ready`, `playing`, `finished`, atau `closed`.
6. Server memvalidasi input dan mengirim state yang dapat ditampilkan kedua client.

## Keterbatasan lingkungan

Pengembangan dilakukan dari VPS dan HP, tanpa komputer desktop lokal. Risiko utama adalah Godot editor dan Android export toolchain pada VPS. Sebelum membangun gameplay, lakukan spike kecil:

- Godot tersedia dalam mode headless.
- Android SDK/export template dapat dipasang.
- APK dapat dibuild di VPS.
- APK dapat dipindahkan dan dipasang di HP.
- Server WebSocket dapat diakses melalui subdomain.

Jika spike ini gagal, jangan memaksa seluruh arsitektur. Catat hambatannya dan evaluasi prototype web atau remote desktop sebagai alternatif.

## Keamanan minimum

- Jangan menaruh secret di repository.
- Validasi ukuran dan bentuk input dari client.
- Room memiliki expiry agar tidak memenuhi RAM VPS.
- Batasi jumlah koneksi dan ukuran pesan.
- Gunakan HTTPS/WSS melalui reverse proxy.
- Jangan menyimpan data pribadi pemain pada MVP.

## Observability minimum

Server perlu mencatat timestamp, room ID, event koneksi, error, dan alasan match selesai. Jangan mencatat token atau data sensitif.

## Keputusan yang masih terbuka

- Bahasa server: Node.js atau Python.
- Library WebSocket yang digunakan.
- Apakah server authoritative penuh atau hanya relay pada prototype.
- Nama subdomain.
- Metode distribusi APK dari VPS ke HP.

Keputusan tersebut dibuat setelah spike, bukan diasumsikan di awal.
