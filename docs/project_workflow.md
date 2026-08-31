# 🔁 Project Workflow — GitHub, VPS, dan Notion

**Status:** Accepted  
**Scope:** semua pekerjaan DEFOL: Debt Clash

Dokumen ini menjelaskan peran setiap tempat penyimpanan. AI dan contributor harus mengikuti aturan ini agar project tetap rapi ketika desain berubah.

## 1. GitHub — sumber resmi dan versioned

Repository canonical:

```text
https://github.com/Vanderrhud/defol-debt-clash
```

GitHub adalah sumber resmi untuk:

- source code client dan server;
- dokumentasi desain yang sudah diterima;
- spesifikasi teknis;
- roadmap yang sedang berlaku;
- riwayat perubahan melalui commit dan branch;
- issue, bug, dan pull request bila digunakan.

Jika isi Notion dan GitHub berbeda, aturan versioned di GitHub menjadi acuan implementasi. Jangan menganggap ide di Notion sudah berlaku sebelum disinkronkan ke GitHub.

## 2. Folder lokal di VPS — working copy dan runtime

Folder aktif:

```text
/home/Rudi/defol-debt-clash
```

Folder ini adalah working copy repository GitHub sekaligus tempat untuk:

- mengedit file;
- menjalankan validasi dan build;
- menjalankan server prototype;
- menyimpan file kerja yang memang akan masuk Git.

Folder VPS bukan sumber kebenaran kedua. Perubahan penting harus dibuat di branch, di-commit, dan di-push ke GitHub. Secret, token, log runtime, hasil build sementara, dan file lokal tidak boleh masuk repository.

Folder lama berikut tidak digunakan:

```text
/home/Rudi/game-artemis-docs
```

## 3. Notion — control center dan workspace planning

Workspace Notion digunakan untuk planning yang fleksibel dan informasi visual:

- dashboard project;
- Tasks/Kanban;
- diskusi dan proposal desain;
- Design Decisions sebelum disinkronkan;
- Asset & Prompt Library;
- catatan playtest;
- ringkasan progres dan blocker.

Notion tidak digunakan sebagai tempat utama source code, server state, secret, atau file teknis yang harus versioned.

Project Notion:

```text
https://app.notion.com/p/3cd77ea3e81a8197bda2e09dab5ed198
```

## 4. Alur kerja perubahan

1. Ide atau kebutuhan baru dicatat di Notion sebagai task/proposal.
2. Dampak terhadap scope dan desain dibahas di Notion.
3. Keputusan yang diterima diberi status `Accepted` dan ID.
4. Keputusan tersebut disalin atau diringkas ke `docs/design_decisions.md` di GitHub.
5. Implementasi dilakukan dari working copy di VPS pada branch terpisah.
6. Hasil divalidasi, di-commit, lalu di-push ke GitHub.
7. Status task Notion diperbarui dengan link commit/branch dan hasil verifikasi.

## 5. Aturan AI

Sebelum bekerja, AI harus:

1. membaca `AGENTS.md`;
2. membaca `docs/project_workflow.md`;
3. memeriksa branch dan status Git;
4. mencari keputusan terkait di Notion dan GitHub;
5. tidak mengimplementasikan proposal `Proposed` sebelum diterima;
6. tidak menghapus keputusan lama tanpa menandainya `Superseded`;
7. melaporkan dengan jelas apakah perubahan hanya ada di VPS, sudah di-push ke GitHub, atau sudah dicatat di Notion.

Jika sumber berbeda atau konteks kurang jelas, AI harus berhenti dan meminta keputusan, bukan memilih diam-diam.

## 6. Ringkasan cepat

| Tempat | Peran | Status kebenaran |
|---|---|---|
| GitHub | kode dan dokumentasi versioned | sumber resmi implementasi |
| VPS `/home/Rudi/defol-debt-clash` | working copy, build, runtime server | lingkungan kerja |
| Notion | planning, task, proposal, asset, playtest | control center project |
