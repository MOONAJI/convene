# UIUX.md — Design System & Referensi Visual Convene

Dokumen ini fokus murni ke keputusan visual: riset referensi, palet warna, tipografi, logo final (Lens C), dan pola redaksi untuk data privat. Implementasi teknis — inventaris halaman/view yang dibangun, konfigurasi Tailwind di project, progress tracker Fase C — dipindah ke `FE.md` biar dua dokumen ini gak tumpang tindih: **UIUX.md = keputusan desain "kenapa & apa"**, **FE.md = eksekusi "gimana & kapan"**.

## 1. Riset Referensi (4 kandidat dari Yuna)

| Situs | Gaya | Kenapa cocok/gak cocok buat Convene |
|---|---|---|
| [creativeans.com](https://www.creativeans.com/) | Agency kreatif — putih + navy, glass effect, 3D whimsical, portfolio-driven | Terlalu "brand agency" — nuansa playful/portfolio kurang pas buat produk fintech-infra yang harus terasa serius soal uang orang lain |
| **[havu.cc](https://www.havu.cc/en)** | **Minimal, dark, high-contrast, section bernomor (01-10), diagram "system blueprint"** | **Terpilih — lihat Bagian 2** |
| [tryclico.com](https://tryclico.com/) | Biru-teal + aksen coral, imagery AI-generated, ceria | Nuansa "creative AI tool" konsumer, kurang pas buat produk yang harus terasa auditable & institusional |
| [wisprflow.ai](https://wisprflow.ai/) | Monokrom hitam-putih, before/after demo, sangat clean | Bagus buat clarity fungsional tapi terlalu "consumer productivity app" buat jadi identitas utama |

## 2. Kenapa Havu Paling Cocok

Havu dipilih sebagai referensi visual utama Convene, dengan alasan:

- **Struktur bernomor sekuensial (01→10)** di Havu cocok banget ditiru buat menampilkan alur inti Convene yang juga linear: Propose → Vote → Capital Call → Contribute → Distribution. Ini bukan cuma gaya visual, tapi cara alami buat mengkomunikasikan state machine produk.
- **Diagram "system blueprint"** mereka (memvisualisasikan aktor & proses yang saling terhubung) persis pola yang Convene butuh buat menjelaskan party model (FundManager/Investor/Auditor/Platform) dan tabel visibility — dua hal yang paling penting ditunjukkan ke juri.
- **Dark, minimal, high-contrast** memberi kesan "private vault" / kerahasiaan yang selaras dengan diferensiator utama Convene (privasi selektif), sekaligus tetap terasa tech-forward, bukan sekadar gelap buat gaya-gayaan.
- **Sophisticated tanpa ornamen** — cocok buat audiens juri hackathon infrastruktur (mereka menilai substansi teknis, bukan estetika flashy).

Sebagai pelengkap (bukan pengganti), kita ambil satu prinsip dari **Wispr Flow**: kejelasan fungsional tanpa dekorasi berlebih. Havu itu situs marketing/portfolio, bukan referensi UI aplikasi (dashboard, form, list kontrak) — jadi untuk komponen interaktif yang benar-benar dipakai di dalam app (tabel kontrak, form vote, form kontribusi), kita pegang prinsip Wispr Flow: status jelas, less-is-more, tanpa micro-interaction/animasi custom yang makan waktu.

**Keputusan:** Havu = bahasa visual (warna, tone, cara nunjukin sistem/alur). Wispr Flow = prinsip kejelasan interaksi buat komponen app sehari-hari.

## 3. Design System — Warna

Palet dark-mode tunggal (sengaja tidak bikin light/dark toggle — buang waktu solo dev, sesuai prinsip Fase C "fungsi dulu, estetika secukupnya" dari breakdown MVP). Filosofi: **charcoal + ivory sebagai basis "private vault/ledger"**, dengan **tiga warna peran (role color)** yang langsung mencerminkan party model — jadi warna bukan cuma dekorasi, tapi alat bantu baca visibility di UI.

| Token | Hex | Pemakaian |
|---|---|---|
| `bg` | `#0B0D10` | Background utama (canvas) — near-black, kesan brankas/ledger |
| `surface` | `#14171B` | Card / panel level 1 |
| `surface-2` | `#1B1F24` | Modal / elemen ter-elevasi |
| `border` | `#272C33` | Divider, outline input |
| `ink` (teks utama) | `#F2EFE9` | Teks primer — ivory hangat, bukan putih steril, kesan kertas ledger |
| `muted` (teks sekunder) | `#9AA0A8` | Label, caption, teks sekunder |
| `disabled` | `#5B6169` | Teks/elemen nonaktif |

**Warna peran (role color) — dipakai konsisten di badge, avatar, border kartu kontrak sesuai siapa signatory/observer-nya (lihat `ARCHITECTURE.md`):**

| Role | Token | Hex | Makna |
|---|---|---|---|
| FundManager (GP) | `role-fm` | `#C9A24B` (bronze/gold) | Otoritas & stewardship |
| Investor (LP) | `role-investor` | `#2FA57C` (emerald) | Modal & pertumbuhan (AUM) |
| Auditor | `role-auditor` | `#5C7A99` (steel blue) | Pengawasan netral |
| Platform | `role-platform` | `#6B7280` (graphite) | Operator, jarang tampil langsung ke user |

**Warna status (semantic, terpisah dari role color):**

| Status | Token | Hex | Pemakaian |
|---|---|---|---|
| Approved / Success | `success` | `#2FA57C` | Vote disetujui, kontribusi masuk, distribusi selesai |
| Pending | `pending` | `#D9A441` | Menunggu vote/deadline, capital call belum lunas |
| Rejected / Error | `danger` | `#C1503D` (rust, bukan merah tajam) | Deal ditolak, validasi gagal |
| **Privat/Restricted** | `privacy` | `#6C6FC4` (indigo-slate) | Badge "🔒 Privat — cuma kamu, FundManager, dan Auditor yang lihat" di `Vote`, `CapitalCallNotice`, `DistributionNotice` |

| Data tersensor | `redact` | `#3A3D78` (indigo gelap) | Garis pola redaksi untuk data investor lain yang tidak boleh dilihat — lihat Bagian 6 |

`privacy` sengaja beda hue dari keempat role color di atas, biar badge privasi selalu gampang dikenali di mana pun dia muncul, gak ketuker sama warna role. `redact` sengaja dibuat lebih gelap dari `privacy`, supaya garis sensor terbaca sebagai "tertutup", sementara badge gemboknya tetap menonjol.

### Tailwind tokens (siap-pakai, tinggal copy ke `tailwind.config.js` — lihat `FE.md` bagian setup)

```js
colors: {
  bg: '#0B0D10',
  surface: '#14171B',
  'surface-2': '#1B1F24',
  border: '#272C33',
  ink: '#F2EFE9',
  muted: '#9AA0A8',
  disabled: '#5B6169',
  'role-fm': '#C9A24B',
  'role-investor': '#2FA57C',
  'role-auditor': '#5C7A99',
  'role-platform': '#6B7280',
  success: '#2FA57C',
  pending: '#D9A441',
  danger: '#C1503D',
  privacy: '#6C6FC4',
  redact: '#3A3D78',
},
fontFamily: {
  display: ['"Space Grotesk"', 'sans-serif'],
  sans: ['Inter', 'sans-serif'],
},
```

## 4. Tipografi

- **Headline, angka (nominal dana, persentase), nama section bernomor ala Havu:** [Space Grotesk](https://fonts.google.com/specimen/Space+Grotesk) — geometris, karakter teknis, enak buat nampilin angka finansial besar.
- **Body & UI text (label, tombol, isi form):** [Inter](https://fonts.google.com/specimen/Inter) — sangat legible, standar industri, cepat di-setup lewat Google Fonts + Tailwind, nol risiko desain.

Keduanya gratis via Google Fonts, tinggal tambah `<link>` di `public/index.html` — gak perlu font custom/berbayar, sesuai prinsip solo-dev hemat waktu.

## 5. Logo — Lens C (FINAL, 26 Sept)

### 5.1 Konsep

Logo Convene adalah monogram **C** dengan **lensa emerald** di celahnya.

- **Huruf C (ivory/tinta)** = ruang privat. Data individual tiap LP (vote, kontribusi, distribusi) ada di dalam, tertutup.
- **Lensa (emerald)** = irisan dua lingkaran, yaitu bagian yang *dibagi bersama*: hasil agregat. Hanya itu yang terlihat di celah C.

Jadi logonya menceritakan dua sisi Convene sekaligus — privat di level individual, transparan di level agregat — persis framing "transparan ke pihak yang berhak" di pitch. Lensa juga diambil dari konsep Aggregate (irisan lingkaran), sedangkan C yang terbuka diambil dari Veiled C, jadi logo ini gabungan dua arah yang dipilih Yuna.

### 5.2 Konstruksi (viewBox asli 200×200)

| Elemen | Geometri |
|---|---|
| Huruf C | Cincin berpusat (100,100), jari-jari luar 80, dalam 52 (tebal 28). Celah di kanan, ±45° dari sumbu horizontal, ujung dipotong radial |
| Lensa | Irisan dua lingkaran r=36 berpusat (132,100) dan (164,100) → lebar 40, tinggi ±64,5, berdiri vertikal di tengah celah |
| Jarak bebas | ±10 unit antara lensa dan C, di semua titik terdekat. Jarak ini bagian dari logo — jangan dirapatkan |
| Crop file | `viewBox="14 20 160 160"` supaya mark terpusat secara optis tanpa padding berlebih |

### 5.3 File & warna

| File | Pakai di | C | Lensa |
|---|---|---|---|
| **`logo-mark.svg`** | Default — app (tema gelap), app icon, slide gelap | `#F2EFE9` (ink) | `#2FA57C` (emerald) |
| **`logo-mark-light.svg`** | Latar terang — slide putih, README, dokumen | `#0B0D10` | `#23875F` (emerald sedikit digelapkan biar kontras di terang) |
| Monokrom | Stempel, satu warna, cetak | satu warna | warna yang sama dengan C (tetap terbaca karena ada jarak bebas) |

Cukup dua warna. Warna role (bronze, steel) dan indigo `privacy` **tidak** dipakai di logo — itu warna fungsional UI.

### 5.4 Pemakaian di React

Pakai inline component (bukan `<img>`) supaya huruf C mengikuti warna teks di sekitarnya:

```jsx
// ui/src/components/Logo.tsx
export const Logo = ({ className = "h-8 w-8 text-ink" }: { className?: string }) => (
  <svg viewBox="14 20 160 160" className={className} role="img" aria-label="Convene">
    <path fill="currentColor" d="M156.57 156.57 A80 80 0 1 1 156.57 43.43 L136.77 63.23 A52 52 0 1 0 136.77 136.77 Z" />
    <path className="fill-success" d="M148 67.75 A36 36 0 0 1 148 132.25 A36 36 0 0 1 148 67.75 Z" />
  </svg>
);
```

**Lockup (mark + wordmark):** tulisan "Convene" pakai Space Grotesk Medium (500), `letter-spacing: -0.025em`. Tinggi mark ≈ 1,3× tinggi huruf kapital, jarak mark ke teks ≈ 0,35× tinggi mark.

```jsx
<div className="flex items-center gap-3">
  <Logo className="h-8 w-8 text-ink" />
  <span className="font-display text-2xl font-medium tracking-[-0.025em] text-ink">Convene</span>
</div>
```

**App icon / favicon:** mark 68% di dalam kotak rounded (radius 24%) berwarna `#0B0D10`.

### 5.5 Aturan pemakaian

- **Ukuran minimum:** 16px (favicon) masih terbaca. Untuk navbar pakai 24–32px.
- **Clear space:** minimal selebar lensa di semua sisi.
- **Jangan:** memutar/memiringkan mark, mengganti warna lensa selain emerald (atau monokrom), menambah gradient/bayangan/transparansi, merapatkan atau menempelkan lensa ke C, atau memasukkan garis sensor ke dalam logo (pola redaksi di Bagian 6 adalah elemen terpisah).

### 5.6 Riwayat eksplorasi

1. **v1 (5 arah):** Signet, Round Table, Veiled C, Aggregate, Half Seal → Yuna memilih **Veiled C** dan **Aggregate**.
2. **v2 (5 pengembangan):** Overprint C, Redacted C, Interlace, Aggregate Seal, Lens C → dua finalis: **Redacted C** dan **Lens C**.
3. **Final: Lens C.** Redacted C cuma menceritakan sisi "menyembunyikan", yang berisiko memperkuat keberatan juri soal "transparent governance" dan garisnya menyatu di 16px. Idenya tetap dipakai sebagai pola redaksi (Bagian 6).

Arsip: `convene-logo-exploration.html` + folder `logos/` (v1), `convene-logo-v2.html` + folder `logos-v2/` (v2). File Figma "Convene — Logo Exploration" berisi v1 saja (kuota Figma MCP habis saat v2 dibuat).

## 6. Pola Redaksi (Redaction Pattern) — elemen pendukung brand

Diadaptasi dari eksplorasi Redacted C. Fungsinya: **bahasa visual untuk data yang ada, tapi tidak boleh dilihat oleh user yang sedang login** (sesuai tabel visibility di `ARCHITECTURE.md`). Pola ini yang bikin privasi selektif kelihatan di layar saat demo, bukan cuma diklaim.

### 6.1 Prinsip kejujuran teknis (penting buat demo & Q&A)

Pola redaksi **bukan** cara menyembunyikan data di UI. Data privat investor lain memang tidak pernah sampai ke browser — ledger cuma mengirim kontrak yang party-nya jadi signatory/observer. Baris tersensor dibentuk dari informasi yang memang publik untuk viewer, misalnya daftar `investors` di `DealProposal`: "deal ini punya 3 investor, 2 di antaranya bukan kamu → tampilkan 2 baris tersensor". Kalimat ini perlu disampaikan saat demo supaya juri tidak mengira ini sekadar UI yang menutupi data.

### 6.2 Kapan dipakai

| Konteks | Yang ditampilkan |
|---|---|
| View Investor — daftar vote per deal | Baris milikmu: pilihanmu. Baris investor lain: redaksi + badge `privacy` |
| View Investor — capital call & distribusi per LP | Nominal milikmu: angka asli. Nominal investor lain: redaksi. Total (`CapitalCallSummary`, `DistributionSummary`): tetap angka asli |
| View FundManager & View Auditor | Tidak pernah ada redaksi — visibility penuh. Kontras ini momen demo yang kuat: ganti login dari Investor ke Auditor, baris tersensor berubah jadi data asli |
| Pitch deck | Motif garis sebagai latar/aksen slide "Why Canton" |

**Jangan dipakai untuk:** data agregat, data milik user sendiri, atau loading state. Loading tetap pakai skeleton abu-abu biasa (beranimasi), redaksi selalu statis dan berwarna indigo — dua hal ini tidak boleh terlihat mirip.

### 6.3 Spesifikasi visual

- Garis horizontal tebal 6px, jarak 4px (ritme yang sama dengan Redacted C), warna token `redact` `#3A3D78` — solid, tanpa transparansi.
- Tinggi blok 26px (= 3 garis penuh, pas untuk baris teks 14–16px); jangan pakai tinggi yang membuat garis terakhir terpotong tipis. Lebar 64–120px, variasikan antar baris biar tidak kaku.
- Selalu didampingi ikon gembok atau badge "Privat" dengan warna `privacy` — jangan mengandalkan warna saja.
- `aria-label="Data privat — hanya terlihat oleh pemiliknya, FundManager, dan Auditor"`.

```jsx
// ui/src/components/Redacted.tsx
export const Redacted = ({ width = 96 }: { width?: number }) => (
  <span
    role="img"
    aria-label="Data privat — hanya terlihat oleh pemiliknya, FundManager, dan Auditor"
    className="inline-block h-[26px] rounded-sm align-middle"
    style={{ width, background: "repeating-linear-gradient(to bottom, #3A3D78 0 6px, transparent 6px 10px)" }}
  />
);
```

Tambahkan juga token `redact: '#3A3D78'` ke `tailwind.config.js` (sudah masuk ke blok token di Bagian 3).

**Animasi (opsional, bukan scope Fase C):** saat berganti ke role yang berhak, garis menyusut ke kiri lalu angka asli muncul. Kerjakan hanya kalau ada sisa waktu — polish animasi termasuk non-goal Fase C di `FE.md`.