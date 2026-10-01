# CLAUDE.md

Panduan konteks proyek buat AI assistant (Claude Code atau sejenis) yang bantu kerjain repo ini. Baca file ini duluan sebelum bantu ngoding apapun di project `convene`.

## Ringkasan Proyek

**Nama:** Convene
**Event:** HackCanton Season 3
**One-liner:** "Convene mengubah investment club jadi DAO privat yang auditable: LP vote, capital call jalan, distribusi tercatat, tanpa strategi bocor ke luar."
**Track:** Track 3 — Investment Infrastructure (utama) · Track 1 — RWA & Business Workflows (sekunder)
**Submission deadline:** 9 Oktober 2026, 23:59 UTC (≈ 06:59 WIB 10 Okt — jaring pengaman, bukan target)
**Developer:** Solo hackathon, kapasitas ±5 jam efektif/hari (jadwal detail ada di Notion "HackCanton Brief")

## Konsep Produk (ringkas)

Fund/investment club di mana keputusan investasi dikendalikan lewat voting oleh LP (Investor), bukan cuma diktat GP (FundManager) — dengan privasi selektif di tiap tahap: vote individual, kontribusi, dan distribusi tetap privat per-investor, tapi hasil agregat + audit trail transparan ke semua pihak berhak.

Alur inti (linear, sengaja disempitkan buat MVP):
**Propose Deal → Vote → Capital Call → Contribution → Exit/Distribution**

Revenue model: fee % dari AUM (Assets Under Management), dipotong otomatis saat Distribution — ini FINAL, jangan diubah tanpa alasan kuat.

## Kenapa Canton (jangan dihapus/diremehkan saat implementasi)

Diferensiator utama Convene adalah **privasi selektif**: vote individual & posisi tiap LP disembunyikan dari LP lain, tapi FundManager dan Auditor selalu punya visibility penuh, dan semua LP tetap lihat hasil agregat. Ini BUKAN fitur tempelan — ini alasan utama kenapa produk ini butuh Canton (bukan chain publik biasa). Setiap kali nulis/ubah template Daml, cek balik ke tabel visibility di `ARCHITECTURE.md` sebelum ubah siapa jadi signatory/observer.

## Tech Stack

- **Smart contract:** Daml SDK **2.10.x** (jangan upgrade ke 3.4.11 meski ada notifikasi update — semua desain berbasis 2.10.x demi stabilitas menjelang deadline)
- **LocalNet:** [canton-devkit](https://github.com/bitdynamics-ab/canton-devkit) (Jalur A, pakai Docker) atau Daml Sandbox bawaan `daml start` (Jalur B, fallback tanpa Docker)
- **Backend/API:** TIDAK ADA backend custom — pakai **Daml JSON API** bawaan ledger langsung. Detail lengkap di `BE.md`.
- **Frontend:** React + `@daml/react` + `@daml/ledger`, styling Tailwind CSS. Design system (warna, tipografi, logo) ada di `ui/UIUX.md`; inventaris halaman & setup teknis ada di `ui/FE.md`.
- **Testing:** `daml test` + Daml Script (dipakai juga sebagai bahan demo cadangan)
- **Dev tooling:** VS Code + extension resmi **"Daml"** (publisher: Digital Asset Holdings LLC)

## Dokumen Terkait

- **`README.md`** — ringkasan teknis berbahasa Inggris buat juri: arsitektur, cara run lokal, daftar template & choice. Kalau template/choice di `Convene.daml` berubah, update tabelnya
- **`ARCHITECTURE.md`** — arsitektur sistem, party model, state machine lengkap, tabel visibility (siapa lihat apa)
- **`BE.md`** — Daml JSON API sebagai "backend", auth/JWT, endpoint yang dipakai frontend
- **`BUSINESSRULES.md`** — aturan bisnis (siapa boleh apa, validasi) + keputusan final Approve/Reject, deadline, fee, capital call
- **`SC.md`** — spesifikasi & kerangka kode lengkap tiap template/choice Daml (dokumen kerja utama buat Fase B)
- **`ui/UIUX.md`** — keputusan desain: referensi UI/UX (Havu), palet warna, tipografi, konsep logo
- **`ui/FE.md`** — implementasi Fase C: inventaris halaman/view, setup teknis, progress tracker
- **`LAPORAN.md`** — rekap semua checklist + rencana sesi berikutnya (baca ini duluan kalau lanjut dari sesi sebelumnya)
- **`BUGHUNT-POLISH-CHECKLIST.md`** — checklist bug hunt (aturan bisnis, visibility) + polish UI, beserta hasilnya

## Struktur Repo (per status 25 Sept)

```
convene/
├── daml.yaml
├── ARCHITECTURE.md · BE.md · BUSINESSRULES.md · SC.md · LAPORAN.md · BUGHUNT-POLISH-CHECKLIST.md
├── daml/
│   ├── Convene.daml   ← model Convene asli (semua template/choice Fase B, lihat SC.md)
│   ├── Setup.daml     ← init script: `setupConvene` (role asli + PlatformAgreement) + `setup` bawaan (alice/bob, HANYA smoke test)
│   ├── User.daml      ← placeholder smoke-test dari template create-daml-app. UI lama yang memakainya sudah diarsip ke `ui/legacy-create-daml-app/` (26 Sept); FE baru tidak memakai User.daml
│   └── Test/
│       ├── Common.daml      ← fixture & helper tiap tahap alur
│       ├── HappyPath.daml   ← skenario end-to-end propose → distribution
│       ├── Visibility.daml  ← assertion privasi selektif (bukti tabel visibility)
│       └── Guards.daml      ← aturan bisnis yang harus ditolak ledger
└── ui/
    ├── package.json
    ├── FE.md · UIUX.md
    ├── tailwind.config.js        ← token UIUX.md
    ├── legacy-create-daml-app/   ← UI bawaan template (alice/bob), diarsip, tidak di-compile
    └── src/
        ├── lib/                  ← session/JWT, useFund (stream semua template), format, roles
        ├── styles/               ← tailwind.css (sumber) → generated.css (output CLI)
        └── components/           ← App, LoginScreen, Workspace, LedgerView, stages/, ui/
```

Modul Daml buat model Convene asli sengaja dipisah dari `User.daml` bawaan template — biar gampang dibedain dari kode bawaan template yang cuma buat smoke test.

## Dev Workflow

1. **Terminal 1** (biarkan jalan terus, JANGAN Ctrl+C): `cd convene && daml start`
2. **Terminal 2**: `cd convene/ui && npm start`
3. Login dev: user demo bawaan template `alice` / `bob` (huruf kecil) masih bisa dipakai buat smoke test cepat. Untuk role asli Convene (FundManager, Investor1-3, Auditor, Platform), user/party-nya didefinisikan sendiri di Fase B — lihat `SC.md` bagian "Party & User Setup".

## Known Gotchas (dari sesi setup Rabu + Fase B, JANGAN diulang)

- `daml start` **wajib** tetap jalan di terminal terpisah selama development — jangan pernah di-Ctrl+C selagi develop di terminal lain.
- Kalau `npm start` gagal compile dengan error `Failed to load plugin '@typescript-eslint'` / `Cannot find module 'eslint/package.json'`: sudah di-fix dengan file `.env` di folder `ui/` isinya `DISABLE_ESLINT_PLUGIN=true`.
- Kalau install package baru di `ui/` kena `ERESOLVE could not resolve` (konflik peer dependency, biasanya soal `autoprefixer`/versi React lama di `react-scripts@4.0.3`): pakai flag `--legacy-peer-deps`.
- Login page create-daml-app beneran ngecek Ledger API User Management — username harus terdaftar dulu (lewat init script), bukan asal ketik.
- Output `daml test` berisi banyak baris `[ERROR] ... SCENARIO SERVICE STDERR: WARNING: ... sun.misc.Unsafe` — itu cuma warning JVM (Java baru), BUKAN test gagal. Lihat bagian "Test Summary" di akhir output.
- `npx tsc --noEmit` di `ui/` memunculkan ratusan parse error dari `node_modules/undici-types` & `@types/babel__traverse` (TypeScript 3.8 terlalu tua buat type library itu). Itu bukan error kode kita — `npm run build`/`npm start` tetap compile sukses.
- Test yang pakai `passTime` (di `Test/Guards.daml`) cuma bisa jalan di `daml test` (IDE ledger, waktu statis), tidak bisa lewat `daml script` ke sandbox yang pakai wall-clock.
- **Tailwind tidak diproses CRA 4** (`react-scripts@4` mengabaikan `postcss.config.js` dan pakai PostCSS 7, Tailwind 3 butuh PostCSS 8). Solusinya: Tailwind CLI compile `src/styles/tailwind.css` → `src/styles/generated.css`, dijalankan otomatis oleh `npm start` (mode `--watch=always`; `--watch` biasa langsung keluar kalau jalan di background) dan `npm run build`. Jangan edit `generated.css` manual.
- `react-error-overlay` di-pin ke `6.0.9` lewat `overrides` di `ui/package.json`. Versi 6.0.10+ dengan CRA 4 meninggalkan iframe kosong transparan di atas halaman setelah hot reload → semua klik "mati".
- Party ID investor/auditor buat form propose diambil dari `listKnownParties()` (cocokkan hint `Investor1`, `Auditor`, dst.), cadangannya diturunkan dari namespace party yang login. Kalau hint party di `Setup.daml` diganti, sesuaikan `ui/src/lib/parties.ts`.
- Di Linux, Docker jalan sebagai service/daemon (bukan app terpisah kayak Mac/Windows) — kalau mati, `sudo systemctl start docker`.

## Progress Tracker — Fase B (Core Daml Model / "Backend")

Checklist ini **wajib di-update oleh Claude** tiap kali task dilaporkan selesai lewat chat (bukan diprakarsai sendiri tanpa laporan). Referensi lengkap tiap item ada di `SC.md`.

- [x] Definisikan 4 parties: FundManager, Investor (multi, min. 3), Auditor, Platform
- [x] Template `DealProposal` (create + submit)
- [x] Template `Vote` (privat per-investor) + choice `TallyVotes`
- [x] Template `DealResult` (agregat, visible ke semua)
- [x] Choice `IssueCapitalCall` → `CapitalCallNotice` (privat) + `CapitalCallSummary` (agregat)
- [x] Choice `Contribute` → update `FundLedger`
- [x] Choice `TriggerExit` → `PlatformFeeRecord` + `DistributionNotice` (privat) + `DistributionSummary` (agregat)
- [x] Daml Script: skenario end-to-end happy path (1 FundManager, 3 Investor, 1 Auditor, propose → distribution)
- [x] `daml test`: unit test inti (assert visibility — investor lain gak boleh lihat Vote/CapitalCallNotice/DistributionNotice orang lain)

**Status 25 Sept: Fase B selesai.** `daml test` → 25 script lulus tanpa error, termasuk 20 skenario test (1 happy path, 5 visibility, 14 guard/aturan bisnis). Kode sudah dicocokkan dengan `BUSINESSRULES.md` (25 Sept) — keputusan terbuka di bagian 10 sudah difinalkan. Happy path, test visibility, dan guard juga sudah diverifikasi jalan di Canton sandbox asli (`daml script --ledger-host`), bukan cuma IDE ledger. Keputusan implementasi yang beda dari kerangka awal dicatat di `SC.md` bagian 13.

**Update 30 Sept (bug hunt):** ditemukan & diperbaiki 1 bug integritas — setelah deadline, FundManager bisa tally dengan membuang vote yang menolak. Fix: template baru `VoteReceipt` (lihat `SC.md` bagian 13 no. 16). `daml test` → 27 script lulus (22 skenario test: 2 happy path, 5 visibility, 15 guard). Visibility juga diverifikasi dari respons mentah JSON API per party di sandbox asli. Detail di `BUGHUNT-POLISH-CHECKLIST.md`.

## Jadwal Fase B (referensi, dari Notion "HackCanton Brief" Langkah 5)

| Tanggal | Hari | Jam | Fokus |
|---|---|---|---|
| 24 Sept | Kamis | 19.00-22.30 (3,5j) | Mulai: 4 parties + template `DealProposal` |
| 25 Sept | Jumat | 19.00-23.00 (4j) | `Vote` (privat) + `TallyVotes` + `DealResult` |
| 26 Sept | Sabtu | 14.00-20.00 (6j) | `IssueCapitalCall` → Notice/Summary, lanjut `Contribute` kalau sempat |
| 27 Sept | Minggu | 19.00-22.00 (3j) | Selesaikan `Contribute` + `FundLedger`, mulai `TriggerExit` |
| 28 Sept | Senin | 19.00-24.00 (5j) | Daml Script end-to-end + `daml test` → **Fase B kelar** |

**Catatan:** Fase B kelar lebih cepat dari jadwal (selesai 25 Sept, target awal 28 Sept) — sisa slot Sabtu-Senin bisa dipakai buat mulai Fase C (frontend) lebih awal atau buffer kalau ada bug ditemukan belakangan.

## Progress Tracker — Fase C (Frontend/UI)

Checklist ini **wajib di-update oleh Claude** tiap kali task dilaporkan selesai lewat chat, sama seperti Fase B. Detail lengkap tiap item (referensi kontrak, badge privasi, dsb.) ada di `FE.md`.

- [x] Design system: color palette + logo mark — lihat `UIUX.md` (referensi Havu, di luar breakdown asli, ditambahkan atas permintaan Yuna 26 Sept)
- [x] Login / Party Selector
- [x] View FundManager (propose deal, lihat DealResult, issue capital call, trigger exit)
- [x] View Investor (vote privat, lihat CapitalCallNotice miliknya, submit kontribusi, lihat DistributionNotice miliknya)
- [x] View Auditor (full visibility, termasuk PlatformFeeRecord)
- [x] Dashboard agregat (DealResult, CapitalCallSummary, DistributionSummary ke semua investor) — 🟡 should-have, digabung ke section tiap tahap (opsi yang diizinkan `FE.md` 2.5), bukan halaman terpisah

**Status 26 Sept (update):** Semua item Fase C selesai & diverifikasi end-to-end di sandbox asli (`daml start` + browser): propose → 3 vote → tally → capital call 200k/150k/150k → 3 kontribusi → exit 740k (fee 1% = 7.400, distribusi proporsional 40/30/30). Redaksi, badge privasi, dan panel "ledger view" (hitungan kontrak live per party) sudah dicek per role. Copy UI pakai bahasa Inggris (juri internasional); teksnya tersebar di komponen, belum dipusatkan ke satu file. Detail struktur kode di `FE.md` bagian 5.

**Status 26 Sept:** Fase C dimulai lebih awal dari jadwal (target asli 30 Sept) karena Fase B kelar 3 hari lebih cepat. Buffer waktu ini dipakai buat investasi ke design system (warna + logo) yang di breakdown MVP awal sebenarnya masuk kategori 🟢 "dipotong" — keputusan sadar dari Yuna karena ada slack waktu, bukan pelebaran scope tanpa rencana.

## Yang Sengaja Dipotong dari MVP (jangan dikerjain, ini future work)

- Multi-fund / multi-round dalam satu platform
- Dashboard analitik performa fund
- Secondary market buat LP jual/transfer posisi
- Voting dengan bobot kompleks (quadratic voting, dst) — cukup 1 LP 1 vote
- Edge case: vote ditolak (quorum gak tercapai), kontribusi kurang dari capital call
- Integrasi wallet Canton asli (Console Wallet) & token asli (CBTC/cETH/stablecoin) — dipakai party Daml asli + saldo internal simulasi dulu buat MVP