# Checklist Bug Hunt + Polish UI — Convene (mulai 30 Sept)

Disusun dari `BUSINESSRULES.md`, `ARCHITECTURE.md`, dan `UIUX.md` supaya bug hunt gak asal coba-coba, tapi nge-cek tepat aturan yang udah didokumentasikan. Jalankan sebagai skenario manual di browser (`daml start` + `npm start`), login gonta-ganti role tiap kali dibutuhkan.

## A. Aturan bisnis yang wajib ditegakkan ledger (bukan cuma UI)

- [x] **Propose Deal:** coba propose dengan `voteDeadline` di masa lalu → harus ditolak ledger. — ⚠️ *Tidak bisa ditolak saat create* (ensure Daml pure + FundManager satu-satunya signatory). Yang ditegakkan ledger: semua vote setelah deadline ditolak → proposal otomatis Rejected 0 suara (`testPastDeadlineProposalIsUseless`). UI menolak deadline lewat. Dicatat di `BUSINESSRULES.md` bagian 2.
- [x] **Vote ganda:** investor yang sama coba `Vote` dua kali di deal yang sama → percobaan kedua harus ditolak.
- [x] **Vote di luar daftar:** party yang bukan investor terdaftar di proposal itu coba vote → harus ditolak.
- [x] **Tally sebelum waktunya:** FundManager coba `TallyVotes` sebelum `voteDeadline` lewat DAN sebelum semua investor vote → harus ditolak.
- [x] **Kasus tie (seri):** buat skenario 1 approve — 1 reject (kalau ada 2 investor) atau approve=reject di jumlah investor genap → hasil harus **Rejected**, bukan Approved/error. Ini titik yang paling gampang salah karena kerangka awal `SC.md` pakai rumus placeholder (`approveCount * 2 > totalVotes`) yang beda dari keputusan final (`approveCount > rejectCount`, tie = Rejected).
- [x] **Capital call melebihi target:** FundManager coba `IssueCapitalCall` dengan total `callAmounts` > `targetCapital` proposal → harus ditolak.
- [x] **Kontribusi dobel:** investor coba `Contribute` dua kali di `CapitalCallNotice` yang sama → percobaan kedua harus gagal (notice-nya udah ke-archive di percobaan pertama).
- [x] **Urutan fee vs distribusi:** cek hasil `TriggerExit` — `PlatformFeeRecord` harus dihitung dari `exitAmount` PENUH (bukan dari sisa setelah distribusi), baru sisanya yang didistribusi ke investor.
- [x] **Distribusi proporsional:** dengan kontribusi berbeda (mis. 200k/150k/150k), cek payout tiap investor beneran sebanding porsi kontribusi (40/30/30), bukan dibagi rata 1/3-1/3-1/3.
- [x] **`feePercent` konsisten:** cek semua kalkulasi fee di seluruh siklus pakai angka yang sama (1%) — gak ada tempat yang ke-hardcode beda.

- [x] **🐞 BUG DITEMUKAN & DIPERBAIKI (di luar daftar awal): tally boleh membuang vote.** Setelah deadline, FundManager bisa `TallyVotes` dengan cuma menyertakan vote setuju → deal 1 setuju / 2 tolak jadi *Approved*. Fix: template `VoteReceipt` (key dipegang FundManager) + cek di `TallyVotes`. Test: `testTallyMustIncludeAllCastVotes`; UI menampilkan "Every cast vote must be included in the tally."

**Hasil seksi A (30 Sept):** semua ditegakkan ledger & ada test-nya di `daml/Test/` (27 script lulus). Tambahan test baru: `testProportionalDistribution` (100k/75k/75k, exit 740k → fee 7.400 dari exit penuh, payout 293.040 / 219.780 / 219.780). Juga diverifikasi ulang di sandbox asli via JSON API (deal 200k/150k/150k, exit 740k → angka sama dengan demo UI). Rumus approve diganti ke `approveCount > rejectCount` (setara dengan rumus lama, cuma biar terbaca sama dengan aturan final).

## B. Visibility/privasi — ini yang paling kritis buat klaim ke juri

Login gantian sebagai tiap role, cek BUKAN CUMA tampilan UI tapi juga isi ledger view (data yang benar-benar diterima dari JSON API):

- [x] Login Investor2 → pastikan `Vote`, `CapitalCallNotice`, `DistributionNotice` milik Investor1/Investor3 **sama sekali gak muncul** di ledger view Investor2 (bukan cuma disembunyikan CSS/redaksi — coba cek network tab/response API-nya beneran gak ada kontraknya).
- [x] Login Investor mana pun → pastikan `DealResult`, `CapitalCallSummary`, `DistributionSummary`, `FundLedger` (versi agregat) **tetap muncul**.
- [x] Login Auditor → pastikan semua kontrak termasuk `PlatformFeeRecord` muncul, dan TIDAK ADA tombol aksi apa pun (Auditor read-only).
- [x] Login Investor mana pun → pastikan `PlatformFeeRecord` **tidak pernah muncul** (satu-satunya kontrak yang investor benar-benar di-exclude).
- [x] Login FundManager → pastikan dia melihat SEMUA `Vote`/`CapitalCallNotice`/`DistributionNotice` individual tiap investor (FundManager memang observer penuh, beda dari sesama investor yang saling tersembunyi).

**Hasil seksi B (30 Sept):** dicek dari **respons mentah JSON API** (`/v1/query` per party, data yang sama yang diterima browser), bukan dari tampilan UI — 67/68 cek lulus di sandbox asli. Satu cek gagal karena salah desain script (snapshot diambil setelah notice Investor1/2 sudah di-archive oleh `Contribute`), bukan bug; FundManager melihat notice semua investor dibuktikan `testCapitalCallNoticeNotVisibleToOtherInvestors`. Auditor: tidak ada tombol aksi di UI, dan percobaan exercise dari Auditor ditolak ledger. Catatan: `PlatformAgreement` juga tidak pernah sampai ke investor.

## C. Ketidakcocokan dokumen (sudah dikonfirmasi, tinggal dieksekusi)

- [x] Rename/samakan referensi `BUSINESSRULES.md` vs `BUSINESRULES.md` — file di-rename jadi **`BUSINESSRULES.md`** (ejaan benar, sama dengan judul di dalam file); semua referensi di kode & dokumen ikut diupdate.
- [x] Update daftar "Dokumen Terkait" di `CLAUDE.md` supaya jelas `FE.md` & `UIUX.md` lokasinya di `ui/`, bukan di root.
- [x] ~~`BUSINESSRULES.md` Bagian 3 & 10 belum di-update pas keputusan final diambil 25 Sept~~ — sudah diperbaiki 30 Sept (lihat isi terbaru dokumen tsb).

## D. Polish UI — cek konsistensi ke `UIUX.md`, JANGAN nambah fitur baru

- [x] Pola redaksi: garis 6px tebal, jarak 4px, tinggi blok 26px, lebar bervariasi 64–120px, warna `#3A3D78` solid (bukan transparan), selalu didampingi ikon gembok/badge "Privat", ada `aria-label`.
- [x] Redaksi TIDAK dipakai di tempat yang salah (data agregat, data milik user sendiri, atau loading state — loading harus skeleton abu-abu beranimasi, bukan pola redaksi statis).
- [x] Warna role konsisten di semua komponen: FundManager bronze `#C9A24B`, Investor emerald `#2FA57C`, Auditor steel blue `#5C7A99`, Platform graphite `#6B7280` (jarang tampil).
- [x] Warna status benar: sukses `#2FA57C`, pending `#D9A441`, ditolak pakai rust `#C1503D` (bukan merah tajam).
- [x] Tipografi Space Grotesk (heading) + Inter (body) konsisten, gak ada font fallback browser nyelip di komponen yang lupa di-style.
- [x] Copy UI bahasa Inggris konsisten di SEMUA komponen (juri internasional) — ini digarisbawahi `CLAUDE.md` sebagai gap yang belum dirapikan karena teks tersebar per komponen, belum dipusatkan satu file. Kalau ketemu teks Indonesia nyelip, ganti.
- [x] Kontras teks `ink` (`#F2EFE9`) di atas `bg` (`#0B0D10`) dan `surface` (`#14171B`) masih nyaman dibaca di semua ukuran teks yang dipakai.
- [x] Logo dipakai sesuai aturan pemakaian di `UIUX.md` Bagian 5.5 (ukuran minimum, clear space, versi dark/light yang tepat sesuai background).
- [ ] **Non-goal — jangan dikerjain:** animasi/micro-interaction custom, pixel-perfect polish berlebihan, light mode. Ini sengaja dipotong dari Fase C (`FE.md`), fokus cuma konsistensi penerapan token yang udah ada.

**Hasil seksi D (30 Sept)** — audit kode terhadap `UIUX.md`, yang diperbaiki:
- Redaksi di panel ledger view lebarnya 44px (di bawah minimum 64px) → 64px.
- Glyph balot di halaman login pakai garis 4px/jarak 3px (beda spek) → sekarang pakai pola 6px/4px yang sama dengan `Redacted` (konstanta bersama `REDACT_PATTERN`).
- Paragraf petunjuk di halaman login pakai warna `disabled` (kontras ±3,1:1, di bawah WCAG AA 4,5:1) → `muted` (±7,4:1).
- Ledger view sekarang ikut menampilkan `VoteReceipt` ("yours only" buat investor).
- Copy hasil vote: menyebut bahwa ledger cuma menerima tally yang menyertakan semua vote.

Sudah sesuai, tidak diubah: redaksi 6px/4px/26px warna `#3A3D78` solid + gembok + `aria-label`; loading pakai skeleton beranimasi (bukan redaksi); token warna role & status (rust `#C1503D` buat ditolak); Space Grotesk + Inter dari Google Fonts, input/tombol mewarisi font; tidak ada teks Indonesia di UI; `ink` di atas `bg`/`surface` kontras tinggi; logo navbar 28px (rentang 24–32px), jarak mark ke teks 10px ≈ 0,35× tinggi mark. **Belum dicek visual di browser** (cuma audit kode + `npm run build`) — sebaiknya dilihat sekali sebelum rekam demo.

## Urutan yang disarankan

1. Jalankan seksi A & B dulu (bug hunt aturan bisnis + privasi) — ini yang paling menentukan kredibilitas demo ke juri.
2. Beresin seksi C (housekeeping dokumen) — cepat, sambil nunggu hasil testing di kepala dingin.
3. Baru masuk seksi D (polish UI) — supaya polish gak dilakuin di atas kode yang ternyata masih ada bug logika.