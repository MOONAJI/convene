import { useEffect, useMemo, useState } from "react";
import { useStreamQueries } from "@daml/react";
import { CreateEvent } from "@daml/ledger";
import { Convene } from "@daml.js/convene";

// Semua data datang dari stream JSON API untuk party yang login. Ledger hanya
// mengirim kontrak di mana party ini signatory/observer, jadi tidak ada filter
// privasi di sini: yang tidak boleh dilihat memang tidak pernah sampai.

type Ev<T extends object> = CreateEvent<T, any, any>;

export type StageNo = 1 | 2 | 3 | 4 | 5;

export type Deal = {
  dealId: string;
  fundManager: string;
  auditor: string;
  investors: string[];
  description: string;
  targetCapital: string;
  voteDeadline?: string;
  proposal?: Ev<Convene.DealProposal>;
  result?: Ev<Convene.DealResult>;
  votes: Ev<Convene.Vote>[];
  callNotices: Ev<Convene.CapitalCallNotice>[];
  callSummary?: Ev<Convene.CapitalCallSummary>;
  contributions: Ev<Convene.Contribution>[];
  fundLedger?: Ev<Convene.FundLedger>;
  distNotices: Ev<Convene.DistributionNotice>[];
  distSummary?: Ev<Convene.DistributionSummary>;
  feeRecord?: Ev<Convene.PlatformFeeRecord>;
  // Tahap yang sedang berjalan; `closed` kalau deal ditolak atau sudah didistribusi.
  stage: StageNo;
  closed: boolean;
  rejected: boolean;
};

// Urutan & aturan visibility per template, sesuai tabel ARCHITECTURE.md bagian 4.
// "all" = semua anggota fund, "own" = cuma milik sendiri, "none" = tidak pernah.
export type Reach = "all" | "own" | "none";

export type TemplateView = {
  name: string;
  count: number;
  investorReach: Reach;
};

const byDeal = <T extends { dealId: string }>(events: readonly Ev<T>[], dealId: string) =>
  events.filter(e => e.payload.dealId === dealId);

export const useFund = () => {
  const proposals = useStreamQueries(Convene.DealProposal);
  const results = useStreamQueries(Convene.DealResult);
  const votes = useStreamQueries(Convene.Vote);
  const voteReceipts = useStreamQueries(Convene.VoteReceipt);
  const callNotices = useStreamQueries(Convene.CapitalCallNotice);
  const callSummaries = useStreamQueries(Convene.CapitalCallSummary);
  const contributions = useStreamQueries(Convene.Contribution);
  const fundLedgers = useStreamQueries(Convene.FundLedger);
  const distNotices = useStreamQueries(Convene.DistributionNotice);
  const distSummaries = useStreamQueries(Convene.DistributionSummary);
  const feeRecords = useStreamQueries(Convene.PlatformFeeRecord);
  const agreements = useStreamQueries(Convene.PlatformAgreement);

  const loading =
    proposals.loading || results.loading || votes.loading || voteReceipts.loading || callNotices.loading ||
    callSummaries.loading || contributions.loading || fundLedgers.loading ||
    distNotices.loading || distSummaries.loading || feeRecords.loading || agreements.loading;

  // @daml/react mengembalikan `loading` ke true kalau WebSocket putus permanen
  // (mis. `daml start` dimatikan). Kalau data sudah pernah live, itu artinya koneksi hilang.
  const [wasLive, setWasLive] = useState(false);
  useEffect(() => {
    if (!loading) setWasLive(true);
  }, [loading]);

  const deals = useMemo<Deal[]>(() => {
    const ids: string[] = [];
    const add = (id: string) => { if (!ids.includes(id)) ids.push(id); };
    proposals.contracts.forEach(c => add(c.payload.dealId));
    results.contracts.forEach(c => add(c.payload.dealId));

    return ids.map(dealId => {
      const proposal = proposals.contracts.find(c => c.payload.dealId === dealId);
      const result = results.contracts.find(c => c.payload.dealId === dealId);
      const base = (proposal || result)!.payload;
      const callSummary = callSummaries.contracts.find(c => c.payload.dealId === dealId);
      const fundLedger = fundLedgers.contracts.find(c => c.payload.dealId === dealId);
      const distSummary = distSummaries.contracts.find(c => c.payload.dealId === dealId);

      const rejected = !!result && !result.payload.approved;
      let stage: StageNo = 2;
      if (result && result.payload.approved) stage = 3;
      if (result && result.payload.capitalCallIssued) stage = 4;
      if (callSummary && Number(callSummary.payload.totalCollected) >= Number(callSummary.payload.totalTarget)) stage = 5;
      if (distSummary) stage = 5;

      return {
        dealId,
        fundManager: base.fundManager,
        auditor: base.auditor,
        investors: base.investors,
        description: base.description,
        targetCapital: base.targetCapital,
        voteDeadline: proposal ? proposal.payload.voteDeadline : undefined,
        proposal,
        result,
        votes: byDeal(votes.contracts, dealId),
        callNotices: byDeal(callNotices.contracts, dealId),
        callSummary,
        contributions: byDeal(contributions.contracts, dealId),
        fundLedger,
        distNotices: byDeal(distNotices.contracts, dealId),
        distSummary,
        feeRecord: feeRecords.contracts.find(c => c.payload.dealId === dealId),
        stage,
        closed: rejected || !!distSummary,
        rejected,
      };
    });
  }, [proposals.contracts, results.contracts, votes.contracts, callNotices.contracts,
      callSummaries.contracts, contributions.contracts, fundLedgers.contracts,
      distNotices.contracts, distSummaries.contracts, feeRecords.contracts]);

  const templates: TemplateView[] = [
    { name: "DealProposal", count: proposals.contracts.length, investorReach: "all" },
    { name: "Vote", count: votes.contracts.length, investorReach: "own" },
    { name: "VoteReceipt", count: voteReceipts.contracts.length, investorReach: "own" },
    { name: "DealResult", count: results.contracts.length, investorReach: "all" },
    { name: "CapitalCallNotice", count: callNotices.contracts.length, investorReach: "own" },
    { name: "CapitalCallSummary", count: callSummaries.contracts.length, investorReach: "all" },
    { name: "Contribution", count: contributions.contracts.length, investorReach: "own" },
    { name: "FundLedger", count: fundLedgers.contracts.length, investorReach: "all" },
    { name: "DistributionNotice", count: distNotices.contracts.length, investorReach: "own" },
    { name: "DistributionSummary", count: distSummaries.contracts.length, investorReach: "all" },
    { name: "PlatformFeeRecord", count: feeRecords.contracts.length, investorReach: "none" },
    { name: "PlatformAgreement", count: agreements.contracts.length, investorReach: "none" },
  ];

  return {
    loading,
    lost: loading && wasLive,
    deals,
    templates,
    agreement: agreements.contracts[0] as Ev<Convene.PlatformAgreement> | undefined,
  };
};
