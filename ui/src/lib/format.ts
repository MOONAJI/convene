// Party ID Canton berbentuk "Investor1::1220ab…". Bagian sebelum "::" adalah hint
// yang dipakai `Setup:setupConvene`, cukup buat nama tampilan.
export const partyHint = (party: string): string => party.split("::")[0];

export const partyName = (party: string): string => {
  const hint = partyHint(party);
  const investor = /^Investor(\d+)$/i.exec(hint);
  if (investor) return `Investor ${investor[1]}`;
  if (/^FundManager$/i.test(hint)) return "Fund manager";
  return hint;
};

const moneyFormat = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

// Numeric Daml datang sebagai string; cukup presisi Number untuk tampilan.
export const money = (value: string | number): string => moneyFormat.format(Number(value));

export const percent = (rate: string | number): string => {
  const pct = Number(rate) * 100;
  return `${Number.isInteger(pct) ? pct.toFixed(0) : pct.toFixed(2)}%`;
};

export const dateTime = (iso: string): string =>
  new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });

export const timeLeft = (iso: string, now: number): string => {
  const ms = new Date(iso).getTime() - now;
  if (ms <= 0) return "closed";
  const mins = Math.floor(ms / 60000);
  const secs = Math.floor((ms % 60000) / 1000);
  if (mins >= 60 * 24) return `${Math.floor(mins / (60 * 24))}d ${Math.floor((mins % (60 * 24)) / 60)}h left`;
  if (mins >= 60) return `${Math.floor(mins / 60)}h ${mins % 60}m left`;
  if (mins >= 1) return `${mins}m ${secs}s left`;
  return `${secs}s left`;
};

// Numeric Daml maksimal 10 digit desimal; semua nominal yang dikirim ke ledger
// dibulatkan ke sen supaya validasi di form sama persis dengan yang diterima kontrak.
export const toNumeric = (value: number): string => (Math.round(value * 100) / 100).toFixed(2);

// Nominal input form (string bebas) → angka yang sudah dibulatkan ke sen; NaN jadi 0.
export const centsOf = (input: string): number => Number(toNumeric(Number(input) || 0));

export const shortId = (id: string): string => (id.length > 12 ? `${id.slice(0, 6)}…${id.slice(-4)}` : id);
