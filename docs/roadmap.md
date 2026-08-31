# 🗺️ Roadmap Pengembangan

**Aturan:** satu fase dianggap selesai hanya setelah kriteria verifikasinya terpenuhi.

## Fase 0 — Fondasi dan keputusan (Saat ini)

- [x] Repository canonical ditetapkan: `defol-debt-clash`.
- [x] Target: Android, Godot 4, private room, match 2–3 menit.
- [x] Scope MVP ditulis.
- [ ] Pastikan workflow build dari VPS ke HP feasible.

**Selesai jika:** dokumen MVP dan technical plan disetujui serta jalur build percobaan berhasil.

## Fase 1 — Prototype offline

- [ ] Project Godot kosong berjalan.
- [ ] Satu arena dan dua avatar placeholder.
- [ ] Gerak kiri/kanan, attack, block, HP, timer.
- [ ] Match selesai saat KO atau timer habis.
- [ ] Debug hitbox/hurtbox terlihat.

**Selesai jika:** satu perangkat dapat memainkan match lengkap tanpa asset final.

## Fase 2 — Server private room

- [ ] Server dapat dijalankan di VPS melalui subdomain.
- [ ] Create room dan join dengan kode.
- [ ] Validasi maksimal dua pemain per room.
- [ ] Sinkronisasi state dan penanganan disconnect.
- [ ] Logging minimal untuk diagnosis.

**Selesai jika:** dua perangkat Android dapat masuk room yang sama dan melihat hasil match yang sama.

## Fase 3 — Playtest dan tuning

- [ ] Uji latency dan koneksi mobile.
- [ ] Tuning kecepatan, damage, block, dan timer.
- [ ] Perbaiki bug rematch/keluar room.
- [ ] Catat hasil playtest di `docs/design_decisions.md`.

**Selesai jika:** minimal dua orang dapat menyelesaikan beberapa match tanpa blocker besar.

## Fase 4 — Identitas karakter

- [ ] Ganti avatar placeholder dengan Osman.
- [ ] Tambahkan Aylin setelah sistem karakter stabil.
- [ ] Tambahkan light/heavy/special satu per satu.
- [ ] Uji asset AI dan konsistensi visual.

## Fase 5 — Polish dan fitur lanjutan

- [ ] Arena final dan parallax.
- [ ] Audio dan efek komedi.
- [ ] Bunga Meter dan ultimate.
- [ ] Best-of-3.
- [ ] Profil, ranking, matchmaking, atau monetisasi hanya jika dibutuhkan.

## Aturan scope

Jika sebuah fitur tidak membantu membuktikan prototype online 1v1, fitur tersebut masuk fase lanjutan. Roadmap boleh berubah, tetapi alasannya dicatat dan urutan fase diperbarui.
