import React, { useState } from "react";
import { useLedger } from "@daml/react";
import { Convene } from "@daml.js/convene";
import { Deal } from "../../lib/fund";
import { centsOf, money, partyName, percent, toNumeric } from "../../lib/format";
import { Button, ErrorLine, Field, MemberRow, Pill, PrivacyBadge, SealedRow, redactWidth, useLedgerAction } from "../ui/primitives";
import { Figure, Section, StageCtx, sectionState } from "./Section";

// Fee Platform dipotong dulu, sisanya dibagi proporsional ke kontribusi
// (BUSINESSRULES.md bagian 6). Rumus ini cuma pratinjau; angka final dihitung kontrak.
const ExitForm = ({ deal, ctx }: { deal: Deal; ctx: StageCtx }) => {
  const ledger = useLedger();
  const { busy, error, run } = useLedgerAction();
  const [gross, setGross] = useState("");
  const rate = ctx.agreement ? Number(ctx.agreement.payload.feeRate) : 0;
  const grossN = centsOf(gross);
  const fee = grossN * rate;
  const net = grossN - fee;
  const totalIn = deal.fundLedger ? Number(deal.fundLedger.payload.totalContributed) : 0;

  const exit = () =>
    run(() =>
      ledger.exercise(Convene.FundLedger.TriggerExit, deal.fundLedger!.contractId, {
        exitAmount: toNumeric(grossN),
        platformAgreementCid: ctx.agreement!.contractId,
        contributionCids: deal.contributions.map(c => c.contractId),
      }),
    );

  return (
    <div className="flex flex-col gap-6">
      <Field label="Exit proceeds (USD)" htmlFor="exit-amount" hint={`Gross amount realised when the fund exits. Fund size: ${money(totalIn)}.`}>
        <input
          id="exit-amount"
          type="number"
          min="0"
          step="any"
          inputMode="decimal"
          className="field num max-w-[260px]"
          placeholder="740000"
          value={gross}
          onChange={e => setGross(e.target.value)}
        />
      </Field>

      {grossN > 0 && (
        <dl className="grid max-w-[560px] grid-cols-[minmax(0,1fr)_auto] gap-x-6 gap-y-2 border-l border-border pl-4 text-sm">
          <dt className="text-muted">Exit proceeds</dt>
          <dd className="num text-right text-ink">{money(grossN)}</dd>
          <dt className="text-muted">Platform fee, {percent(rate)} of proceeds</dt>
          <dd className="num text-right text-ink">−{money(fee)}</dd>
          <dt className="text-ink">Net to investors</dt>
          <dd className="num text-right font-medium text-ink">{money(net)}</dd>
          {deal.contributions.map(c => (
            <React.Fragment key={c.contractId}>
              <dt className="pl-4 text-muted">
                {partyName(c.payload.investor)}, {percent(Number(c.payload.amount) / totalIn)} share
              </dt>
              <dd className="num text-right text-muted">{money((net * Number(c.payload.amount)) / totalIn)}</dd>
            </React.Fragment>
          ))}
        </dl>
      )}

      {!ctx.agreement && <ErrorLine message="No platform agreement found. Restart `daml start` so the init script creates it." />}
      <ErrorLine message={error} />
      <div>
        <Button role="fm" onClick={exit} busy={busy} disabled={!(grossN > 0) || !ctx.agreement}>
          {busy ? "Distributing…" : "Trigger exit and distribute"}
        </Button>
      </div>
    </div>
  );
};

// Auditor & FundManager: bukti fee bisa dicocokkan ulang (BUSINESSRULES.md bagian 8).
const FeeRecord = ({ deal }: { deal: Deal }) => {
  const f = deal.feeRecord!.payload;
  const expected = Number(f.grossAmount) * Number(f.feeRate);
  const matches = Math.abs(expected - Number(f.feeAmount)) < 0.005;
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-surface p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="text-sm font-medium text-ink">Platform fee record</span>
        <span className="text-xs text-muted">Signed by the fund manager and the platform. Investors don't receive it.</span>
      </div>
      <dl className="grid grid-cols-2 gap-x-8 gap-y-4 md:grid-cols-4">
        <div>
          <dt className="text-xs text-muted">Exit proceeds</dt>
          <dd className="num text-base text-ink">{money(f.grossAmount)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Fee rate</dt>
          <dd className="num text-base text-ink">{percent(f.feeRate)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Fee charged</dt>
          <dd className="num text-base text-ink">{money(f.feeAmount)}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted">Rate × proceeds</dt>
          <dd className="text-sm">
            {matches ? <Pill tone="success">Matches</Pill> : <Pill tone="danger">Expected {money(expected)}</Pill>}
          </dd>
        </div>
      </dl>
    </div>
  );
};

export const DistributionStage = ({ deal, ctx }: { deal: Deal; ctx: StageCtx }) => {
  const state = sectionState(5, deal);
  const s = deal.distSummary && deal.distSummary.payload;

  return (
    <Section
      no={5}
      title="Exit and distribution"
      state={state}
      role={ctx.role}
      waiting={deal.rejected ? "Nothing to distribute." : "Opens when every capital call is paid."}
      aside={s ? <Pill tone="success">Distributed</Pill> : <Pill tone="pending">Awaiting exit</Pill>}
    >
      {!s && ctx.role === "fm" && deal.fundLedger && <ExitForm deal={deal} ctx={ctx} />}
      {!s && ctx.role !== "fm" && <p className="text-sm text-muted">The fund is fully funded. Waiting for the fund manager to trigger the exit.</p>}

      {s && (
        <>
          <div className="flex flex-wrap gap-x-12 gap-y-5">
            <Figure value={money(s.totalDistributed)} label="Distributed to investors" />
            <Figure value={money(s.totalContributed)} label="Contributed" />
            <Figure
              value={`${(Number(s.totalDistributed) / Number(s.totalContributed)).toFixed(2)}×`}
              label="Net multiple"
            />
          </div>

          {ctx.role !== "investor" && deal.feeRecord && <FeeRecord deal={deal} />}

          <ul aria-label="Payout per investor">
            {deal.investors.map((inv, i) => {
              const mine = inv === ctx.party;
              if (ctx.role === "investor" && !mine) return <SealedRow key={inv} name={partyName(inv)} width={redactWidth(i + 3)} />;
              const n = deal.distNotices.find(d => d.payload.investor === inv);
              return (
                <MemberRow key={inv} name={partyName(inv)} mine={mine}>
                  {n ? (
                    <>
                      <span className="text-xs text-muted">
                        put in <span className="num">{money(n.payload.contributed)}</span>
                      </span>
                      <span className="num text-base text-ink">{money(n.payload.payout)}</span>
                    </>
                  ) : (
                    <Pill tone="neutral">No payout</Pill>
                  )}
                  {mine && n && <PrivacyBadge>Your payout is private</PrivacyBadge>}
                </MemberRow>
              );
            })}
          </ul>
        </>
      )}
    </Section>
  );
};
