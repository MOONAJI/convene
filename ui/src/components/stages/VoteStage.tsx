import React from "react";
import { useLedger } from "@daml/react";
import { Convene } from "@daml.js/convene";
import { Deal } from "../../lib/fund";
import { partyName, timeLeft } from "../../lib/format";
import { Button, ErrorLine, MemberRow, Pill, PrivacyBadge, SealedRow, redactWidth, useLedgerAction } from "../ui/primitives";
import { Figure, Section, StageCtx, sectionState } from "./Section";

const Choice = ({ approve }: { approve: boolean }) =>
  approve ? <Pill tone="success">Approve</Pill> : <Pill tone="danger">Reject</Pill>;

const Result = ({ deal }: { deal: Deal }) => {
  const r = deal.result!.payload;
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap items-end gap-x-12 gap-y-5">
        <div className="flex flex-col gap-1">
          <span className={`font-display text-[32px] font-medium leading-none tracking-[-0.02em] ${r.approved ? "text-success" : "text-danger"}`}>
            {r.approved ? "Approved" : "Rejected"}
          </span>
          <span className="text-xs text-muted">Simple majority of ballots cast, ties reject</span>
        </div>
        <Figure value={r.approveCount} label="Approve" />
        <Figure value={r.rejectCount} label="Reject" />
        <Figure value={`${r.totalVotes} of ${deal.investors.length}`} label="Ballots cast" />
      </div>
      <p className="max-w-[62ch] text-sm leading-relaxed text-muted">
        The ledger only accepts a tally that includes every ballot cast. The tally consumed them all, so only this
        aggregate remains, and it carries no record of who voted which way.
      </p>
    </div>
  );
};

export const VoteStage = ({ deal, ctx }: { deal: Deal; ctx: StageCtx }) => {
  const ledger = useLedger();
  const cast = useLedgerAction();
  const tally = useLedgerAction();
  const state = sectionState(2, deal);
  const deadlineMs = deal.voteDeadline ? new Date(deal.voteDeadline).getTime() : 0;
  const open = !!deal.proposal && ctx.now < deadlineMs;
  const myVote = deal.votes.find(v => v.payload.investor === ctx.party);
  const allIn = deal.votes.length === deal.investors.length;

  // Setelah tally, hasilnya sudah jadi judul besar di isi section; tidak perlu pill.
  const aside = deal.result ? undefined : open ? (
    <Pill tone="pending">
      <span className="num">{timeLeft(deal.voteDeadline!, ctx.now)}</span>
    </Pill>
  ) : (
    <Pill tone="neutral">Voting closed</Pill>
  );

  if (deal.result) {
    return (
      <Section no={2} title="Vote" state={state} role={ctx.role} aside={aside}>
        <Result deal={deal} />
      </Section>
    );
  }

  const vote = (approve: boolean) =>
    cast.run(() => ledger.exercise(Convene.DealProposal.CastVote, deal.proposal!.contractId, { investor: ctx.party, approve }));

  const runTally = () =>
    tally.run(() =>
      ledger.exercise(Convene.DealProposal.TallyVotes, deal.proposal!.contractId, {
        voteCids: deal.votes.map(v => v.contractId),
      }),
    );

  return (
    <Section no={2} title="Vote" state={state} role={ctx.role} aside={aside}>
      {ctx.role === "investor" && !myVote && open && (
        <div className="flex flex-col gap-4 rounded-lg border border-border bg-surface p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-sm text-ink">Should the fund take this deal?</span>
            <PrivacyBadge>Your vote is private</PrivacyBadge>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button role="investor" busy={cast.busy} onClick={() => vote(true)}>
              Vote approve
            </Button>
            <Button variant="secondary" busy={cast.busy} onClick={() => vote(false)}>
              Vote reject
            </Button>
          </div>
          <p className="text-xs leading-relaxed text-muted">
            Only you, the fund manager and the auditor will see your ballot. Other investors see the final count.
            Ballots can't be changed once cast.
          </p>
          <ErrorLine message={cast.error} />
        </div>
      )}

      <ul aria-label="Ballots">
        {deal.investors.map((inv, i) => {
          const ballot = deal.votes.find(v => v.payload.investor === inv);
          const mine = inv === ctx.party;
          if (ctx.role === "investor" && !mine) return <SealedRow key={inv} name={partyName(inv)} width={redactWidth(i)} />;
          return (
            <MemberRow key={inv} name={partyName(inv)} mine={mine}>
              {ballot ? <Choice approve={ballot.payload.approve} /> : <Pill tone="neutral">{open ? "No ballot yet" : "Didn't vote"}</Pill>}
              {mine && ballot && <PrivacyBadge>Private to you, the fund manager and the auditor</PrivacyBadge>}
            </MemberRow>
          );
        })}
      </ul>

      {ctx.role === "investor" && (
        <p className="text-xs leading-relaxed text-muted">
          You can't see whether other investors have voted. Their ballots are never sent to your ledger.
        </p>
      )}

      {ctx.role === "fm" && (
        <div className="flex flex-col gap-3">
          <div className="flex flex-wrap items-center gap-4">
            <Button role="fm" onClick={runTally} busy={tally.busy} disabled={!allIn && open}>
              {tally.busy ? "Tallying…" : "Tally votes"}
            </Button>
            <span className="text-sm text-muted">
              <span className="num text-ink">{deal.votes.length}</span> of {deal.investors.length} ballots in.{" "}
              {!allIn && open ? "Tally opens when everyone has voted or the deadline passes." : "Ready to tally."}
            </span>
          </div>
          <ErrorLine message={tally.error} />
        </div>
      )}
    </Section>
  );
};
