import React, { useState } from "react";
import { useLedger } from "@daml/react";
import { Convene } from "@daml.js/convene";
import { Deal } from "../../lib/fund";
import { centsOf, money, partyName, toNumeric } from "../../lib/format";
import { Button, ErrorLine, MemberRow, Pill, PrivacyBadge, SealedRow, redactWidth, useLedgerAction } from "../ui/primitives";
import { Figure, Progress, Section, StageCtx, sectionState } from "./Section";

// Nominal capital call milik seorang investor: dari notice (belum bayar) atau
// dari Contribution (sudah bayar, notice-nya sudah di-archive oleh Contribute).
const calledAmount = (deal: Deal, investor: string): string | undefined => {
  const notice = deal.callNotices.find(n => n.payload.investor === investor);
  if (notice) return notice.payload.amount;
  const paid = deal.contributions.find(c => c.payload.investor === investor);
  return paid ? paid.payload.amount : undefined;
};

const IssueForm = ({ deal, ctx }: { deal: Deal; ctx: StageCtx }) => {
  const ledger = useLedger();
  const { busy, error, run } = useLedgerAction();
  const target = Number(deal.targetCapital);
  // Default: bagi rata, sisa pembulatan sen ke investor terakhir supaya total = target.
  const [amounts, setAmounts] = useState<Record<string, string>>(() => {
    const n = deal.investors.length;
    const share = Math.floor((target / n) * 100) / 100;
    return Object.fromEntries(
      deal.investors.map((p, i) => [p, toNumeric(i === n - 1 ? target - share * (n - 1) : share)]),
    );
  });
  // Validasi pakai nominal yang sudah dibulatkan ke sen, sama dengan yang dikirim ke kontrak.
  const total = deal.investors.reduce((sum, p) => sum + centsOf(amounts[p]), 0);
  const over = Math.round(total * 100) > Math.round(target * 100);
  const invalid = deal.investors.some(p => !(centsOf(amounts[p]) > 0));

  const issue = () =>
    run(() =>
      ledger.exercise(Convene.DealResult.IssueCapitalCall, deal.result!.contractId, {
        callAmounts: deal.investors.map(investor => ({ investor, amount: toNumeric(centsOf(amounts[investor])) })),
      }),
    );

  return (
    <div className="flex flex-col gap-5">
      <p className="max-w-[62ch] text-sm leading-relaxed text-muted">
        Each investor receives a private notice with their own amount. Other investors only see the fund total.
      </p>
      <ul aria-label="Capital call amounts" className="max-w-[560px]">
        {deal.investors.map(p => (
          <MemberRow key={p} name={partyName(p)}>
            <label className="sr-only" htmlFor={`call-${p}`}>
              Amount for {partyName(p)}
            </label>
            <input
              id={`call-${p}`}
              type="number"
              min="0"
              step="any"
              inputMode="decimal"
              className="field num w-40 text-right"
              value={amounts[p]}
              onChange={e => setAmounts({ ...amounts, [p]: e.target.value })}
            />
          </MemberRow>
        ))}
      </ul>
      <p className={`text-sm ${over ? "text-danger" : "text-muted"}`}>
        Total <span className="num text-ink">{money(total)}</span> of {money(target)} target.
        {over && " The total can't exceed the target."}
      </p>
      <ErrorLine message={error} />
      <div>
        <Button role="fm" onClick={issue} busy={busy} disabled={over || invalid}>
          {busy ? "Issuing…" : "Issue capital call"}
        </Button>
      </div>
    </div>
  );
};

export const CapitalCallStage = ({ deal, ctx }: { deal: Deal; ctx: StageCtx }) => {
  const state = sectionState(3, deal);
  const issued = !!deal.callSummary;
  return (
    <Section
      no={3}
      title="Capital call"
      state={state}
      role={ctx.role}
      waiting={deal.rejected ? "The deal was rejected, so no capital is called." : "Opens once the deal is approved."}
      aside={issued ? <Pill tone="success">Issued</Pill> : <Pill tone="pending">Not issued</Pill>}
    >
      {!issued && ctx.role === "fm" && <IssueForm deal={deal} ctx={ctx} />}
      {!issued && ctx.role !== "fm" && (
        <p className="text-sm text-muted">The deal is approved. Waiting for the fund manager to issue the capital call.</p>
      )}
      {issued && (
        <>
          <div className="flex flex-wrap gap-x-12 gap-y-5">
            <Figure value={money(deal.callSummary!.payload.totalTarget)} label="Called from the fund" />
            <Figure value={money(deal.targetCapital)} label="Deal target" />
          </div>
          <ul aria-label="Amount called per investor">
            {deal.investors.map((inv, i) => {
              const mine = inv === ctx.party;
              if (ctx.role === "investor" && !mine) return <SealedRow key={inv} name={partyName(inv)} width={redactWidth(i + 1)} />;
              const amount = calledAmount(deal, inv);
              return (
                <MemberRow key={inv} name={partyName(inv)} mine={mine}>
                  {amount ? <span className="num text-base text-ink">{money(amount)}</span> : <Pill tone="neutral">Not called</Pill>}
                  {mine && <PrivacyBadge>Your notice is private</PrivacyBadge>}
                </MemberRow>
              );
            })}
          </ul>
        </>
      )}
    </Section>
  );
};

export const ContributeStage = ({ deal, ctx }: { deal: Deal; ctx: StageCtx }) => {
  const ledger = useLedger();
  const { busy, error, run } = useLedgerAction();
  const state = sectionState(4, deal);
  const summary = deal.callSummary && deal.callSummary.payload;
  const collected = summary ? Number(summary.totalCollected) : 0;
  const called = summary ? Number(summary.totalTarget) : 0;
  const myNotice = deal.callNotices.find(n => n.payload.investor === ctx.party);
  const myPayment = deal.contributions.find(c => c.payload.investor === ctx.party);
  const complete = !!summary && collected >= called;

  const contribute = () => run(() => ledger.exercise(Convene.CapitalCallNotice.Contribute, myNotice!.contractId, {}));

  return (
    <Section
      no={4}
      title="Contributions"
      state={state}
      role={ctx.role}
      waiting={deal.rejected ? "Nothing to contribute." : "Opens when the capital call is issued."}
      aside={complete ? <Pill tone="success">Fully funded</Pill> : <Pill tone="pending">Collecting</Pill>}
    >
      {summary && (
        <>
          <div className="flex flex-col gap-3">
            <div className="flex flex-wrap items-end justify-between gap-3">
              <Figure value={money(collected)} label={`collected of ${money(called)} called`} />
              <span className="num text-sm text-muted">{called > 0 ? Math.floor((collected / called) * 100) : 0}%</span>
            </div>
            <Progress value={collected} max={called} role={ctx.role} />
          </div>

          {ctx.role === "investor" && myNotice && (
            <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-5">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="text-sm text-ink">
                  Your capital call: <span className="num text-base">{money(myNotice.payload.amount)}</span>
                </span>
                <PrivacyBadge>Only you, the fund manager and the auditor see this</PrivacyBadge>
              </div>
              <div>
                <Button role="investor" onClick={contribute} busy={busy}>
                  {busy ? "Contributing…" : `Contribute ${money(myNotice.payload.amount)}`}
                </Button>
              </div>
              <p className="text-xs leading-relaxed text-muted">
                Settles against the fund's internal balance. The fund total updates for everyone without showing who paid.
              </p>
              <ErrorLine message={error} />
            </div>
          )}

          <ul aria-label="Contribution status per investor">
            {deal.investors.map((inv, i) => {
              const mine = inv === ctx.party;
              if (ctx.role === "investor" && !mine) return <SealedRow key={inv} name={partyName(inv)} width={redactWidth(i + 2)} />;
              const paid = mine ? myPayment : deal.contributions.find(c => c.payload.investor === inv);
              const pending = deal.callNotices.find(n => n.payload.investor === inv);
              return (
                <MemberRow key={inv} name={partyName(inv)} mine={mine}>
                  {paid && (
                    <>
                      <span className="num text-base text-ink">{money(paid.payload.amount)}</span>
                      <Pill tone="success">Paid</Pill>
                    </>
                  )}
                  {!paid && pending && <Pill tone="pending">Awaiting {money(pending.payload.amount)}</Pill>}
                  {!paid && !pending && <Pill tone="neutral">Not called</Pill>}
                </MemberRow>
              );
            })}
          </ul>
        </>
      )}
    </Section>
  );
};
