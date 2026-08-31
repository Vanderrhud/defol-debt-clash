# ⚔️ Combat Rules — Prototype v0.1

**Status:** Accepted untuk prototype pertama. Nilai dapat dituning setelah playtest.

## 1. Tujuan prototype

Membuktikan bahwa dua pemain dapat mengendalikan avatar, saling menyerang, melihat HP yang tersinkron, dan menyelesaikan match 2–3 menit. Ini bukan sistem combat final.

## 2. Match

- Mode: 1v1 private room.
- MVP awal: satu round, bukan best-of-3.
- Durasi: 120 detik.
- Posisi awal: kedua pemain di sisi berlawanan arena.
- Menang: HP lawan menjadi 0.
- Jika timer habis: pemain dengan HP lebih tinggi menang; jika sama, hasil draw.
- Disconnect: pemain yang keluar dianggap kalah setelah grace period yang ditentukan saat implementasi.

## 3. Input prototype

- Kiri/kanan: bergerak horizontal.
- Tombol Attack: satu serangan sederhana.
- Tombol Block: mengurangi atau meniadakan damage dari depan.
- Tombol Jump: **ditunda** sampai gerak dasar stabil.
- Dash, combo, special, ultimate, crouch, dan cooldown: **di luar MVP**.

Kontrol harus tetap dapat dimainkan dengan dua jempol pada layar landscape. Bentuk tombol boleh berubah saat playtest.

## 4. Aturan awal

- HP awal: 100.
- Serangan dasar: 10 damage.
- Serangan memiliki cooldown singkat agar tidak dapat ditekan tanpa batas dalam satu frame.
- Block hanya melindungi arah depan dan tidak melindungi dari serangan yang belum diimplementasikan.
- Hitbox dan hurtbox menggunakan bentuk sederhana yang mudah dilihat saat debug.
- Tidak ada stun, knockdown, guard break, atau meter pada prototype pertama.

Nilai damage, cooldown, dan durasi block adalah **tuning variables**, bukan janji desain final.

## 5. Fase combat berikutnya

Setelah MVP online stabil, fitur ditambahkan satu per satu:

1. Jump dan dash.
2. Light/heavy attack.
3. Hitstop, knockback, dan screen shake.
4. Special dengan cooldown.
5. Bunga Meter.
6. Karakter kedua dan perbedaan moveset.
7. Ultimate dan cutscene.
8. Best-of-3.

Setiap fitur harus diuji dalam match lokal/simulasi sebelum dibawa ke online.

## 6. Definisi selesai

Combat prototype dianggap selesai jika:

- dua perangkat dapat masuk ke room yang sama;
- kedua pemain dapat bergerak dan menyerang;
- HP tampil sama di kedua perangkat setelah serangan;
- match berakhir benar saat HP 0 atau timer habis;
- rematch atau keluar room tidak membuat server macet;
- perilaku dasar dapat diuji tanpa asset final.
