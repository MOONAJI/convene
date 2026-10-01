# Laporan Progress Convene — 26 Sept 2026 (+ update 30 Sept)

Rekap semua checklist proyek per akhir sesi 26 Sept, plus rencana sesi berikutnya. Status diambil dari progress tracker di `CLAUDE.md`, `ui/FE.md`, dan `BUSINESSRULES.md` (tidak di-run ulang `daml test` saat laporan 26 Sept ini ditulis; update 30 Sept di bawah sudah termasuk hasil `daml test` terbaru).

**Deadline submission:** 9 Oktober 2026, 23:59 UTC — sisa ±9 hari (per 30 Sept).

## Ringkasan

| Fase | Item | Selesai | Status |
|---|---|---|---|
| B — Core Daml model | 9 | 9 | ✅ Selesai 25 Sept (target 28 Sept) |
| Keputusan aturan bisnis | 4 | 4 | ✅ Final 25 Sept |
| C — Frontend/UI | 6 | 6 | ✅ Selesai 26 Sept (target 3 Okt) |
| Bug hunt + Polish UI | — | — | ✅ Selesai 30 Sept (1 bug kritis ditemukan & diperbaiki, 5 polish UI) |

## Fase B — Core Daml Model

- [x] Definisikan 4 parties: FundManager, Investor (min. 3), Auditor, Platform
- [x] Template `DealProposal` (create + submit)
- [x] Template `Vote` (privat per-investor) + choice `TallyVotes`
- [x] Template `DealResult` (agregat, visible ke semua)
- [x] `IssueCapitalCall` → `CapitalCallNotice` (privat) + `CapitalCallSummary` (agregat)
- [x] `Contribute` → update `FundLedger`
- [x] `TriggerExit` → `PlatformFeeRecord` + `DistributionNotice` (privat) + `DistributionSummary` (agregat)
- [x] Daml Script end-to-end happy path (1 FundManager, 3 Investor, 1 Auditor)
- [x] `daml test`: assert visibility antar-investor

**Bukti (26 Sept):** `daml test` → 25 script lulus (1 happy path, 5 visibility, 14 guard). Happy path, visibility, dan guard juga diverifikasi di Canton sandbox asli (`daml script --ledger-host`). **Update 30 Sept: sekarang 27 script lulus** (2 test baru dari bug hunt, lihat di bawah).

## Keputusan Aturan Bisnis (`BUSINESSRULES.md` bagian 10)

- [x] Approve/Reject: simple majority, 1 LP 1 vote, seri = Rejected, tanpa quorum
- [x] `voteDeadline` ditegakkan; `TallyVotes` boleh setelah deadline atau setelah semua investor vote
- [x] Fee platform final 1% (`defaultPlatformFeeRate = 0.01`)
- [x] Validasi `sum(callAmounts) <= targetCapital` di `IssueCapitalCall`

## Fase C — Frontend/UI

- [x] Design system: palet warna + logo mark (`ui/UIUX.md`, referensi Havu)
- [x] Login / Party Selector (5 role)
- [x] View FundManager: propose deal, lihat DealResult, issue capital call, trigger exit
- [x] View Investor: vote privat, CapitalCallNotice sendiri, kontribusi, DistributionNotice sendiri
- [x] View Auditor: full visibility termasuk `PlatformFeeRecord`
- [x] Dashboard agregat (🟡 should-have) — digabung ke section tiap tahap, bukan halaman terpisah

**Bukti:** diverifikasi end-to-end di `daml start` + browser: propose → 3 vote → tally → capital call 200k/150k/150k → 3 kontribusi → exit 740k (fee 1% = 7.400, distribusi 40/30/30). Redaksi, badge privasi, dan panel ledger view dicek per role.

## Update 30 Sept — Bug Hunt + Polish UI

Dikerjakan sesuai `BUGHUNT-POLISH-CHECKLIST.md`. Detail lengkap per item ada di dokumen itu.

### 🐞 Bug ditemukan & diperbaiki: FundManager bisa mengakali hasil vote

- **Masalah:** setelah `voteDeadline` lewat, FundManager bisa menjalankan `TallyVotes` dengan hanya menyertakan vote "approve" dan membuang vote "reject". Deal dengan 1 setuju / 2 tolak bisa jadi **Approved**. Ini bertentangan dengan klaim "FundManager nakal tidak bisa curang" (`BUSINESSRULES.md` bagian 1) — dan ini persis skenario yang disiapkan juri buat di-tanya pas Q&A.
- **Perbaikan:** template baru **`VoteReceipt`** — mencatat *bahwa* investor sudah vote, tanpa isi pilihannya. Signatory FundManager, observer investor pemilik + Auditor (investor lain tidak melihat). Dibuat oleh `CastVote`, di-archive oleh `TallyVotes`. `TallyVotes` sekarang ditolak ledger kalau ada investor yang punya receipt tapi vote-nya tidak disertakan. Pesan error di UI: *"Every cast vote must be included in the tally."*
- **Kenapa template baru:** key `Vote` dipegang investor, jadi FundManager tidak berwenang mengecek "vote ini tidak ada" lewat `lookupByKey @Vote` (sudah dicoba — tally yang sah ikut gagal).
- **Bukti:** test `Test.Guards:testTallyMustIncludeAllCastVotes`, plus diulang di sandbox asli lewat JSON API.

### Hasil per seksi checklist

- **A. Aturan bisnis** — semua ditegakkan ledger & ada test-nya. `daml test` → **27 script lulus**. Test baru: tally curang, dan `testProportionalDistribution` (kontribusi tidak rata, exit 740k → fee 7.400 dari exit penuh, payout 40/30/30). Rumus approve diganti ke `approveCount > rejectCount` (setara rumus lama, seri tetap Rejected).
- ⚠️ **Catatan penting:** proposal dengan deadline di masa lalu **tidak bisa ditolak saat dibuat** (batasan Daml: `ensure` tidak bisa baca waktu, FundManager satu-satunya signatory). Yang ditegakkan sebagai gantinya: semua vote setelah deadline ditolak → proposal otomatis berakhir Rejected 0 suara. UI juga menolak input deadline yang sudah lewat. Dicatat di `BUSINESSRULES.md` bagian 2 — kalau ditanya juri soal ini, jawabannya: validasi tetap ada, cuma titik penegakannya di `Vote` bukan di `DealProposal`, karena keterbatasan teknis Daml (bukan celah yang kelewatan).
- **B. Privasi** — dicek dari **respons mentah JSON API** per party di sandbox asli (bukan cuma tampilan UI): 67/68 cek lulus; satu yang "gagal" ternyata desain skenario test itu sendiri (notice Investor1/2 sudah ke-archive karena mereka sudah setor), bukan bug beneran. Investor tidak pernah menerima kontrak privat investor lain, `PlatformFeeRecord`, atau `PlatformAgreement`. FundManager & Auditor menerima set kontrak yang sama. Auditor ditolak ledger kalau mencoba aksi apa pun.
- **C. Dokumen** — `BUSINESRULES.md` di-rename jadi **`BUSINESSRULES.md`** (final, semua referensi di `CLAUDE.md` diupdate). Path `ui/FE.md` & `ui/UIUX.md` di `CLAUDE.md` dibetulkan. Baris FundManager di tabel role `BUSINESSRULES.md` disamakan dengan `ARCHITECTURE.md` (FundManager melihat semua kontrak individual, beda dari sesama investor yang saling tersembunyi).
- **D. Polish UI** — 5 perbaikan konsistensi ke `UIUX.md`:
  1. Redaksi di panel ledger view 44px (di bawah minimum 64px spek) → dibetulkan ke 64px.
  2. Glyph balot di halaman login pakai pola garis beda spek → disamakan (6px/4px, dipusatkan ke konstanta bersama `REDACT_PATTERN`).
  3. Paragraf petunjuk login kontras ±3,1:1 (di bawah WCAG AA 4,5:1) → dinaikkan ke ±7,4:1.
  4. Ledger view sekarang ikut menampilkan `VoteReceipt` ("yours only" untuk investor).
  5. Copy di bawah hasil vote menyebut bahwa ledger cuma menerima tally yang menyertakan semua vote.
  - Sudah sesuai sejak awal, tidak diubah: pola redaksi + gembok + `aria-label`, skeleton loading, token warna role/status, font Space Grotesk + Inter, tidak ada teks Indonesia di UI, ukuran & jarak logo.
  - `npm run build` & unit test (7/7) lulus.

### File yang berubah (30 Sept)

- **Daml:** `daml/Convene.daml` (`VoteReceipt`, guard di `TallyVotes`, rumus approve baru), `daml/Test/Guards.daml`, `daml/Test/Visibility.daml`, `daml/Test/HappyPath.daml`. Binding TypeScript `ui/daml.js` di-regenerate.
- **UI:** `lib/fund.ts`, `components/LedgerView.tsx`, `components/LoginScreen.tsx`, `components/ui/Redacted.tsx`, `components/stages/VoteStage.tsx`, plus komentar di `ProposalStage.tsx` & `DistributionStage.tsx`.
- **Dokumen:** `ARCHITECTURE.md` (3.1, 3.2a baru, tabel visibility), `SC.md` bagian 13 (no. 16–17), `BUSINESSRULES.md`, `CLAUDE.md`, `ui/FE.md`, `BUGHUNT-POLISH-CHECKLIST.md`.

## Catatan Penting (masih berlaku)

- **Wallet & token asli belum ada — disengaja.** Integrasi Console Wallet dan token asli (CBTC/cETH/stablecoin) dipotong dari MVP. Kontribusi/distribusi saat ini angka simulasi di kontrak Daml, tidak ada kontrak token/kas yang berpindah. Satu-satunya "token" adalah JWT dev tanpa tanda tangan untuk login (`ui/src/lib/session.ts`).
- **Belum diputuskan:** integrasi wallet/token asli ke Canton testnet — sempat dibahas 29 Sept (nemu daftar mentor HackCanton S3 di Telegram yang bahas wallet/testnet/CC/CIP-56, plus bounty terpisah BitSafe 50.000 CC & Grofty 10.000 CC), tapi belum ada kepastian apakah ini wajib buat submission utama atau cuma buat ikut bounty opsional. **Perlu dicek ke Notion "HackCanton Brief" atau tanya langsung ke mentor/panitia** sebelum dialokasikan waktu.
- **Opsi terbuka lain:** template token simulasi (mis. `CashHolding` yang berkurang saat `Contribute`, bertambah saat distribusi) — bikin demo lebih meyakinkan tanpa integrasi wallet asli, tapi menambah scope. Belum diputuskan.
- ~~**Ketidakcocokan dokumen kecil**~~ — **sudah dibereskan semua per 30 Sept** (rename `BUSINESRULES.md`→`BUSINESSRULES.md`, path `FE.md`/`UIUX.md` di `CLAUDE.md`, baris FundManager di tabel role, plus checkbox Bagian 10 `BUSINESSRULES.md` yang sempat ketinggalan status "final").

## Rencana Sesi Berikutnya (dari 1 Okt)

1. **Restart `daml start`** — template Daml berubah (`VoteReceipt` baru), ledger harus mulai dari kondisi kosong dengan versi baru.
2. **Cek visual UI di browser** (`daml start` + `npm start`) — perubahan 30 Sept baru diverifikasi lewat `daml test`/`npm run build`, **belum dilihat langsung end-to-end di browser**. Wajib dilakukan sebelum rekam demo, karena `VoteReceipt` menyentuh alur vote yang sebelumnya sudah pernah didemoin.
3. **Putuskan soal token simulasi** (`CashHolding`) — lanjut dikerjakan atau tetap future work.
4. **Cek requirement submission HackCanton S3** soal wajib-tidaknya deploy ke testnet + connect wallet, sebelum keputusan token/wallet final.