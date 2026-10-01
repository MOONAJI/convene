# ARCHITECTURE.md — Convene

Arsitektur sistem Convene: party model, state machine kontrak, dan tabel visibility. Ini dokumen paling penting buat pitch juga ("Why Canton" slide) — tabel visibility di bawah adalah bukti teknis konkret dari klaim "transparent to the right eyes, private where it matters".

## 1. Gambaran Umum Sistem

```
┌─────────────────┐        ┌──────────────────────┐        ┌─────────────────────┐
│  React Frontend  │  <-->  │   Daml JSON API       │  <-->  │  Canton Ledger        │
│  (@daml/react)   │  HTTP  │   (bawaan, port 7575) │  gRPC  │  (Sandbox / LocalNet) │
└─────────────────┘        └──────────────────────┘        └─────────────────────┘
                                                                     │
                                                            Daml templates & choices
                                                            (party/authority model)
```

Tidak ada backend custom di antara frontend dan ledger — JSON API bawaan Daml jadi satu-satunya jembatan (lihat `BE.md`). Semua business logic dan aturan visibility hidup di level Daml template (lihat `SC.md`), bukan di layer aplikasi terpisah. Ini keputusan sadar demi kecepatan solo dev, bukan keterbatasan.

## 2. Party Model

| Party | Jumlah | Peran |
|---|---|---|
| **FundManager** | 1 (GP) | Propose deal, tally vote, issue capital call, trigger exit/distribusi |
| **Investor** | Banyak (LP) | Vote, kontribusi, terima distribusi |
| **Auditor** | 1 | Observer di semua kontrak — full visibility, TIDAK punya hak aksi/choice |
| **Platform** | 1 | Representasi Convene sebagai operator — signatory di kontrak fee, biar revenue model (fee % AUM) kelihatan nyata di ledger, bukan cuma angka di UI |

Untuk demo/MVP, minimal 3 Investor dipakai di happy-path script (biar tabel visibility kebukti nyata — investor lain beneran gak lihat punya investor lain).

## 3. Alur Kontrak & State Machine

Alur linear: **Propose → Vote → Tally → Capital Call → Contribute → Trigger Exit → Distribution**

### 3.1 DealProposal
- **Signatory:** FundManager
- **Observer:** semua Investor + Auditor
- **Choice `CastVote`** (nonconsuming, controller: Investor; nama `Vote` bentrok dengan nama template) → membuat kontrak `Vote` terpisah, milik investor yang exercise, plus `VoteReceipt` (bukti "sudah vote", tanpa isi pilihan)
- **Choice `TallyVotes`** (controller: FundManager, dijalankan setelah `voteDeadline` atau setelah semua investor vote) → archive `DealProposal` + semua `Vote` & `VoteReceipt` yang masuk → membuat `DealResult`. Ledger menolak tally yang membuang vote yang sudah masuk (dicek lewat key `VoteReceipt`).

### 3.2 Vote — mekanisme privasi individual
- **Signatory:** Investor (si pemilih)
- **Observer:** FundManager + Auditor — **BUKAN Investor lain**
- Investor lain tidak pernah punya kontrak ini di ledger view mereka. Ini yang bikin klaim "privasi vote individual" nyata secara teknis, bukan sekadar UI yang nyembunyiin data.

### 3.2a VoteReceipt — bukti partisipasi (ditambahkan 30 Sept)
- **Signatory:** FundManager
- **Observer:** Investor pemilik + Auditor — **BUKAN Investor lain**
- Isinya cuma "investor X sudah vote di deal Y", tanpa pilihannya. Key `(fundManager, dealId, investor)` dipegang FundManager, supaya `TallyVotes` bisa membuktikan investor yang tidak ada di daftar vote memang belum vote. Key `Vote` dipegang investor, jadi FundManager tidak berwenang mengecek ketiadaan Vote secara langsung.

### 3.3 DealResult — kontrak agregat
- **Signatory:** FundManager
- **Observer:** semua Investor + Auditor
- Isinya hasil ya/tidak + total suara, TANPA breakdown siapa vote apa.
- **Choice `IssueCapitalCall`** (controller: FundManager, hanya kalau status Approved) → membuat `CapitalCallNotice` per Investor + satu `CapitalCallSummary`

### 3.4 CapitalCallNotice — privat per investor
- **Signatory:** FundManager
- **Observer:** 1 Investor spesifik + Auditor — **BUKAN Investor lain**
- Nominal setoran tiap LP itu privat, cuma kelihatan LP itu sendiri + FundManager + Auditor.
- **Choice `Contribute`** (controller: Investor pemilik) → archive diri sendiri, membuat `Contribution` + update `FundLedger`

### 3.5 CapitalCallSummary — agregat
- **Signatory:** FundManager
- **Observer:** semua Investor + Auditor
- Isinya total target & total sudah terkumpul, TANPA breakdown per-LP.

### 3.6 FundLedger
- **Signatory:** FundManager
- **Observer:** semua Investor + Auditor
- Di-update dengan pola **archive + recreate** tiap ada `Contribution` masuk (state akumulatif fund).
- **Choice `TriggerExit`** (controller: FundManager, input: `exitAmount`) →
  1. Hitung fee Platform (% dari AUM, sesuai Revenue Model FINAL: fee % AUM dipotong otomatis saat Distribution) → membuat `PlatformFeeRecord`
  2. Sisa dana dibagi proporsional ke tiap Investor → membuat `DistributionNotice` per Investor + `DistributionSummary` agregat

### 3.7 PlatformFeeRecord
- Dibuat lewat choice `RecordPlatformFee` di `PlatformAgreement` (kesepakatan fee yang ditandatangani Platform + FundManager lewat propose/accept `PlatformServiceOffer`) — ini sumber otoritas Platform, karena `TriggerExit` sendiri cuma punya otoritas FundManager.
- **Signatory:** FundManager + Platform
- **Observer:** Auditor (bukan Investor — fee ini urusan Platform-FundManager, LP cuma lihat angka net yang mereka terima)

### 3.8 DistributionNotice — privat per investor
- **Signatory:** FundManager
- **Observer:** 1 Investor spesifik + Auditor

### 3.9 DistributionSummary — agregat
- **Signatory:** FundManager
- **Observer:** semua Investor + Auditor

## 4. Tabel Visibility (siapa lihat apa) — inti diferensiasi produk

| Kontrak | FundManager | Investor pemilik | Investor lain | Auditor | Platform |
|---|---|---|---|---|---|
| DealProposal / DealResult | ✅ | ✅ | ✅ (agregat) | ✅ | — |
| Vote (individual) | ✅ | ✅ (punya sendiri) | ❌ | ✅ | — |
| VoteReceipt (individual, tanpa isi vote) | ✅ | ✅ (punya sendiri) | ❌ | ✅ | — |
| CapitalCallNotice (individual) | ✅ | ✅ (punya sendiri) | ❌ | ✅ | — |
| CapitalCallSummary / FundLedger | ✅ | ✅ (agregat) | ✅ (agregat) | ✅ | — |
| Contribution (individual) | ✅ | ✅ (punya sendiri) | ❌ | ✅ | — |
| DistributionNotice (individual) | ✅ | ✅ (punya sendiri) | ❌ | ✅ | — |
| DistributionSummary | ✅ | ✅ (agregat) | ✅ (agregat) | ✅ | — |
| PlatformFeeRecord | ✅ | ❌ | ❌ | ✅ | ✅ |
| PlatformServiceOffer / PlatformAgreement | ✅ | ❌ | ❌ | ✅ | ✅ |

Semua baris tabel ini dibuktikan otomatis oleh `daml/Test/Visibility.daml`.

**Catatan divulgence (penting buat klaim privasi):** di model ledger Daml, pihak yang jadi informee sebuah *consuming* choice (termasuk semua observer kontrak) ikut melihat SELURUH sub-transaksinya. Karena itu choice yang membuat kontrak privat (`TallyVotes`, `IssueCapitalCall`, `TriggerExit`) sengaja dibuat `nonconsuming` + `archive self` — kalau tidak, Vote/Notice milik investor lain ikut ter-divulge ke semua investor walau gak muncul di query.

**Prinsip:** privat di level individual (siapa vote apa, berapa kontribusi/distribusi masing-masing), transparan di level agregat (semua LP lihat total) dan di level audit (FundManager & Auditor lihat semua, termasuk fee). Ini yang membedakan Convene dari public chain biasa (transparan ke semua tanpa pandang bulu) maupun tools tradisional macam spreadsheet (gak ada audit trail immutable sama sekali).

## 5. Daml Design Pattern yang Dipakai

Semua pattern di bawah adalah pattern standar resmi Daml, bukan sesuatu yang diakalin dari nol:

- **Party & Authority model** — dasar visibility per-role (siapa jadi signatory/observer di tiap kontrak)
- **[Multiple Party Agreement Pattern](https://docs.daml.com/daml/patterns/multiparty-agreement.html)** — struktur fund membership (1 FundManager + banyak Investor)
- **[Explicit Contract Disclosure](https://docs.daml.com/app-dev/explicit-contract-disclosure.html)** — mekanisme kasih visibility tambahan terkontrol (dipakai buat akses Auditor tanpa jadi signatory)
- **[Delegation Pattern](https://docs.daml.com/daml/patterns/delegation.html)** — kandidat future work kalau ada skenario LP kasih proxy vote (BUKAN scope MVP)

## 6. Deployment Topology

**Sekarang (dev/MVP):**
- Canton LocalNet lewat `canton-devkit` (Jalur A, butuh Docker) atau Daml Sandbox bawaan `daml start` (Jalur B, fallback)
- Identitas peserta pakai party Daml asli + JWT auth bawaan JSON API (FundManager, tiap Investor, Auditor, Platform masing-masing 1 party/user)
- Aset settlement disimulasikan pakai saldo internal di dalam model Daml sendiri (bukan token asli)

**Nanti (Pilot Plan, BUKAN scope MVP hackathon):**
- Integrasi wallet/custody Canton beneran (mis. Console Wallet)
- Aset settlement asli (stablecoin/tokenized cash-equivalent, atau CBTC/cETH)
- Layer identitas/KYC untuk LP institusional
- Notifikasi off-chain (email) untuk capital call & pengingat vote

## 7. Kenapa Butuh Canton (ringkasan argumen litmus test juri)

Kalau dipindah ke chain yang transparan sepenuhnya: vote individual, jumlah kontribusi, dan strategi alokasi kelihatan semua pihak → LP lain/kompetitor bisa frontrun deal atau meniru strategi, dan LP institusional menolak ikut. Privasi selektif + model otorisasi (role: GP/FundManager, LP/Investor, Auditor) + settlement (capital call, distribution) adalah **inti arsitektur**, bukan tempelan di akhir — persis yang direfleksikan di tabel visibility Bagian 4 di atas.