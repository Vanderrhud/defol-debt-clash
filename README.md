# 🎮 DEFOL: Debt Clash

> **Prototype online 1v1 2D untuk Android — absurd cyberpunk, cepat, dan mudah dimainkan.**

## Status saat ini

Project ini masih berada pada tahap **desain dan persiapan prototype**. Belum ada game playable di repository ini.

- Target perangkat: Android
- Engine client: Godot 4 (gratis)
- Mode awal: private room dengan kode
- Durasi target: 2–3 menit
- Visual awal: placeholder sederhana
- Server: VPS pribadi melalui subdomain

## Prinsip pengembangan

1. Prototype kecil harus playable sebelum fitur baru ditambahkan.
2. Visi besar tetap disimpan, tetapi tidak boleh menghambat MVP.
3. Setiap perubahan desain dicatat dan diberi status: `Proposed`, `Accepted`, `Implemented`, atau `Rejected`.
4. Dokumentasi adalah sumber keputusan; kode dan asset harus mengikuti dokumen yang berstatus `Accepted`.

## Dokumen utama

- [`docs/project_workflow.md`](docs/project_workflow.md) — pembagian peran GitHub, VPS, dan Notion
- [`docs/mvp_scope.md`](docs/mvp_scope.md) — batas prototype pertama dan kriteria selesai
- [`docs/gdd.md`](docs/gdd.md) — visi, pemain, game loop, dan arah jangka panjang
- [`docs/combat_rules.md`](docs/combat_rules.md) — aturan combat versi prototype
- [`docs/technical_plan.md`](docs/technical_plan.md) — rencana Godot, server, dan keterbatasan VPS
- [`docs/roadmap.md`](docs/roadmap.md) — fase kerja dan urutan prioritas
- [`docs/design_decisions.md`](docs/design_decisions.md) — catatan keputusan dan perubahan desain
- [`characters/osman.md`](characters/osman.md) — karakter Osman
- [`characters/aylin.md`](characters/aylin.md) — karakter Aylin
- [`assets_spec/audio_visual.md`](assets_spec/audio_visual.md) — kebutuhan asset bertahap
- [`assets_spec/prompts.md`](assets_spec/prompts.md) — prompt visual referensi

## Struktur repository

- `docs/` — keputusan desain, aturan, dan rencana teknis
- `characters/` — identitas dan moveset karakter
- `assets_spec/` — spesifikasi asset, bukan asset final

## Cara mengubah desain

Jangan mengedit konsep secara diam-diam. Tambahkan proposal ke `docs/design_decisions.md`, jelaskan dampaknya terhadap scope, lalu tandai sebagai `Accepted` setelah keputusan dibuat. Dokumen yang sudah tidak berlaku diberi label `Superseded`, bukan langsung dihapus.

## Referensi

- GitHub: https://github.com/Vanderrhud/defol-debt-clash
- **Notion Dashboard:** [DEFOL: Debt Clash](https://app.notion.com/p/3cd77ea3e81a8197bda2e09dab5ed198)
- **Notion GDD Hub (referensi lama):** [GDD Hub](https://app.notion.com/p/DEFOL-Debt-Clash-GDD-Hub-3cc77ea3e81a813fab44e24cf9c550de)
