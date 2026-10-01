import React, { useState } from "react";
import { Lockup } from "./ui/Logo";
import { REDACT_PATTERN } from "./ui/Redacted";
import { ErrorLine, RoleDot } from "./ui/primitives";
import { DemoUser, demoUsers, roleStyles } from "../lib/roles";
import { Session, login } from "../lib/session";
import { errorMessage } from "../lib/errors";

// Tiga blok = balot Investor 1–3. Terisi kalau role ini bisa membaca balot itu,
// bergaris redaksi kalau tidak. Ringkasan tabel visibility dalam satu glyph.
const BallotGlyph = ({ user }: { user: DemoUser }) => {
  const readable = [1, 2, 3].map(n => user.role !== "investor" || user.userId === `investor${n}`);
  const count = readable.filter(Boolean).length;
  return (
    <span className="flex items-end gap-1" role="img" aria-label={`Can read ${count} of 3 investor ballots`}>
      {readable.map((ok, i) =>
        ok ? (
          <span key={i} className={`h-4 w-2.5 rounded-[1px] ${roleStyles[user.role].bg}`} />
        ) : (
          <span
            key={i}
            className="h-4 w-2.5 rounded-[1px]"
            style={{ background: REDACT_PATTERN }}
          />
        ),
      )}
    </span>
  );
};

const LoginScreen = ({ onLogin }: { onLogin: (s: Session) => void }) => {
  const [pending, setPending] = useState<string>();
  const [error, setError] = useState<string>();

  const choose = async (userId: string) => {
    setPending(userId);
    setError(undefined);
    try {
      onLogin(await login(userId));
    } catch (e) {
      setError(errorMessage(e));
      setPending(undefined);
    }
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto grid max-w-[1200px] gap-12 px-4 py-10 md:px-8 lg:min-h-screen lg:grid-cols-[5fr_7fr] lg:items-center lg:gap-20 lg:py-16">
        <div className="flex flex-col gap-10">
          <Lockup size="lg" />
          <div className="flex flex-col gap-5">
            <h1 className="font-display text-[40px] font-medium leading-[1.05] tracking-[-0.03em] md:text-[56px]">
              Sign in as a member of the fund.
            </h1>
            <p className="max-w-[46ch] text-base leading-relaxed text-muted">
              Every role reads the same Canton ledger but receives a different slice of it. Investors get their own
              ballot, capital call and payout plus the fund's totals. The fund manager and the auditor get everything.
            </p>
          </div>
          <p className="max-w-[46ch] text-sm leading-relaxed text-muted">
            Local demo ledger, no password. Open a second tab and pick another role to compare what each one sees.
          </p>
        </div>

        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between px-1 text-xs text-muted">
            <span>Role</span>
            <span>Investor ballots readable</span>
          </div>
          <ul className="overflow-hidden rounded-lg border border-border bg-surface">
            {demoUsers.map(user => (
              <li key={user.userId} className="border-t border-border first:border-t-0">
                <button
                  type="button"
                  onClick={() => choose(user.userId)}
                  disabled={!!pending}
                  className="group relative flex w-full items-center gap-5 px-5 py-5 text-left transition-colors hover:bg-surface-2 disabled:cursor-wait md:px-6"
                >
                  <span className={`absolute bottom-4 left-0 top-4 w-0.5 rounded-full ${roleStyles[user.role].bg} opacity-0 transition-opacity group-hover:opacity-100 group-focus-visible:opacity-100`} aria-hidden="true" />
                  <span className="flex min-w-0 flex-1 flex-col gap-1">
                    <span className="flex items-center gap-2.5">
                      <RoleDot role={user.role} />
                      <span className="font-display text-xl font-medium tracking-[-0.01em]">{user.label}</span>
                      <span className="text-xs text-disabled">{user.userId}</span>
                    </span>
                    <span className="text-sm leading-snug text-muted">
                      {pending === user.userId ? "Signing in…" : user.summary}
                    </span>
                  </span>
                  <BallotGlyph user={user} />
                </button>
              </li>
            ))}
          </ul>
          <ErrorLine message={error} />
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
