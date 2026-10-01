import React from "react";
import { CreateEvent } from "@daml/ledger";
import { Convene } from "@daml.js/convene";
import { Deal } from "../../lib/fund";
import { RoleKey, roleStyles } from "../../lib/roles";

export type StageCtx = {
  party: string;
  role: RoleKey;
  now: number;
  agreement?: CreateEvent<Convene.PlatformAgreement, any, any>;
};

export type SectionState = "done" | "current" | "upcoming" | "halted";

export const sectionState = (no: number, deal: Deal): SectionState => {
  if (deal.rejected) return no < 2 ? "done" : no === 2 ? "halted" : "upcoming";
  if (deal.distSummary) return "done";
  if (no < deal.stage) return "done";
  return no === deal.stage ? "current" : "upcoming";
};

const numeralColor = (state: SectionState, role: RoleKey) =>
  state === "current" ? roleStyles[role].text : state === "halted" ? "text-danger" : state === "done" ? "text-muted" : "text-border";

type Props = {
  no: number;
  title: string;
  state: SectionState;
  role: RoleKey;
  // Kalimat pengganti isi saat tahap belum terbuka.
  waiting?: string;
  aside?: React.ReactNode;
  children?: React.ReactNode;
};

// Satu tahap alur Convene. Nomor 01–05 = urutan state machine di ARCHITECTURE.md bagian 3.
export const Section = ({ no, title, state, role, waiting, aside, children }: Props) => {
  const id = `stage-${no}`;
  return (
    <section
      aria-labelledby={id}
      aria-current={state === "current" ? "step" : undefined}
      className="grid grid-cols-[48px_minmax(0,1fr)] gap-x-4 border-t border-border py-8 md:grid-cols-[96px_minmax(0,1fr)] md:gap-x-6"
    >
      <div className={`num text-[30px] font-normal leading-none tracking-[-0.02em] md:text-[44px] ${numeralColor(state, role)}`}>
        {String(no).padStart(2, "0")}
      </div>
      <div className="flex min-w-0 flex-col gap-5">
        <header className="flex min-h-[30px] flex-wrap items-center justify-between gap-x-4 gap-y-2 md:min-h-[44px]">
          <h2 id={id} className={`font-display text-xl font-medium tracking-[-0.01em] ${state === "upcoming" ? "text-disabled" : "text-ink"}`}>
            {title}
          </h2>
          {state !== "upcoming" && aside}
        </header>
        {state === "upcoming" ? <p className="-mt-2 text-sm text-disabled">{waiting}</p> : children}
      </div>
    </section>
  );
};

// Pasangan label/nilai kecil untuk fakta sebuah deal.
export const Fact = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="flex flex-col gap-1">
    <dt className="text-xs text-muted">{label}</dt>
    <dd className="text-sm text-ink">{children}</dd>
  </div>
);

// Angka agregat besar; dipakai untuk hasil yang boleh dilihat semua anggota fund.
export const Figure = ({ value, label }: { value: React.ReactNode; label: string }) => (
  <div className="flex flex-col gap-1">
    <span className="num text-[28px] font-medium leading-none tracking-[-0.02em] text-ink md:text-[32px]">{value}</span>
    <span className="text-xs text-muted">{label}</span>
  </div>
);

export const Progress = ({ value, max, role }: { value: number; max: number; role: RoleKey }) => {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0;
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-surface-2" role="progressbar" aria-valuemin={0} aria-valuemax={max} aria-valuenow={value}>
      <div className={`h-full ${roleStyles[role].bg}`} style={{ width: `${pct}%` }} />
    </div>
  );
};
