import React from "react";
import { TemplateView } from "../lib/fund";
import { RoleKey } from "../lib/roles";
import { LockIcon } from "./ui/primitives";
import { Redacted } from "./ui/Redacted";

type Props = {
  templates: TemplateView[];
  role: RoleKey;
  name: string;
};

const note: Record<RoleKey, string> = {
  investor:
    "Other investors' ballots, notices and payouts are never sent to this browser. The fee record and platform agreement aren't either.",
  fm: "You sign or observe every contract in the fund, so nothing is withheld from you.",
  auditor: "You observe every contract, including the platform fee. You can't exercise any choice.",
};

// Hitungan live kontrak aktif per template, persis seperti yang dikirim ledger ke
// party ini. Ganti login Investor ↔ Auditor untuk melihat angkanya berubah.
const LedgerView = ({ templates, role, name }: Props) => (
  <aside aria-labelledby="ledger-view" className="flex flex-col gap-4 lg:sticky lg:top-24">
    <div className="flex flex-col gap-1.5">
      <h2 id="ledger-view" className="font-display text-lg font-medium tracking-[-0.01em]">
        What {name}'s ledger holds
      </h2>
      <p className="text-xs leading-relaxed text-muted">
        Active contracts Canton has sent to this party. Counts update live.
      </p>
    </div>
    <ul className="rounded-lg border border-border bg-surface px-4">
      {templates.map(t => {
        const withheld = role === "investor" && t.investorReach === "none";
        const ownOnly = role === "investor" && t.investorReach === "own";
        return (
          <li key={t.name} className="flex min-h-[44px] items-center justify-between gap-3 border-t border-border py-2 first:border-t-0">
            <span className={`truncate text-[13px] ${withheld ? "text-disabled" : "text-ink"}`}>{t.name}</span>
            {withheld ? (
              <span className="flex items-center gap-2 text-privacy" title="Never sent to this party">
                <Redacted width={64} />
                <LockIcon />
              </span>
            ) : (
              <span className="flex items-baseline gap-2">
                {ownOnly && <span className="text-[11px] text-privacy">yours only</span>}
                <span className={`num w-6 text-right text-base ${t.count > 0 ? "text-ink" : "text-disabled"}`}>{t.count}</span>
              </span>
            )}
          </li>
        );
      })}
    </ul>
    <p className="text-xs leading-relaxed text-muted">{note[role]}</p>
  </aside>
);

export default LedgerView;
