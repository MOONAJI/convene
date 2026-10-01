# FE.md — Frontend Convene (Implementasi Fase C)

Dokumen kerja utama Fase C: inventaris halaman/view yang harus dibangun, setup teknis, dan progress tracker. Untuk keputusan desain (referensi UI/UX, palet warna, tipografi, konsep logo), lihat **`UIUX.md`** — dokumen itu gak diulang di sini biar gak tumpang tindih. Detail koneksi teknis ke ledger (endpoint JSON API, hooks `@daml/react`) ada di `BE.md`.

## 1. Setup Teknis Sebelum Mulai Build

- ✅ Copy blok `colors` & `fontFamily` dari `UIUX.md` Bagian 3 ke `tailwind.config.js` (`theme.extend`). **Catatan:** CRA 4 tidak menjalankan Tailwind, jadi CSS di-compile lewat Tailwind CLI (`npm run css:build` / `css:watch`, otomatis dipanggil `npm start` & `npm run build`).
- ✅ Tambahkan `<link>` Google Fonts (Space Grotesk + Inter) di `ui/public/index.html`, sesuai `UIUX.md` Bagian 4.
- ✅ Logo dipakai sebagai komponen inline `<Logo />` / `<Lockup />` di `ui/src/components/ui/Logo.tsx` (markup `UIUX.md` Bagian 5), jadi file SVG tidak perlu di `src/assets/`. Favicon: `ui/public/favicon.svg` (mark 68% di kotak radius 24%).

## 2. Inventaris Halaman/View (dari breakdown MVP Langkah 4 & 5, versi ramping)

Referensi silang: nama kontrak & choice ada di `SC.md`, aturan siapa-lihat-apa ada di `ARCHITECTURE.md` Bagian 4, token warna & role color ada di `UIUX.md`.

### 2.1 Login / Party Selector (🔴 must-have)
- Pilih/login sebagai salah satu party: FundManager, Investor1-3, Auditor (bukan wallet asli — JWT native Daml party, lihat `BE.md`).
- Tampilan sederhana: daftar user, badge role color per pilihan (biar dari layar login aja user udah "diberi warna"-nya).

### 2.2 View FundManager (🔴 must-have)
- Form propose `DealProposal` (deskripsi, target capital, vote deadline).
- Lihat `DealResult` (agregat, badge success/danger sesuai approved/rejected).
- Tombol/action `IssueCapitalCall` (muncul cuma kalau `DealResult.approved == True`).
- Tombol/action `TriggerExit` di `FundLedger` (input `exitAmount`).
- Semua elemen pakai aksen `role-fm` (bronze) di header/nav aktif.

### 2.3 View Investor (🔴 must-have)
- Lihat `DealProposal` masuk, tombol `Vote` (approve/reject) — form ini kasih badge `privacy` ("🔒 Vote kamu privat").
- Lihat `CapitalCallNotice` miliknya sendiri (badge `privacy`), form `Contribute`.
- Lihat `DistributionNotice` miliknya sendiri (badge `privacy`).
- Aksen `role-investor` (emerald) di elemen aktif milik investor yang login.

### 2.4 View Auditor (🔴 must-have)
- Full visibility — semua kontrak termasuk `PlatformFeeRecord` (satu-satunya kontrak yang investor TIDAK bisa lihat, lihat tabel visibility `ARCHITECTURE.md`).
- Read-only, tidak ada choice/action (Auditor gak punya hak aksi) — jadi UI-nya cukup daftar/tabel kontrak, tanpa tombol.
- Aksen `role-auditor` (steel blue).

### 2.5 Dashboard Agregat (🟡 should-have — kalau waktu cukup)
- Tampilkan `DealResult`, `CapitalCallSummary`, `DistributionSummary` ke SEMUA investor sekaligus — ini bukti visual konkret buat klaim "aggregate transparency" di pitch.
- Kalau waktu mepet, boleh digabung jadi satu section tambahan di View Investor, gak perlu halaman terpisah.

### Non-goals Fase C (tetap DIPOTONG sesuai breakdown asli, JANGAN dikerjain)
- Polish UI pixel-perfect / animasi & micro-interaction custom — cukup terapkan token dari `UIUX.md` secara konsisten.
- Dashboard analitik performa fund, secondary market UI — sudah scope-cut dari MVP (lihat `CLAUDE.md`).
- Light mode / theme toggle — sengaja cuma satu tema (dark) buat hemat waktu.

## 3. Progress Tracker — Fase C

Checklist ini **wajib di-update oleh Claude** tiap kali task dilaporkan selesai lewat chat, sama seperti Fase B. Item diambil dari breakdown resmi Notion "HackCanton Brief" Langkah 4 & 5 (jadwal asli: 30 Sept–3 Okt, tapi karena Fase B kelar lebih cepat — 25 Sept vs target 28 Sept — Fase C bisa mulai lebih awal, 26 Sept).

- [x] Design system: color palette + logo mark — selesai, lihat `UIUX.md` (di luar breakdown asli, ditambahkan atas permintaan Yuna 26 Sept)
- [x] Login / Party Selector
- [x] View FundManager (propose deal, lihat DealResult, issue capital call, trigger exit)
- [x] View Investor (vote privat, lihat CapitalCallNotice miliknya, submit kontribusi, lihat DistributionNotice miliknya)
- [x] View Auditor (full visibility, termasuk PlatformFeeRecord)
- [x] Dashboard agregat (DealResult, CapitalCallSummary, DistributionSummary ke semua investor) — 🟡 should-have, digabung ke section tiap tahap (opsi yang diizinkan `FE.md` 2.5), bukan halaman terpisah

## 4. Jadwal Fase C (referensi asli, dari Notion Langkah 5 — bisa maju karena Fase B kelar cepat)

| Tanggal asli | Hari | Jam | Fokus |
|---|---|---|---|
| 30 Sept | Rabu | 14.00-20.00 (6j) | Login/party selector + View FundManager |
| 1 Okt | Kamis | 19.00-22.30 (3,5j) | View Investor |
| 2 Okt | Jumat | 19.00-23.00 (4j) | View Auditor + Dashboard agregat |
| 3 Okt | Sabtu | 14.00-20.00 (6j) | Fase C selesai (skip polish) → mulai Fase D |

**Prinsip penting (sama kayak Fase B):** kalau Fase C juga selesai lebih cepat, jangan buru-buru mulai Fase D — pastikan dulu View Auditor & Dashboard agregat beneran kelar, karena dua ini yang jadi bukti visual "Why Canton" pas demo/pitch.

## 5. Struktur Kode Fase C (hasil implementasi 26 Sept)

| File | Isi |
|---|---|
| `src/lib/session.ts` | Login dev: JWT user token (`sub` = user ID), disimpan di `sessionStorage` per tab — tiap tab browser bisa login sebagai role berbeda saat demo |
| `src/lib/fund.ts` | `useFund()`: `useStreamQueries` untuk 12 template, digabung jadi model per-deal + penentuan tahap (01–05) |
| `src/lib/parties.ts` | Cari party ID investor & auditor untuk form propose |
| `src/components/LoginScreen.tsx` | Party selector 5 role + glyph "balot yang bisa dibaca" per role |
| `src/components/Workspace.tsx` | Header, tab deal, 5 section bernomor, empty/loading state |
| `src/components/stages/*` | Satu komponen per tahap. Aksi: `create DealProposal`, `CastVote`, `TallyVotes`, `IssueCapitalCall`, `Contribute`, `TriggerExit` |
| `src/components/LedgerView.tsx` | Panel "What X's ledger holds": hitungan live kontrak aktif per template untuk party yang login; template yang tidak pernah dikirim ke investor tampil sebagai redaksi |
| `src/components/ui/*` | `Logo`, `Redacted` (spec `UIUX.md` 6.3), badge privasi, pill status, tombol role color |

**Momen demo yang sudah didukung UI:** buka 2 tab (Investor 1 & Auditor) — di Investor, baris vote/notice/payout investor lain berupa redaksi dan panel ledger menunjukkan `Vote 1`; di Auditor, baris yang sama berisi data asli dan panel menunjukkan `Vote 3` + `PlatformFeeRecord`. Semua update live lewat WebSocket, tanpa refresh.

**Catatan jujur untuk Q&A:** setelah `TallyVotes`, kontrak `Vote` individual di-archive (dikonsumsi), jadi FundManager/Auditor juga hanya melihat agregat `DealResult` sesudahnya — UI menyatakan ini terang-terangan di section 02.
