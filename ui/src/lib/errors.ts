// Error dari @daml/ledger berbentuk { status, errors: string[] }. Pesan `assertMsg`
// dari kontrak terkubur di dalam teks panjang; ambil kalimatnya saja.
export const errorMessage = (error: unknown): string => {
  let raw: string;
  if (error instanceof Error) {
    raw = error.message;
  } else if (error && typeof error === "object" && Array.isArray((error as any).errors)) {
    raw = (error as any).errors.join(" ");
  } else {
    raw = typeof error === "string" ? error : JSON.stringify(error);
  }

  const assertion = /message = "([^"]+)"/.exec(raw) || /User abort: ([^.]+)/.exec(raw);
  if (assertion) return `${assertion[1]}.`;
  // Ledger mati: fetch gagal, atau (lewat proxy dev server) balasannya teks
  // "Error occured while trying to proxy…" yang gagal di-parse sebagai JSON.
  if (/Failed to fetch|NetworkError|ECONNREFUSED|trying to proxy|is not valid JSON|Unexpected token/i.test(raw)) {
    return "Can't reach the ledger. Check that `daml start` is still running.";
  }
  if (/UNAUTHENTICATED|USER_NOT_FOUND|not found/i.test(raw) && /user/i.test(raw)) {
    return "This user isn't on the ledger yet. Restart `daml start` so the init script creates it.";
  }
  return raw.length > 280 ? `${raw.slice(0, 280)}…` : raw;
};
