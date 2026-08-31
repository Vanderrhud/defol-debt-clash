# DEFOL: Debt Clash — Aturan Kerja Proyek

## Struktur Folder
- `docs/` — dokumentasi desain (GDD, combat, dll)
- `characters/` — deskripsi & lore karakter
- `assets_spec/` — spec asset visual (concept art prompts, dll)

## Aturan
- Update progress di kanban comment sebelum menandai task selesai
- Bahasa output: Indonesia, istilah game boleh Inggris
- Sebelum generate art, cek prompt library di Obsidian vault / Notion dulu
- Commit pakai format konvensional (feat:, fix:, docs:, chore:)
- Jangan commit langsung ke main — pakai branch
- Prototype harus mengikuti `docs/mvp_scope.md`; jangan menambah fitur di luar scope tanpa keputusan tercatat
- Baca `docs/project_workflow.md` sebelum bekerja agar peran GitHub, folder VPS, dan Notion tidak tertukar
- Perubahan desain dicatat di `docs/design_decisions.md`; dokumen lama diberi status `Superseded`, bukan dihapus diam-diam
- Notion dipakai untuk planning, task, proposal, asset, dan playtest; GitHub tetap sumber resmi kode dan dokumentasi versioned
- Folder aktif hanya repository ini; jangan gunakan `game-artemis-docs`

## Referensi
- GitHub: https://github.com/Vanderrhud/defol-debt-clash
- Notion Dashboard: https://app.notion.com/p/3cd77ea3e81a8197bda2e09dab5ed198
- Notion GDD Hub (referensi lama): https://app.notion.com/p/DEFOL-Debt-Clash-GDD-Hub-3cc77ea3e81a813fab44e24cf9c550de
