# BE.md — Backend Convene (Daml JSON API)

**Prinsip utama: Convene TIDAK PUNYA backend custom.** Ini keputusan sadar dari Technical Design (bukan keterbatasan) — Daml JSON API bawaan ledger langsung dipakai sebagai jembatan ke frontend. Hemat waktu besar buat solo dev karena gak perlu bangun & maintain API server sendiri. Dokumen ini menjelaskan cara kerja "backend" itu, bukan kode server yang perlu ditulis.

## 1. Komponen "Backend"

| Komponen | Peran | Port (default lokal) |
|---|---|---|
| **Canton Ledger API** (gRPC) | Ledger sesungguhnya — nyimpen semua kontrak, jalanin transaksi | 6865 |
| **Daml JSON API** (HTTP, bawaan SDK) | Terjemahin ledger API (gRPC) jadi REST/HTTP + WebSocket biar gampang dipanggil dari JS/TS | 7575 |
| **React frontend** | Konsumen JSON API, pakai `@daml/react` + `@daml/ledger` | 3000 (dev server) |

Tidak ada server Node/Express/dsb yang perlu ditulis. Semua "logic backend" (validasi, aturan siapa boleh apa, visibility) hidup di level template Daml itu sendiri (lihat `SC.md`) — bukan di layer middleware terpisah.

## 2. Autentikasi (MVP)

- **Sekarang (MVP, dev only):** JWT auth bawaan JSON API. Setiap role (FundManager, tiap Investor, Auditor, Platform) = 1 party + 1 Ledger API User, login pakai username yang cocok dengan User yang sudah dibuat lewat Daml Script init (`Setup.daml` atau modul serupa) — sama pola dengan user demo `alice`/`bob` bawaan template `create-daml-app`, tapi diganti nama sesuai role asli Convene (lihat `SC.md` bagian "Party & User Setup").
- **Constraint penting:** Ledger API User ID harus **huruf kecil semua** (mengikuti pola `alice`/`bob`) — pakai konvensi seperti `fundmanager`, `investor1`, `investor2`, `investor3`, `auditor`, `platform`.
- **Nanti (Pilot Plan, BUKAN scope MVP):** integrasi wallet/custody Canton asli (mis. Console Wallet) buat identitas LP institusional beneran. Ini future work, jangan dikerjain sekarang.

## 3. Endpoint JSON API yang Relevan

Dipanggil otomatis lewat `@daml/react`/`@daml/ledger`, tapi baik buat tau ada di baliknya:

| Endpoint | Kegunaan di Convene |
|---|---|
| `POST /v1/create` | Bikin kontrak baru (mis. FundManager propose `DealProposal`) |
| `POST /v1/exercise` | Jalanin choice (mis. `Vote`, `TallyVotes`, `IssueCapitalCall`, `Contribute`, `TriggerExit`) |
| `POST /v1/query` | Ambil daftar kontrak aktif yang visible ke user yang login (otomatis ke-filter sesuai signatory/observer) |
| `POST /v1/fetch` | Ambil 1 kontrak spesifik by contract ID atau key |
| `GET /v1/query` (WebSocket `/v1/stream/query`) | Live update kontrak (dipakai `@daml/react`'s `useStreamQuery` biar UI auto-update tanpa refresh) |
| `GET /readyz` | Health check — dipakai buat mastiin JSON API udah siap sebelum frontend connect |

**Poin penting soal visibility:** JSON API otomatis cuma nge-return kontrak yang party yang login itu jadi signatory ATAU observer-nya. Jadi kalau Investor A login, dia otomatis TIDAK bisa lihat `Vote`/`CapitalCallNotice`/`DistributionNotice` milik Investor B lewat endpoint manapun — ini bukan filtering yang perlu ditulis manual, itu jaminan dari ledger model itu sendiri (lihat tabel visibility di `ARCHITECTURE.md`).

## 4. Koneksi Frontend ke JSON API

- `ui/package.json` punya `"proxy": "http://localhost:7575"` — biar request dari React dev server (port 3000) ke JSON API (port 7575) gak kena masalah CORS.
- `daml.js` (di `ui/daml.js`) di-generate otomatis oleh `daml start` dari `.dar` — berisi TypeScript types & template ID buat tiap template Daml. **Regenerate ulang** (`daml start` auto-detect, atau tekan `r` di terminal `daml start`) setiap kali nambah/ubah template di `SC.md`/kode Daml, sebelum kode frontend bisa pakai template baru itu.
- `@daml/react` nyediain hooks siap pakai: `useParty()` (party yang login), `useQuery(Template)` (ambil semua kontrak visible), `useStreamQuery(Template)` (live update), `useLedger()` (buat `exercise`/`create` manual kalau perlu logic custom).

## 5. Kenapa Ini Cukup buat MVP (gak perlu backend custom)

- Semua validasi bisnis (mis. "investor cuma boleh vote sekali", "capital call cuma bisa di-issue kalau Approved") ditulis sebagai `assertMsg`/precondition di choice Daml — dijamin dieksekusi di level ledger, gak bisa dilewatin dari sisi client manapun.
- Visibility per-role gak perlu access-control layer terpisah — itu bawaan dari siapa jadi signatory/observer.
- Satu-satunya "state" di luar Daml adalah state UI React biasa (form input, dsb) — gak ada database terpisah yang perlu disinkronkan.

## 6. Batasan yang Perlu Diketahui (bukan bug, ini emang gimana Daml JSON API bawaan bekerja)

- **Gak ada notifikasi push/email** — JSON API cuma nyediain data, gak ngirim notifikasi capital call/reminder vote ke LP. Ini didorong ke Pilot Plan (future work), bukan MVP.
- **Gak ada agregasi custom di server** — kalau butuh angka gabungan yang gak natural dari 1 kontrak (mis. "total semua fund yang dikelola FundManager"), itu dihitung di sisi frontend dari hasil `useQuery`, bukan lewat endpoint backend baru.
- **Sandbox in-memory (Jalur B)** — state ilang tiap restart `daml start`. Kalau pakai canton-devkit (Jalur A), state persist di volume Docker selama container gak dihapus (`localnet down` doang gak menghapus volume, `localnet remove` yang menghapus).