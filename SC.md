# SC.md — Smart Contract Spec Convene (Daml)

Dokumen kerja utama buat Fase B. Berisi kerangka kode Daml buat tiap template/choice sesuai Technical Design yang sudah difinalisasi (lihat `ARCHITECTURE.md` buat penjelasan visibility & alasan desainnya). Kode di bawah ini kerangka acuan — sesuaikan syntax detail pas benar-benar nulis di editor (VS Code bakal langsung kasih tau kalau ada typo/syntax error lewat Daml language server).

**Urutan implementasi yang disarankan** (ikuti Progress Tracker di `CLAUDE.md`): Party & User Setup → DealProposal → Vote + TallyVotes → DealResult → CapitalCall → Contribute + FundLedger → TriggerExit + Distribution → Daml Script end-to-end → daml test.

Taruh semua modul baru ini di file terpisah dari `User.daml` bawaan template, mis. `daml/Convene.daml`.

---

## 0. Party & User Setup

Ganti/tambah di `daml/Setup.daml` (atau modul init script baru), mengikuti pola bawaan `alice`/`bob` tapi pakai role asli Convene. Inget: Ledger API User ID **wajib huruf kecil semua**.

```haskell
module Setup where

import Daml.Script

setupConvene : Script ()
setupConvene = do
  fundManager <- allocatePartyWithHint "FundManager" (PartyIdHint "FundManager")
  investor1   <- allocatePartyWithHint "Investor1" (PartyIdHint "Investor1")
  investor2   <- allocatePartyWithHint "Investor2" (PartyIdHint "Investor2")
  investor3   <- allocatePartyWithHint "Investor3" (PartyIdHint "Investor3")
  auditor     <- allocatePartyWithHint "Auditor" (PartyIdHint "Auditor")
  platform    <- allocatePartyWithHint "Platform" (PartyIdHint "Platform")

  fundManagerId <- validateUserId "fundmanager"
  investor1Id   <- validateUserId "investor1"
  investor2Id   <- validateUserId "investor2"
  investor3Id   <- validateUserId "investor3"
  auditorId     <- validateUserId "auditor"
  platformId    <- validateUserId "platform"

  createUser (User fundManagerId (Some fundManager)) [CanActAs fundManager]
  createUser (User investor1Id (Some investor1)) [CanActAs investor1]
  createUser (User investor2Id (Some investor2)) [CanActAs investor2]
  createUser (User investor3Id (Some investor3)) [CanActAs investor3]
  createUser (User auditorId (Some auditor)) [CanActAs auditor]
  createUser (User platformId (Some platform)) [CanActAs platform]

  pure ()
```

Di `daml.yaml`, arahkan `init-script:` ke `Setup:setupConvene` (bisa gandeng sama init script bawaan lewat urutan module, atau ganti sepenuhnya kalau `alice`/`bob` udah gak dibutuhin lagi). Setelah ini, login di frontend pakai `fundmanager`, `investor1`, `investor2`, `investor3`, `auditor`, `platform` (bukan `alice`/`bob` lagi).

---

## 1. DealProposal

```haskell
template DealProposal
  with
    fundManager   : Party
    investors     : [Party]
    auditor       : Party
    dealId        : Text
    description   : Text
    targetCapital : Decimal
    voteDeadline  : Time
  where
    signatory fundManager
    observer investors, auditor

    key (fundManager, dealId) : (Party, Text)
    maintainer key._1

    nonconsuming choice Vote : ContractId Vote
      with
        investor : Party
        approve  : Bool
      controller investor
      do
        assertMsg "Investor must be part of this deal" (investor `elem` investors)
        create Vote with
          fundManager
          investor
          auditor
          dealId
          approve

    choice TallyVotes : ContractId DealResult
      with
        voteCids : [ContractId Vote]
      controller fundManager
      do
        votes <- mapA fetch voteCids
        mapA_ archive voteCids
        let approveCount = length (filter (\v -> v.approve) votes)
            totalVotes   = length votes
            isApproved   = approveCount * 2 > totalVotes  -- simple majority; sesuaikan aturan quorum kalau perlu
        create DealResult with
          fundManager
          investors
          auditor
          dealId
          approved   = isApproved
          approveCount
          totalVotes
```

Catatan: `TallyVotes` butuh daftar `ContractId Vote` sebagai argumen (frontend/script yang nge-query lalu ngirim list ini) karena Daml gak punya "query semua kontrak dari dalam choice" — harus eksplisit direferensikan.

---

## 2. Vote (privat per-investor)

```haskell
template Vote
  with
    fundManager : Party
    investor    : Party
    auditor     : Party
    dealId      : Text
    approve     : Bool
  where
    signatory investor
    observer fundManager, auditor
    -- SENGAJA tidak ada investor lain di observer — ini mekanisme privasi individualnya
```

---

## 3. DealResult (agregat)

```haskell
template DealResult
  with
    fundManager  : Party
    investors    : [Party]
    auditor      : Party
    dealId       : Text
    approved     : Bool
    approveCount : Int
    totalVotes   : Int
  where
    signatory fundManager
    observer investors, auditor

    nonconsuming choice IssueCapitalCall : (ContractId CapitalCallSummary, [ContractId CapitalCallNotice])
      with
        callAmounts : [(Party, Decimal)]  -- daftar (investor, nominal yang harus disetor)
      controller fundManager
      do
        assertMsg "Deal must be approved before issuing capital call" approved
        notices <- mapA
          (\(inv, amt) -> create CapitalCallNotice with
            fundManager
            investor = inv
            auditor
            dealId
            amount = amt)
          callAmounts
        let totalTarget = sum (map snd callAmounts)
        summary <- create CapitalCallSummary with
          fundManager
          investors
          auditor
          dealId
          totalTarget
          totalCollected = 0.0
        pure (summary, notices)
```

---

## 4. CapitalCallNotice (privat per-investor)

```haskell
template CapitalCallNotice
  with
    fundManager : Party
    investor    : Party
    auditor     : Party
    dealId      : Text
    amount      : Decimal
  where
    signatory fundManager
    observer investor, auditor
    -- BUKAN observer investor lain — nominal setoran tiap LP privat

    choice Contribute : ContractId FundLedger
      with
        fundLedgerCid : ContractId FundLedger
      controller investor
      do
        create Contribution with
          fundManager
          investor
          auditor
          dealId
          amount
        ledger <- fetch fundLedgerCid
        archive fundLedgerCid
        create ledger with
          totalContributed = ledger.totalContributed + amount
          contributions    = (investor, amount) :: ledger.contributions
```

---

## 5. CapitalCallSummary (agregat)

```haskell
template CapitalCallSummary
  with
    fundManager    : Party
    investors      : [Party]
    auditor        : Party
    dealId         : Text
    totalTarget    : Decimal
    totalCollected : Decimal
  where
    signatory fundManager
    observer investors, auditor
    -- Update totalCollected via archive+recreate tiap ada Contribute masuk (sinkron sama FundLedger)
```

---

## 6. Contribution (record, dibuat oleh choice Contribute)

```haskell
template Contribution
  with
    fundManager : Party
    investor    : Party
    auditor     : Party
    dealId      : Text
    amount      : Decimal
  where
    signatory investor
    observer fundManager, auditor
    -- Privat, sama seperti CapitalCallNotice — jejak kontribusi individual
```

---

## 7. FundLedger

```haskell
template FundLedger
  with
    fundManager       : Party
    investors         : [Party]
    auditor           : Party
    dealId            : Text
    totalContributed  : Decimal
    contributions     : [(Party, Decimal)]  -- akumulasi kontribusi per investor, buat hitung proporsi distribusi
  where
    signatory fundManager
    observer investors, auditor

    choice TriggerExit : (ContractId PlatformFeeRecord, ContractId DistributionSummary, [ContractId DistributionNotice])
      with
        exitAmount   : Decimal
        platform     : Party
        feePercent   : Decimal  -- mis. 0.01 buat 1%
      controller fundManager
      do
        let feeAmount = exitAmount * feePercent
            netAmount = exitAmount - feeAmount

        feeRecord <- create PlatformFeeRecord with
          fundManager
          platform
          auditor
          dealId
          feeAmount

        -- distribusi proporsional berdasarkan share kontribusi tiap investor
        let distribute (inv, contributed) =
              let share = contributed / totalContributed
                  payout = netAmount * share
              in (inv, payout)
            payouts = map distribute contributions

        notices <- mapA
          (\(inv, payout) -> create DistributionNotice with
            fundManager
            investor = inv
            auditor
            dealId
            payout)
          payouts

        summary <- create DistributionSummary with
          fundManager
          investors
          auditor
          dealId
          totalDistributed = netAmount

        pure (feeRecord, summary, notices)
```

---

## 8. PlatformFeeRecord

```haskell
template PlatformFeeRecord
  with
    fundManager : Party
    platform    : Party
    auditor     : Party
    dealId      : Text
    feeAmount   : Decimal
  where
    signatory fundManager, platform
    observer auditor
    -- BUKAN observer investor — fee ini urusan Platform-FundManager, LP cuma lihat angka net
```

---

## 9. DistributionNotice (privat per-investor)

```haskell
template DistributionNotice
  with
    fundManager : Party
    investor    : Party
    auditor     : Party
    dealId      : Text
    payout      : Decimal
  where
    signatory fundManager
    observer investor, auditor
```

---

## 10. DistributionSummary (agregat)

```haskell
template DistributionSummary
  with
    fundManager       : Party
    investors         : [Party]
    auditor           : Party
    dealId            : Text
    totalDistributed  : Decimal
  where
    signatory fundManager
    observer investors, auditor
```

---

## 11. Daml Script: Happy Path End-to-End

Kerangka skenario buat `daml test` / `daml script` — jalanin manual dulu buat verifikasi state machine sebelum nulis assertion visibility.

```haskell
module Test.HappyPath where

import Daml.Script
import Convene

happyPath : Script ()
happyPath = do
  fundManager <- allocateParty "FundManager"
  investor1   <- allocateParty "Investor1"
  investor2   <- allocateParty "Investor2"
  investor3   <- allocateParty "Investor3"
  auditor     <- allocateParty "Auditor"
  platform    <- allocateParty "Platform"

  now <- getTime
  let investors = [investor1, investor2, investor3]

  proposalCid <- submit fundManager do
    createCmd DealProposal with
      fundManager
      investors
      auditor
      dealId = "deal-1"
      description = "Seed round startup X"
      targetCapital = 300000.0
      voteDeadline = addRelTime now (days 7)

  vote1Cid <- submit investor1 do
    exerciseCmd proposalCid Vote with investor = investor1, approve = True
  vote2Cid <- submit investor2 do
    exerciseCmd proposalCid Vote with investor = investor2, approve = True
  vote3Cid <- submit investor3 do
    exerciseCmd proposalCid Vote with investor = investor3, approve = False

  resultCid <- submit fundManager do
    exerciseCmd proposalCid TallyVotes with voteCids = [vote1Cid, vote2Cid, vote3Cid]

  (summaryCid, noticeCids) <- submit fundManager do
    exerciseCmd resultCid IssueCapitalCall with
      callAmounts = [(investor1, 100000.0), (investor2, 100000.0), (investor3, 100000.0)]

  -- lanjutkan: tiap investor exercise Contribute pakai notice masing-masing,
  -- lalu FundManager exercise TriggerExit di FundLedger terakhir.
  pure ()
```

Lengkapi bagian `Contribute` dan `TriggerExit` setelah `FundLedger` awal dibuat (perlu 1 `FundLedger` kosong dibikin bareng `CapitalCallSummary` di `IssueCapitalCall`, atau dibuat terpisah — putuskan salah satu saat implementasi dan catat balik di sini).

---

## 12. daml test — Assertion Visibility (kerangka)

```haskell
module Test.Visibility where

import Daml.Script
import DA.Assert

testVoteNotVisibleToOtherInvestors : Script ()
testVoteNotVisibleToOtherInvestors = do
  -- setup parties + DealProposal + Vote seperti happyPath ...
  -- lalu:
  investor2Votes <- query @Vote investor2
  -- assert bahwa investor2 CUMA lihat Vote miliknya sendiri, bukan milik investor1/investor3
  assertEq (length investor2Votes) 1
```

Ulangi pola yang sama buat `CapitalCallNotice` dan `DistributionNotice` — ini pengujian paling penting di seluruh proyek karena langsung membuktikan klaim privasi selektif yang jadi diferensiator utama Convene di depan juri.

---

## Catatan Implementasi

- Kode di atas kerangka acuan, bukan final — sesuaikan nama field/tipe data saat benar-benar ditulis di editor, ikuti feedback Daml language server (VS Code).
- `feePercent` di `TriggerExit` sebaiknya jadi konstanta yang gampang diubah (mis. taruh di `daml.yaml` custom field atau hardcode dengan komentar jelas) — biar gampang ditunjuk pas demo/pitch bagian Business Model.
- Kalau waktu Fase B molor, PRIORITASKAN sampai `TriggerExit` + happy path script jalan — `daml test` assertion visibility (item terakhir) boleh disederhanakan kalau kepepet, tapi jangan dihapus total karena itu bukti teknis utama buat klaim privasi di pitch.
---

## 13. Keputusan Implementasi Final (25 Sept) — beda dari kerangka di atas

Kode final ada di `daml/Convene.daml`; kerangka di bagian 1–12 dibiarkan sebagai referensi desain awal. Perubahan & alasannya:

| # | Kerangka awal | Implementasi final | Alasan |
|---|---|---|---|
| 1 | Choice `Vote` di `DealProposal` | Di-rename **`CastVote`** | Nama choice jadi tipe data di modul → bentrok dengan template `Vote` (compile error). |
| 2 | `TallyVotes` pakai `archive` langsung ke Vote | Vote punya choice **`ConsumeVote`** (controller FundManager) | Signatory Vote = investor; FundManager gak punya otoritas `archive`. |
| 3 | "Investor cuma boleh vote sekali" belum ditegakkan | Vote punya **key** `(investor, fundManager, dealId)` + `lookupByKey` di `CastVote`; `CastVote` juga cek `now < voteDeadline` | Aturan bisnis wajib di level ledger (BE.md bagian 5). |
| 4 | `TallyVotes` jalan kapan saja | Boleh kalau `now >= voteDeadline` **atau** semua investor sudah vote; validasi vote milik deal ini, tanpa duplikat | Biar demo gak perlu nunggu 7 hari, tapi tetap aman. |
| 5 | `TallyVotes`, `IssueCapitalCall`, `TriggerExit` consuming/nonconsuming campur | Ketiganya **`nonconsuming` + `archive self`** | Consuming choice di kontrak ber-observer semua investor bikin sub-transaksi (Vote/Notice/fee orang lain) ter-divulge ke semua investor. |
| 6 | `IssueCapitalCall` bisa dipanggil berkali-kali | `DealResult.capitalCallIssued` (archive + recreate), total `callAmounts` ≤ `targetCapital` (BUSINESSRULES.md bagian 4), tiap investor maks 1x, nominal > 0 | Cegah capital call ganda / nominal ngawur. |
| 7 | `callAmounts : [(Party, Decimal)]` | `[CallAmount]` (record `investor`, `amount`) | Lebih enak dipakai dari TypeScript (`daml.js`). |
| 8 | `FundLedger` awal: "putuskan saat implementasi" | **Dibuat di `IssueCapitalCall`** bersama `CapitalCallSummary` (totalContributed = 0) | Satu langkah, frontend gak perlu create manual. |
| 9 | `FundLedger.contributions : [(Party, Decimal)]` | **Dihapus.** `TriggerExit` terima `contributionCids : [ContractId Contribution]`, validasi total = `totalContributed` | FundLedger visible ke semua investor → breakdown per-LP bocor. |
| 10 | `Contribute` terima `fundLedgerCid` | Tanpa argumen; `FundLedger` & `CapitalCallSummary` di-update via **contract key** `(fundManager, dealId)` (`RecordContribution`, `RecordCollected` — argumen cuma nominal, tanpa identitas investor) | Frontend cukup exercise `Contribute`; `CapitalCallSummary.totalCollected` ikut sinkron. Return: `ContractId Contribution`. |
| 11 | `PlatformFeeRecord` dibuat langsung di `TriggerExit` | Lewat **`PlatformAgreement.RecordPlatformFee`**. Agreement dibuat via `PlatformServiceOffer` (Platform) → `AcceptPlatformService` (FundManager). `TriggerExit` terima `platformAgreementCid` | Signatory Platform butuh otoritas Platform. Bonus pitch: tarif fee disepakati & tercatat di ledger. |
| 12 | `feePercent` argumen `TriggerExit` | `feeRate` di `PlatformAgreement`; default `defaultPlatformFeeRate = 0.01` (1%) di `Convene.daml` | Konstanta gampang ditunjuk saat pitch Business Model. |
| 13 | Payout `netAmount * (contributed / total)` | `netAmount * contributed / total` (kali dulu) | Presisi Decimal: 1/3 × 445.500 jadi pas 148.500, bukan 148.499,99…. |
| 14 | `TriggerExit` nonconsuming di FundLedger | FundLedger di-archive setelah exit (fund ditutup) | Cegah exit/distribusi ganda. |
| 16 | `TallyVotes` menerima `voteCids` apa adanya | Template baru **`VoteReceipt`** (signatory FundManager, key `(fundManager, dealId, investor)`), dibuat `CastVote`, di-archive `TallyVotes`. Investor yang tidak ada di `voteCids` wajib tidak punya receipt (`lookupByKey`) | **Bug fix 30 Sept:** setelah deadline, FundManager bisa tally dengan cuma menyertakan vote setuju → deal lolos walau mayoritas menolak. `lookupByKey @Vote` tidak bisa dipakai karena maintainer-nya investor (FundManager tidak berwenang). Test: `Test.Guards:testTallyMustIncludeAllCastVotes`. |
| 17 | `approved = approveCount * 2 > totalVotes` | `approved = approveCount > rejectCount` | Setara secara matematis (seri tetap Rejected), tapi sekarang terbaca persis sama dengan aturan final BUSINESSRULES.md bagian 3. |
| 15 | — | Field tambahan: `DealResult.description/targetCapital/rejectCount/capitalCallIssued`, `DistributionNotice.contributed`, `DistributionSummary.totalContributed`, `PlatformFeeRecord.grossAmount/feeRate` | Data yang dibutuhkan UI/audit. `DistributionSummary` sengaja tanpa `exitAmount` biar fee gak bisa diturunkan LP. |

### Setup (bagian 0)
- `daml.yaml` → `init-script: Setup:setupConvene`. Script ini juga menjalankan `setup` bawaan (alice/bob tetap ada buat smoke test), lalu membuat user `fundmanager`, `investor1`–`investor3`, `auditor`, `platform` (idempotent: aman dijalankan ulang), plus `PlatformAgreement` fee 1%.

### Menjalankan test
- `daml test` → semua skenario (IDE ledger).
- Ke ledger live (mis. saat `daml start` jalan): `daml script --dar .daml/dist/convene-0.1.0.dar --script-name Test.HappyPath:happyPath --ledger-host localhost --ledger-port 6865`. Test fixture pakai `allocateParty` (bukan hint tetap) jadi gak bentrok dengan party init script.

### Contoh angka happy path (`Test/HappyPath.daml`)
3 investor × 100.000 = 300.000 → exit 450.000 → fee Platform 1% = 4.500 → net 445.500 → masing-masing LP dapat 148.500.
