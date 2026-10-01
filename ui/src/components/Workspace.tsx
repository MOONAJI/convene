import React, { useEffect, useMemo, useState } from "react";
import { Deal, useFund } from "../lib/fund";
import { Session } from "../lib/session";
import { demoUsers, roleStyles } from "../lib/roles";
import { money, partyName } from "../lib/format";
import { useNow } from "../lib/useNow";
import { Lockup } from "./ui/Logo";
import { Button, Pill, RoleDot, Tone } from "./ui/primitives";
import LedgerView from "./LedgerView";
import { Section, StageCtx } from "./stages/Section";
import { ProposalStage, ProposeForm } from "./stages/ProposalStage";
import { VoteStage } from "./stages/VoteStage";
import { CapitalCallStage, ContributeStage } from "./stages/CapitalStages";
import { DistributionStage } from "./stages/DistributionStage";

const NEW = "__new__";

const dealStatus = (deal: Deal): { tone: Tone; text: string } => {
  if (deal.rejected) return { tone: "danger", text: "Rejected by vote" };
  if (deal.distSummary) return { tone: "success", text: "Distributed" };
  switch (deal.stage) {
    case 2: return { tone: "pending", text: "Voting" };
    case 3: return { tone: "pending", text: "Approved, capital call next" };
    case 4: return { tone: "pending", text: "Collecting contributions" };
    default: return { tone: "pending", text: "Funded, awaiting exit" };
  }
};

const dotTone: Record<Tone, string> = {
  success: "bg-success",
  pending: "bg-pending",
  danger: "bg-danger",
  neutral: "bg-muted",
};

const Header = ({ session, onSignOut }: { session: Session; onSignOut: () => void }) => {
  const label = (demoUsers.find(u => u.userId === session.userId) || { label: partyName(session.party) }).label;
  return (
    <header className="sticky top-0 z-10 border-b border-border bg-bg/95 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-[1200px] items-center justify-between gap-4 px-4 md:px-8">
        <Lockup />
        <div className="flex items-center gap-3 md:gap-5">
          <span className="flex items-center gap-2 text-sm" title={session.party}>
            <RoleDot role={session.role} />
            <span className={roleStyles[session.role].text}>{label}</span>
            {session.role === "auditor" && <span className="hidden text-xs text-muted sm:inline">read-only</span>}
          </span>
          <Button variant="secondary" className="h-9 px-3" onClick={onSignOut}>
            Switch role
          </Button>
        </div>
      </div>
    </header>
  );
};

const DealTabs = ({ deals, selected, canCreate, onSelect }: { deals: Deal[]; selected: string; canCreate: boolean; onSelect: (id: string) => void }) => (
  <nav aria-label="Deals" className="-mx-4 overflow-x-auto px-4 md:mx-0 md:px-0">
    <ul className="flex min-w-max gap-1 border-b border-border">
      {deals.map(d => {
        const active = d.dealId === selected;
        return (
          <li key={d.dealId}>
            <button
              type="button"
              onClick={() => onSelect(d.dealId)}
              aria-current={active ? "page" : undefined}
              className={`-mb-px flex h-11 items-center gap-2 border-b-2 px-3 text-sm transition-colors ${active ? "border-ink text-ink" : "border-transparent text-muted hover:text-ink"}`}
            >
              <span className={`h-1.5 w-1.5 rounded-full ${dotTone[dealStatus(d).tone]}`} aria-hidden="true" />
              {d.dealId}
            </button>
          </li>
        );
      })}
      {canCreate && (
        <li>
          <button
            type="button"
            onClick={() => onSelect(NEW)}
            aria-current={selected === NEW ? "page" : undefined}
            className={`-mb-px flex h-11 items-center gap-2 border-b-2 px-3 text-sm transition-colors ${selected === NEW ? "border-role-fm text-role-fm" : "border-transparent text-muted hover:text-role-fm"}`}
          >
            <span aria-hidden="true">+</span> New deal
          </button>
        </li>
      )}
    </ul>
  </nav>
);

const DealView = ({ deal, ctx }: { deal: Deal; ctx: StageCtx }) => {
  const status = dealStatus(deal);
  return (
    <article className="flex flex-col">
      <div className="flex flex-col gap-4 pb-8 pt-8">
        <div className="flex flex-wrap items-center gap-3">
          <span className="text-sm text-muted">{deal.dealId}</span>
          <Pill tone={status.tone}>{status.text}</Pill>
        </div>
        <h1 className="max-w-[24ch] font-display text-[30px] font-medium leading-[1.1] tracking-[-0.025em] md:text-[40px]">
          {deal.description}
        </h1>
        <p className="text-sm text-muted">
          Raising <span className="num text-ink">{money(deal.targetCapital)}</span> from {deal.investors.length} investors,
          managed by {partyName(deal.fundManager)}, observed by {partyName(deal.auditor)}.
        </p>
      </div>
      <ProposalStage deal={deal} ctx={ctx} />
      <VoteStage deal={deal} ctx={ctx} />
      <CapitalCallStage deal={deal} ctx={ctx} />
      <ContributeStage deal={deal} ctx={ctx} />
      <DistributionStage deal={deal} ctx={ctx} />
    </article>
  );
};

const NewDeal = ({ ctx, existingIds, onProposed }: { ctx: StageCtx; existingIds: string[]; onProposed: (id: string) => void }) => (
  <article className="flex flex-col">
    <div className="flex flex-col gap-3 pb-8 pt-8">
      <h1 className="font-display text-[30px] font-medium leading-[1.1] tracking-[-0.025em] md:text-[40px]">Propose a deal</h1>
      <p className="max-w-[60ch] text-sm leading-relaxed text-muted">
        Investors vote privately. You and the auditor see each ballot; investors only see the final count.
      </p>
    </div>
    <Section no={1} title="Proposal" state="current" role="fm">
      <ProposeForm ctx={ctx} existingIds={existingIds} onProposed={onProposed} />
    </Section>
    <Section no={2} title="Vote" state="upcoming" role="fm" waiting="Opens when you propose the deal." />
    <Section no={3} title="Capital call" state="upcoming" role="fm" waiting="Opens once investors approve." />
    <Section no={4} title="Contributions" state="upcoming" role="fm" waiting="Opens when the capital call is issued." />
    <Section no={5} title="Exit and distribution" state="upcoming" role="fm" waiting="Opens when every capital call is paid." />
  </article>
);

const Loading = () => (
  <div className="flex flex-col gap-6 pt-10" aria-label="Loading the ledger" role="status">
    <span className="skeleton h-4 w-24" />
    <span className="skeleton h-10 w-3/4" />
    <span className="skeleton h-4 w-1/2" />
    <span className="skeleton mt-8 h-32 w-full" />
  </div>
);

const Lost = () => (
  <div className="flex flex-col items-start gap-4 pt-16" role="alert">
    <h1 className="font-display text-[30px] font-medium tracking-[-0.025em]">Lost connection to the ledger</h1>
    <p className="max-w-[52ch] text-sm leading-relaxed text-muted">
      Live updates stopped. Check that `daml start` is still running, then reload. If the ledger was restarted, its
      contracts start empty again.
    </p>
    <Button variant="secondary" onClick={() => window.location.reload()}>
      Reload
    </Button>
  </div>
);

const Empty = ({ role }: { role: Session["role"] }) => (
  <div className="flex flex-col gap-3 pt-16">
    <h1 className="font-display text-[30px] font-medium tracking-[-0.025em]">No deals yet</h1>
    <p className="max-w-[52ch] text-sm leading-relaxed text-muted">
      {role === "investor"
        ? "When the fund manager proposes a deal, it appears here and you can cast your vote."
        : "When the fund manager proposes a deal, it appears here. You'll observe every step, read-only."}
    </p>
  </div>
);

const Workspace = ({ session, onSignOut }: { session: Session; onSignOut: () => void }) => {
  const { loading, lost, deals, templates, agreement } = useFund();
  const now = useNow();
  const sorted = useMemo(
    () => [...deals].sort((a, b) => a.dealId.localeCompare(b.dealId, "en", { numeric: true })),
    [deals],
  );
  const [selected, setSelected] = useState<string>();
  const [pendingNew, setPendingNew] = useState<string>();

  // Pilihan default: deal terbaru; FundManager tanpa deal langsung ke form propose.
  const fallback = sorted.length > 0 ? sorted[sorted.length - 1].dealId : session.role === "fm" ? NEW : undefined;
  const current = selected && (selected === NEW || sorted.some(d => d.dealId === selected)) ? selected : fallback;

  // Setelah propose, pindah ke deal baru begitu kontraknya muncul di stream.
  useEffect(() => {
    if (pendingNew && sorted.some(d => d.dealId === pendingNew)) {
      setSelected(pendingNew);
      setPendingNew(undefined);
    }
  }, [pendingNew, sorted]);

  const ctx: StageCtx = { party: session.party, role: session.role, now, agreement };
  const deal = sorted.find(d => d.dealId === current);
  const name = (demoUsers.find(u => u.userId === session.userId) || { label: partyName(session.party) }).label;

  return (
    <div className="min-h-screen">
      <Header session={session} onSignOut={onSignOut} />
      <main className="mx-auto grid max-w-[1200px] gap-12 px-4 pb-24 pt-6 md:px-8 lg:grid-cols-[minmax(0,1fr)_300px] lg:gap-16">
        <div className="min-w-0">
          {lost ? (
            <Lost />
          ) : loading ? (
            <Loading />
          ) : (
            <>
              {(sorted.length > 0 || session.role === "fm") && (
                <DealTabs deals={sorted} selected={current || ""} canCreate={session.role === "fm"} onSelect={setSelected} />
              )}
              {current === NEW && (
                <NewDeal ctx={ctx} existingIds={sorted.map(d => d.dealId)} onProposed={setPendingNew} />
              )}
              {deal && <DealView key={deal.dealId} deal={deal} ctx={ctx} />}
              {!deal && current !== NEW && <Empty role={session.role} />}
            </>
          )}
        </div>
        <div className="lg:pt-6">
          <LedgerView templates={templates} role={session.role} name={name} />
        </div>
      </main>
    </div>
  );
};

export default Workspace;
