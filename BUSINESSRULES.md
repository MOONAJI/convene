# BUSINESSRULES.md — Convene

> **Catatan 30 Sept:** Semua item "Keputusan Terbuka" di Bagian 10 sudah difinalkan 25 Sept (lihat `LAPORAN.md`/`CLAUDE.md`). Bagian 3 & 10 di bawah sudah diupdate supaya gak lagi bilang "belum final" — sebelumnya dokumen ini gak ikut ke-update pas keputusan itu diambil, jadi sempat ketinggalan.

Aturan bisnis & constraint yang harus ditegakkan di level kontrak Daml (`assertMsg`, precondition di choice) maupun di level UX frontend. Dokumen ini jawab pertanyaan "boleh/gak boleh ngapain, dan kenapa" — beda dari `SC.md` (kerangka kode) dan `ARCHITECTURE.md` (struktur kontrak & visibility).

## 1. Role & Kewenangan (siapa boleh ngapain)

| Aksi | FundManager | Investor | Auditor | Platform |
|---|---|---|---|---|
| Propose deal (`DealProposal`) | ✅ | ❌ | ❌ | ❌ |
| Vote setuju/tolak | ❌ | ✅ (cuma buat deal yang dia jadi anggota) | ❌ | ❌ |
| Tally vote → `DealResult` | ✅ | ❌ | ❌ | ❌ |
| Issue capital call | ✅ (cuma kalau `DealResult` Approved) | ❌ | ❌ | ❌ |
| Kontribusi dana | ❌ | ✅ (cuma sesuai notice miliknya) | ❌ | ❌ |
| Trigger exit/distribusi | ✅ | ❌ | ❌ | ❌ |
| Lihat semua kontrak (termasuk `PlatformFeeRecord`) | ✅ (observer/signatory semua kontrak siklus fund, dibutuhkan buat tally — sesuai tabel `ARCHITECTURE.md`) | ❌ | ✅ | ❌ (cuma lihat `PlatformFeeRecord` + `PlatformAgreement`) |
| Terima fee | ❌ | ❌ | ❌ | ✅ (otomatis, bukan manual transfer) |

**Prinsip inti (jawaban ke Q&A juri soal FundManager nakal):** Daml authorization model gak ngizinin FundManager bikin kontrak yang butuh consent LP tanpa signature LP yang sesuai. Semua choice tercatat permanen & immutable. Auditor punya visibility penuh buat cross-check independen kapan aja — ini yang harus ditegakkan secara teknis, bukan cuma diklaim di pitch.

## 2. Aturan Propose Deal

- Cuma FundManager yang boleh bikin `DealProposal`.
- `voteDeadline` wajib di masa depan saat proposal dibuat. **Cara penegakannya (30 Sept):** `ensure` Daml bersifat pure (gak bisa baca waktu), dan FundManager sebagai satu-satunya signatory selalu bisa `create` langsung, jadi ledger tidak bisa menolak proposal ber-deadline lewat saat dibuat. Yang ditegakkan ledger: `CastVote` menolak semua vote setelah deadline, sehingga proposal seperti itu tidak bisa di-vote dan tally-nya otomatis Rejected (0 suara) — dibuktikan `Test.Guards:testPastDeadlineProposalIsUseless`. Form propose di UI juga menolak deadline di masa lalu.
- Daftar `investors` di proposal harus persis anggota fund yang terdaftar (bukan sembarang party) — kalau ada multi-fund di masa depan (BUKAN scope MVP), ini butuh entity `FundMembership` terpisah; buat MVP, daftar investor cukup di-hardcode/diisi manual saat propose.

## 3. Aturan Voting

- **1 investor cuma boleh vote 1 kali per deal.** Constraint ini harus ditegakkan di choice `Vote` — cara paling aman: `Vote` punya `key (fundManager, investor, dealId)` biar Daml otomatis nolak kalau ada key duplikat, atau exercise `Vote` konsumsikan sesuatu di `DealProposal` per-investor.
- Investor yang boleh vote HARUS ada di daftar `investors` milik `DealProposal` (`assertMsg` di choice `Vote`, sudah ada di kerangka `SC.md`).
- **✅ FINAL (25 Sept) — aturan Approve/Reject:** **1 LP 1 vote**, simple majority (`approveCount > rejectCount`), **seri dihitung Rejected**, tanpa quorum minimum. Opsi "bobot sesuai kontribusi/komitmen modal" resmi TIDAK dipakai. ✅ Dicek 30 Sept: kode sekarang pakai `approveCount > rejectCount` (rumus lama `approveCount * 2 > totalVotes` ternyata setara, seri tetap Rejected) — dibuktikan `Test.Guards:testTieIsRejected`.
- `TallyVotes` cuma bisa dijalankan FundManager. **✅ FINAL (25 Sept): `voteDeadline` DITEGAKKAN** (bukan diabaikan) — `TallyVotes` valid kalau `voteDeadline` sudah lewat ATAU semua investor yang diharapkan sudah vote. Cek pas bug hunt: coba tally sebelum deadline & sebelum semua vote masuk, harus ditolak ledger.
- **Tally wajib menyertakan SEMUA vote yang sudah masuk (30 Sept).** FundManager gak boleh membuang vote (mis. cuma nyertain vote setuju setelah deadline biar deal lolos). Ditegakkan lewat `VoteReceipt` — lihat `ARCHITECTURE.md` 3.2a & `SC.md` bagian 13 no. 16.
- Vote yang udah masuk gak bisa diubah (`Vote` immutable, gak ada choice `ChangeVote` di MVP — ini sengaja disederhanakan, bukan lupa).

## 4. Aturan Capital Call

- `IssueCapitalCall` cuma valid kalau `DealResult.approved == True` (`assertMsg`, sudah ada di kerangka `SC.md`).
- **✅ FINAL (25 Sept):** validasi `sum(callAmounts) <= targetCapital` DITAMBAHKAN (bukan di-skip). Cek pas bug hunt: coba `IssueCapitalCall` dengan total `callAmounts` melebihi `targetCapital`, harus ditolak ledger dengan `assertMsg` yang jelas.
- Tiap investor cuma dapat **1 `CapitalCallNotice`** per capital call round (bukan per investor per deal — kalau ada capital call kedua buat deal yang sama, itu di luar scope MVP, cukup 1 round).

## 5. Aturan Kontribusi

- Investor cuma boleh exercise `Contribute` di `CapitalCallNotice` **miliknya sendiri** — ini otomatis terjamin karena `controller investor` di kontrak yang `observer`-nya cuma investor itu (gak perlu assertMsg tambahan, dijamin model kontrak).
- **DIPOTONG dari MVP (sengaja, per breakdown Langkah 4):** validasi "kontribusi harus PAS sama nominal capital call" atau "kontribusi kurang dari capital call" — di MVP asumsikan investor selalu kontribusi PAS sesuai `amount` di notice-nya (happy path). Kalau ada waktu longgar ekstra, ini kandidat pertama buat ditambahin balik (lihat `CLAUDE.md` prioritas kalau ada waktu longgar).
- Investor cuma boleh kontribusi 1 kali per `CapitalCallNotice` (otomatis terjamin — choice `Contribute` meng-archive `CapitalCallNotice` itu sendiri, jadi gak bisa dieksekusi dua kali).

## 6. Aturan Exit & Distribusi

- `TriggerExit` cuma bisa dijalankan FundManager, exercise di `FundLedger` (bukan di kontrak lain).
- **Fee Platform dipotong LEBIH DULU, baru sisanya didistribusi** — urutan ini FINAL sesuai Revenue Model (Opsi 2: fee % AUM dipotong otomatis saat Distribution). Jangan dibalik urutannya (distribusi dulu baru fee) — itu mengubah makna klaim "settlement logic otomatis & auditable" yang jadi bahan pitch Business Model.
- Distribusi ke tiap investor **proporsional terhadap kontribusi mereka** (`payout = netAmount * (contributed / totalContributed)`), BUKAN dibagi rata per kepala. Ini konsisten dengan konsep "LP kontribusi sesuai porsi" dari alur inti MVP.
- `feePercent` harus konsisten dipakai di seluruh siklus (jangan berubah-ubah antar demo) — simpan sebagai satu konstanta yang gampang ditunjuk pas pitch bagian Business Model (lihat catatan di `SC.md` bagian Catatan Implementasi).
- **DIPOTONG dari MVP:** exit sebagian (partial exit) atau multi-round exit — MVP cuma simulasikan 1x full exit per deal/fund.

## 7. Aturan Visibility (ringkasan dari sudut pandang bisnis — detail teknis di `ARCHITECTURE.md`)

- **Privat di level individual:** siapa vote apa, berapa kontribusi tiap LP, berapa distribusi tiap LP — TIDAK PERNAH boleh bocor ke investor lain lewat mekanisme apapun (bukan cuma disembunyikan di UI, tapi beneran gak ada di ledger view mereka).
- **Transparan di level agregat:** semua investor SELALU bisa lihat hasil total (approve/reject count, total dana terkumpul, total distribusi) — jangan sampai fitur privasi individual malah nyembunyiin data agregat yang harusnya publik ke semua anggota fund.
- **Transparan penuh ke Auditor & FundManager:** kedua role ini harus selalu jadi observer di SEMUA kontrak siklus fund (kecuali Auditor di `PlatformFeeRecord` — itu dia tetap observer, cuma Investor yang di-exclude dari situ).
- Kalau nanti nambah template baru di luar yang udah didesain, **selalu cek dulu ke tabel visibility `ARCHITECTURE.md`** sebelum nentuin signatory/observer — jangan asal ikutin pola template lain tanpa mikirin siapa yang seharusnya (gak) lihat.

## 8. Aturan Revenue Model (FINAL, jangan diubah tanpa alasan kuat)

- Fee dibebankan ke **fund/FundManager**, bukan ke Investor secara langsung — Investor tetap cuma lihat angka **net** yang mereka terima (pengalaman LP tetap bersih, gak perlu tau detail perhitungan fee).
- Fee % dari AUM, dipotong **otomatis** saat Distribution (bukan ditagih terpisah, bukan manual).
- `PlatformFeeRecord` HARUS jadi bukti settlement yang auditable — Auditor harus bisa cross-check `feeAmount` itu match dengan `feePercent × exitAmount` kapan aja.

## 9. Hal yang Sengaja TIDAK Divalidasi/Ditangani di MVP (bukan bug, ini scope cut resmi)

Referensi dari breakdown MVP Langkah 4 — jangan buang waktu implementasi ini di Fase B, ini future work:

- Quorum minimum buat vote (\"vote ditolak karena quorum gak tercapai\")
- Kontribusi kurang/lebih dari nominal capital call
- Multi-fund / multi-round dalam satu platform
- Voting dengan bobot kompleks (quadratic voting, dst)
- Secondary market buat LP jual/transfer posisi
- Proxy vote / delegasi (kandidat Delegation Pattern, future work)
- Partial exit / multi-round exit
- Notifikasi otomatis (email) ke LP soal capital call/reminder vote
- KYC/identitas LP institusional beneran, integrasi wallet Canton asli (Console Wallet dst) — MVP cukup party Daml + JWT

## 10. Keputusan Terbuka — SEMUA SUDAH DIFINALKAN (25 Sept)

Checklist ini awalnya di luar Progress Tracker utama di `CLAUDE.md`; semua item di bawah sudah diputuskan final 25 Sept (lihat `LAPORAN.md`). Ditinggal dalam bentuk checklist supaya gampang dipakai sebagai daftar cek pas bug hunt — pastikan implementasi kode beneran cocok sama tiap keputusan ini:

- [x] Aturan Approve/Reject: **simple majority, 1 LP 1 vote, seri = Rejected, tanpa quorum** (lihat Bagian 3)
- [x] `voteDeadline` **ditegakkan** — `TallyVotes` boleh setelah deadline lewat ATAU setelah semua investor vote
- [x] `feePercent` final: **1%** (`defaultPlatformFeeRate = 0.01`), konsisten di semua demo/pitch
- [x] Validasi `sum(callAmounts) <= targetCapital` **ditambahkan** di `IssueCapitalCall` (lihat Bagian 4)