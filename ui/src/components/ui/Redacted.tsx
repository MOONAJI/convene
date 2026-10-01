import React from "react";

// Pola redaksi (UIUX.md bagian 6). Bukan penyembunyi data: data privat investor
// lain memang tidak pernah dikirim ledger ke browser ini. Baris tersensor dibentuk
// dari informasi yang publik untuk viewer (daftar `investors` di deal).
// Garis 6px, jarak 4px, warna token `redact` (UIUX.md 6.3). Dipakai juga oleh glyph login.
export const REDACT_PATTERN = "repeating-linear-gradient(to bottom, #3A3D78 0 6px, transparent 6px 10px)";

export const Redacted = ({ width = 96 }: { width?: number }) => (
  <span
    role="img"
    aria-label="Private data, visible only to its owner, the fund manager and the auditor"
    className="inline-block h-[26px] rounded-sm align-middle"
    style={{ width, background: REDACT_PATTERN }}
  />
);
