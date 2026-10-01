import React, { useCallback, useEffect, useRef, useState } from "react";
import { RoleKey, roleStyles } from "../../lib/roles";
import { errorMessage } from "../../lib/errors";
import { Redacted } from "./Redacted";

export const LockIcon = ({ className = "h-3.5 w-3.5" }: { className?: string }) => (
  <svg viewBox="0 0 16 16" className={className} fill="none" aria-hidden="true">
    <rect x="3" y="7" width="10" height="7" rx="1.5" fill="currentColor" />
    <path d="M5.25 7V5.25a2.75 2.75 0 0 1 5.5 0V7" stroke="currentColor" strokeWidth="1.5" />
  </svg>
);

export const PrivacyBadge = ({ children }: { children: React.ReactNode }) => (
  <span className="inline-flex items-center gap-1.5 rounded-sm border border-privacy/50 bg-privacy/10 px-2 py-0.5 text-xs font-medium text-privacy">
    <LockIcon className="h-3 w-3" />
    {children}
  </span>
);

export type Tone = "success" | "pending" | "danger" | "neutral";

const toneClass: Record<Tone, string> = {
  success: "text-success border-success/40",
  pending: "text-pending border-pending/40",
  danger: "text-danger border-danger/50",
  neutral: "text-muted border-border",
};

export const Pill = ({ tone, children }: { tone: Tone; children: React.ReactNode }) => (
  <span className={`inline-flex items-center gap-1.5 rounded-sm border px-2 py-0.5 text-xs font-medium ${toneClass[tone]}`}>
    <span className="h-1.5 w-1.5 rounded-full bg-current" aria-hidden="true" />
    {children}
  </span>
);

export const RoleDot = ({ role, className = "" }: { role: RoleKey; className?: string }) => (
  <span className={`inline-block h-2 w-2 shrink-0 rounded-full ${roleStyles[role].bg} ${className}`} aria-hidden="true" />
);

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  role?: RoleKey;
  variant?: "primary" | "secondary";
  busy?: boolean;
};

export const Button = ({ role = "fm", variant = "primary", busy, disabled, className = "", children, ...rest }: ButtonProps) => {
  const look =
    variant === "primary"
      ? roleStyles[role].button
      : "border border-border text-ink hover:border-muted hover:bg-surface-2";
  return (
    <button
      {...rest}
      disabled={disabled || busy}
      aria-busy={busy || undefined}
      className={`inline-flex h-10 items-center justify-center gap-2 rounded-md px-4 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:bg-surface-2 disabled:text-disabled disabled:border-transparent ${look} ${className}`}
    >
      {children}
    </button>
  );
};

export const Field = ({ label, hint, htmlFor, children }: { label: string; hint?: string; htmlFor: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={htmlFor} className="text-sm font-medium text-ink">
      {label}
    </label>
    {children}
    {hint && <p className="text-xs text-muted">{hint}</p>}
  </div>
);

export const ErrorLine = ({ message }: { message?: string }) =>
  message ? (
    <p role="alert" className="border-l-2 border-danger pl-3 text-sm text-danger">
      {message}
    </p>
  ) : null;

// Membungkus satu aksi ledger (create/exercise): status sibuk + pesan error dari kontrak.
// Form sering unmount begitu aksinya sukses (stream ledger memindah tahap), jadi
// state hanya di-set selama komponen masih terpasang.
export const useLedgerAction = () => {
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string>();
  const mounted = useRef(true);
  useEffect(() => () => { mounted.current = false; }, []);
  const run = useCallback(async (action: () => Promise<unknown>) => {
    setBusy(true);
    setError(undefined);
    try {
      await action();
      return true;
    } catch (e) {
      if (mounted.current) setError(errorMessage(e));
      return false;
    } finally {
      if (mounted.current) setBusy(false);
    }
  }, []);
  return { busy, error, run };
};

// Satu baris per investor di tabel stage. `mine` menandai baris milik viewer.
export const MemberRow = ({ name, mine, children }: { name: string; mine?: boolean; children: React.ReactNode }) => (
  <li className="flex min-h-[52px] flex-wrap items-center justify-between gap-x-6 gap-y-2 border-t border-border py-3 first:border-t-0">
    <span className="flex items-center gap-2 text-sm">
      <span className={mine ? "text-ink" : "text-muted"}>{name}</span>
      {mine && <span className="text-xs text-role-investor">you</span>}
    </span>
    <span className="flex flex-wrap items-center gap-3">{children}</span>
  </li>
);

export const SealedRow = ({ name, width }: { name: string; width: number }) => (
  <MemberRow name={name}>
    <Redacted width={width} />
    <span className="text-privacy">
      <LockIcon />
    </span>
  </MemberRow>
);

// Lebar bar redaksi divariasikan antar baris (UIUX.md 6.3: 64–120px).
export const redactWidth = (i: number) => [88, 112, 72, 104, 64, 120][i % 6];
