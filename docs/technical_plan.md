# 🧱 Technical Plan — Web Prototype

**Status:** Accepted untuk prototype web; detail library dapat berubah setelah spike.

## Arsitektur awal

- **Client:** Phaser 3, game 2D yang berjalan di browser HP.
- **Transport:** WebSocket untuk koneksi realtime dua arah.
- **Server:** Node.js + library WebSocket di VPS; satu process mengelola room privat.
- **Routing:** subdomain menuju service melalui reverse proxy dan koneksi aman.
- **State:** server menjadi sumber kebenaran untuk room, pemain, HP, timer, dan hasil.
- **Deployment:** webapp disajikan dari VPS dan dibuka melalui browser Android.

Phaser adalah framework JavaScript untuk game 2D browser. WebSocket menjaga koneksi realtime antara dua HP dan server. Node.js sudah tersedia di VPS.

Database, akun, matchmaking, Android native, dan sistem ranking belum diperlukan.

## Alur room

1. Client meminta create room.
2. Server mengembalikan kode pendek.
3. Client kedua mengirim kode untuk join.
4. Server menerima maksimal dua pemain.
5. Server mengirim status `waiting`, `ready`, `playing`, `finished`, atau `closed`.
6. Server memvalidasi input dan mengirim state yang dapat ditampilkan kedua client.

## Fase build

1. Jalankan webapp lokal di VPS.
2. Uji dari browser VPS/HP.
3. Pasang reverse proxy dan subdomain.
4. Aktifkan HTTPS/WSS.
5. Uji dua HP pada jaringan berbeda.

Godot 4 dan Android native build ditunda. Keduanya dapat dievaluasi kembali jika webapp sudah terbukti menyenangkan atau jika distribusi APK menjadi kebutuhan nyata.

## Keterbatasan lingkungan

Pengembangan dilakukan dari VPS dan HP, tanpa komputer desktop lokal. Webapp dipilih agar tidak membutuhkan Godot editor, Java/JDK, Android SDK, atau export template pada fase awal.

VPS memiliki RAM sekitar 1.9 GB dan disk terbatas, sehingga dependency harus minimal dan room harus memiliki expiry.

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

- Library WebSocket Node.js.
- Apakah server authoritative penuh atau relay pada prototype.
- Nama subdomain.
- Metode packaging Android di masa depan.
- Kapan webapp dianggap perlu dibungkus menjadi Android app.
