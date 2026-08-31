# 🗺️ Roadmap Pengembangan

**Aturan:** satu fase dianggap selesai hanya setelah kriteria verifikasinya terpenuhi.

## Fase 0 — Fondasi dan keputusan (Selesai)

- [x] Repository canonical ditetapkan: `defol-debt-clash`.
- [x] Target awal: browser Android, Phaser 3, private room, match 2–3 menit.
- [x] Scope MVP ditulis.
- [x] Webapp dipilih sebelum Android native.

## Fase 1 — Webapp prototype offline (Saat ini)

- [ ] Project Phaser 3 kosong berjalan di browser.
- [ ] Satu arena dan dua avatar placeholder.
- [ ] Gerak kiri/kanan, attack, block, HP, timer.
- [ ] Match selesai saat KO atau timer habis.
- [ ] Debug hitbox/hurtbox terlihat.

**Selesai jika:** satu browser dapat memainkan match lengkap tanpa asset final.

## Fase 2 — Server private room

- [ ] Server Node.js + WebSocket berjalan di VPS.
- [ ] Create room dan join dengan kode.
- [ ] Validasi maksimal dua pemain per room.
- [ ] Sinkronisasi state dan penanganan disconnect.
- [ ] Subdomain dan HTTPS/WSS aktif.
- [ ] Logging minimal untuk diagnosis.

**Selesai jika:** dua HP dapat membuka webapp, masuk room yang sama, dan melihat hasil match yang sama.

## Fase 3 — Playtest dan tuning

- [ ] Uji latency dan koneksi mobile.
- [ ] Tuning kecepatan, damage, block, dan timer.
- [ ] Perbaiki bug rematch/keluar room.
- [ ] Catat hasil playtest di `docs/design_decisions.md` dan Notion.

**Selesai jika:** minimal dua orang dapat menyelesaikan beberapa match tanpa blocker besar.

## Fase 4 — Identitas karakter

- [ ] Ganti avatar placeholder dengan Osman.
- [ ] Tambahkan Aylin setelah sistem karakter stabil.
- [ ] Tambahkan light/heavy/special satu per satu.
- [ ] Uji asset AI dan konsistensi visual.

## Fase 5 — Packaging dan polish

- [ ] Jadikan webapp sebagai PWA bila berguna.
- [ ] Evaluasi wrapper Android bila diperlukan.
- [ ] Arena final dan parallax.
- [ ] Audio dan efek komedi.
- [ ] Bunga Meter, ultimate, dan best-of-3.

Godot dan Android native build tetap opsi lanjutan, bukan dependency prototype.

## Aturan scope

Jika sebuah fitur tidak membantu membuktikan prototype online 1v1, fitur tersebut masuk fase lanjutan. Roadmap boleh berubah, tetapi alasannya dicatat dan urutan fase diperbarui.
