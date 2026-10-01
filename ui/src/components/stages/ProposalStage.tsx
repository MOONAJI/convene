import React, { useState } from "react";
import { useLedger } from "@daml/react";
import { Convene } from "@daml.js/convene";
import { Deal } from "../../lib/fund";
import { useKnownParties } from "../../lib/parties";
import { centsOf, dateTime, money, partyName, toNumeric } from "../../lib/format";
import { Button, ErrorLine, Field, useLedgerAction } from "../ui/primitives";
import { Fact, Section, StageCtx } from "./Section";

export const ProposalStage = ({ deal, ctx }: { deal: Deal; ctx: StageCtx }) => (
  <Section no={1} title="Proposal" state="done" role={ctx.role}>
    <dl className="grid grid-cols-2 gap-x-8 gap-y-5 md:grid-cols-4">
      <Fact label="Target capital">
        <span className="num text-base">{money(deal.targetCapital)}</span>
      </Fact>
      <Fact label="Voting closes">{deal.voteDeadline ? dateTime(deal.voteDeadline) : "Closed"}</Fact>
      <Fact label="Proposed by">{partyName(deal.fundManager)}</Fact>
      <Fact label="Voting members">{deal.investors.map(partyName).join(", ")}</Fact>
    </dl>
  </Section>
);

// Default: voting ditutup 15 menit dari sekarang, dalam format <input type="datetime-local">.
const defaultDeadline = () => {
  const d = new Date(Date.now() + 15 * 60000);
  d.setSeconds(0, 0);
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// Saran ID: satu di atas nomor DEAL-xxx tertinggi, supaya tidak bentrok dengan
// contract key (fundManager, dealId) walau ada nomor yang dilompati.
export const nextDealId = (existingIds: string[]): string => {
  const highest = existingIds.reduce((max, id) => {
    const m = /^DEAL-(\d+)$/.exec(id);
    return m ? Math.max(max, Number(m[1])) : max;
  }, 0);
  return `DEAL-${String(highest + 1).padStart(3, "0")}`;
};

type FormProps = {
  ctx: StageCtx;
  existingIds: string[];
  onProposed: (dealId: string) => void;
};

export const ProposeForm = ({ ctx, existingIds, onProposed }: FormProps) => {
  const ledger = useLedger();
  const known = useKnownParties();
  const { busy, error, run } = useLedgerAction();
  const [dealId, setDealId] = useState(() => nextDealId(existingIds));
  const [description, setDescription] = useState("");
  const [target, setTarget] = useState("500000");
  const [deadline, setDeadline] = useState(defaultDeadline);
  const [excluded, setExcluded] = useState<string[]>([]);
  const [problem, setProblem] = useState<string>();

  const auditor = ctx.agreement ? ctx.agreement.payload.auditor : known && known.auditor;
  const investors = known ? known.investors.filter(p => !excluded.includes(p)) : [];

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const id = dealId.trim();
    const deadlineDate = new Date(deadline);
    // BUSINESSRULES.md bagian 2: deadline di masa depan dicek di frontend (ensure Daml tidak bisa baca waktu).
    const check =
      !id ? "Give the deal an ID." :
      existingIds.includes(id) ? `A deal called ${id} already exists. Pick another ID.` :
      !description.trim() ? "Describe the deal so investors know what they're voting on." :
      !(centsOf(target) > 0) ? "Target capital must be more than zero." :
      isNaN(deadlineDate.getTime()) || deadlineDate.getTime() <= Date.now() ? "The voting deadline must be in the future." :
      investors.length === 0 ? "Choose at least one investor to vote." :
      !auditor ? "No auditor found on this ledger. Restart `daml start` so the init script creates one." :
      undefined;
    setProblem(check);
    if (check || !auditor) return;

    const ok = await run(() =>
      ledger.create(Convene.DealProposal, {
        fundManager: ctx.party,
        investors,
        auditor,
        dealId: id,
        description: description.trim(),
        targetCapital: toNumeric(centsOf(target)),
        voteDeadline: deadlineDate.toISOString(),
      }),
    );
    if (ok) onProposed(id);
  };

  return (
    <form onSubmit={submit} className="flex max-w-[640px] flex-col gap-6" noValidate>
      <div className="grid gap-6 md:grid-cols-[160px_minmax(0,1fr)]">
        <Field label="Deal ID" htmlFor="deal-id">
          <input id="deal-id" className="field" value={dealId} onChange={e => setDealId(e.target.value)} />
        </Field>
        <Field label="Target capital (USD)" htmlFor="deal-target">
          <input id="deal-target" className="field num" type="number" min="1" step="any" inputMode="decimal" value={target} onChange={e => setTarget(e.target.value)} />
        </Field>
      </div>
      <Field label="What are investors voting on?" htmlFor="deal-desc">
        <textarea
          id="deal-desc"
          rows={3}
          className="field resize-y leading-relaxed"
          placeholder="Series A in Northwind Robotics: 8% stake, 18-month horizon"
          value={description}
          onChange={e => setDescription(e.target.value)}
        />
      </Field>
      <Field label="Voting closes" htmlFor="deal-deadline" hint="Votes after this time are rejected by the ledger.">
        <input id="deal-deadline" className="field max-w-[260px]" type="datetime-local" value={deadline} onChange={e => setDeadline(e.target.value)} />
      </Field>
      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1.5 text-sm font-medium text-ink">Voting members</legend>
        {!known && <span className="skeleton h-5 w-48" />}
        {known &&
          known.investors.map(p => {
            const on = !excluded.includes(p);
            return (
              <label key={p} className="flex w-fit cursor-pointer items-center gap-3 text-sm">
                <input
                  type="checkbox"
                  checked={on}
                  onChange={() => setExcluded(on ? [...excluded, p] : excluded.filter(x => x !== p))}
                  className="h-4 w-4 accent-[#C9A24B]"
                />
                <span className={on ? "text-ink" : "text-muted"}>{partyName(p)}</span>
              </label>
            );
          })}
        <p className="text-xs text-muted">
          {auditor ? `${partyName(auditor)} observes the deal automatically.` : "Looking up the auditor…"}
        </p>
      </fieldset>
      <ErrorLine message={problem || error} />
      <div>
        <Button type="submit" role="fm" busy={busy}>
          {busy ? "Proposing…" : "Propose deal"}
        </Button>
      </div>
    </form>
  );
};
