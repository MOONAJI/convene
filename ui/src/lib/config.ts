// Alamat JSON API diambil dari env var saat build.
// Kalau kosong (dev lokal biasa), frontend memakai domain halamannya sendiri
// lewat "proxy" di package.json, persis seperti sebelumnya.
const raw = process.env.REACT_APP_LEDGER_URL;

export const httpBaseUrl: string | undefined = raw
  ? raw.endsWith("/") ? raw : `${raw}/`
  : undefined;

// https://... menjadi wss://..., http://... menjadi ws://...
export const wsBaseUrl: string | undefined = httpBaseUrl
  ? httpBaseUrl.replace(/^http/, "ws")
  : undefined;