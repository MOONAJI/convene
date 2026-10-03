// Generated from Convene.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 from '@daml.js/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7';
import * as pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 from '@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662';

export declare type DistributionSummary = {
  fundManager: damlTypes.Party;
  investors: damlTypes.Party[];
  auditor: damlTypes.Party;
  dealId: string;
  totalContributed: damlTypes.Numeric;
  totalDistributed: damlTypes.Numeric;
};

export declare interface DistributionSummaryInterface {
  Archive: damlTypes.Choice<DistributionSummary, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<DistributionSummary, undefined>>;
}
export declare const DistributionSummary:
  damlTypes.Template<DistributionSummary, undefined, 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be:Convene:DistributionSummary'> &
  damlTypes.ToInterface<DistributionSummary, never> &
  DistributionSummaryInterface;

export declare namespace DistributionSummary {
  export type CreateEvent = damlLedger.CreateEvent<DistributionSummary, undefined, typeof DistributionSummary.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<DistributionSummary, typeof DistributionSummary.templateId>
  export type Event = damlLedger.Event<DistributionSummary, undefined, typeof DistributionSummary.templateId>
  export type QueryResult = damlLedger.QueryResult<DistributionSummary, undefined, typeof DistributionSummary.templateId>
}



export declare type DistributionNotice = {
  fundManager: damlTypes.Party;
  investor: damlTypes.Party;
  auditor: damlTypes.Party;
  dealId: string;
  contributed: damlTypes.Numeric;
  payout: damlTypes.Numeric;
};

export declare interface DistributionNoticeInterface {
  Archive: damlTypes.Choice<DistributionNotice, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<DistributionNotice, undefined>>;
}
export declare const DistributionNotice:
  damlTypes.Template<DistributionNotice, undefined, 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be:Convene:DistributionNotice'> &
  damlTypes.ToInterface<DistributionNotice, never> &
  DistributionNoticeInterface;

export declare namespace DistributionNotice {
  export type CreateEvent = damlLedger.CreateEvent<DistributionNotice, undefined, typeof DistributionNotice.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<DistributionNotice, typeof DistributionNotice.templateId>
  export type Event = damlLedger.Event<DistributionNotice, undefined, typeof DistributionNotice.templateId>
  export type QueryResult = damlLedger.QueryResult<DistributionNotice, undefined, typeof DistributionNotice.templateId>
}



export declare type PlatformFeeRecord = {
  fundManager: damlTypes.Party;
  platform: damlTypes.Party;
  auditor: damlTypes.Party;
  dealId: string;
  grossAmount: damlTypes.Numeric;
  feeRate: damlTypes.Numeric;
  feeAmount: damlTypes.Numeric;
};

export declare interface PlatformFeeRecordInterface {
  Archive: damlTypes.Choice<PlatformFeeRecord, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<PlatformFeeRecord, undefined>>;
}
export declare const PlatformFeeRecord:
  damlTypes.Template<PlatformFeeRecord, undefined, 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be:Convene:PlatformFeeRecord'> &
  damlTypes.ToInterface<PlatformFeeRecord, never> &
  PlatformFeeRecordInterface;

export declare namespace PlatformFeeRecord {
  export type CreateEvent = damlLedger.CreateEvent<PlatformFeeRecord, undefined, typeof PlatformFeeRecord.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<PlatformFeeRecord, typeof PlatformFeeRecord.templateId>
  export type Event = damlLedger.Event<PlatformFeeRecord, undefined, typeof PlatformFeeRecord.templateId>
  export type QueryResult = damlLedger.QueryResult<PlatformFeeRecord, undefined, typeof PlatformFeeRecord.templateId>
}



export declare type TriggerExit = {
  exitAmount: damlTypes.Numeric;
  platformAgreementCid: damlTypes.ContractId<PlatformAgreement>;
  contributionCids: damlTypes.ContractId<Contribution>[];
};

export declare const TriggerExit:
  damlTypes.Serializable<TriggerExit> & {
  }
;


export declare type RecordContribution = {
  amount: damlTypes.Numeric;
};

export declare const RecordContribution:
  damlTypes.Serializable<RecordContribution> & {
  }
;


export declare type FundLedger = {
  fundManager: damlTypes.Party;
  investors: damlTypes.Party[];
  auditor: damlTypes.Party;
  dealId: string;
  totalContributed: damlTypes.Numeric;
};

export declare interface FundLedgerInterface {
  TriggerExit: damlTypes.Choice<FundLedger, TriggerExit, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.ContractId<PlatformFeeRecord>, damlTypes.ContractId<DistributionSummary>, damlTypes.ContractId<DistributionNotice>[]>, FundLedger.Key> & damlTypes.ChoiceFrom<damlTypes.Template<FundLedger, FundLedger.Key>>;
  Archive: damlTypes.Choice<FundLedger, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, FundLedger.Key> & damlTypes.ChoiceFrom<damlTypes.Template<FundLedger, FundLedger.Key>>;
  RecordContribution: damlTypes.Choice<FundLedger, RecordContribution, damlTypes.ContractId<FundLedger>, FundLedger.Key> & damlTypes.ChoiceFrom<damlTypes.Template<FundLedger, FundLedger.Key>>;
}
export declare const FundLedger:
  damlTypes.Template<FundLedger, FundLedger.Key, 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be:Convene:FundLedger'> &
  damlTypes.ToInterface<FundLedger, never> &
  FundLedgerInterface;

export declare namespace FundLedger {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<FundLedger, FundLedger.Key, typeof FundLedger.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<FundLedger, typeof FundLedger.templateId>
  export type Event = damlLedger.Event<FundLedger, FundLedger.Key, typeof FundLedger.templateId>
  export type QueryResult = damlLedger.QueryResult<FundLedger, FundLedger.Key, typeof FundLedger.templateId>
}



export declare type Contribution = {
  fundManager: damlTypes.Party;
  investor: damlTypes.Party;
  auditor: damlTypes.Party;
  dealId: string;
  amount: damlTypes.Numeric;
};

export declare interface ContributionInterface {
  Archive: damlTypes.Choice<Contribution, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<Contribution, undefined>>;
}
export declare const Contribution:
  damlTypes.Template<Contribution, undefined, 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be:Convene:Contribution'> &
  damlTypes.ToInterface<Contribution, never> &
  ContributionInterface;

export declare namespace Contribution {
  export type CreateEvent = damlLedger.CreateEvent<Contribution, undefined, typeof Contribution.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Contribution, typeof Contribution.templateId>
  export type Event = damlLedger.Event<Contribution, undefined, typeof Contribution.templateId>
  export type QueryResult = damlLedger.QueryResult<Contribution, undefined, typeof Contribution.templateId>
}



export declare type RecordCollected = {
  amount: damlTypes.Numeric;
};

export declare const RecordCollected:
  damlTypes.Serializable<RecordCollected> & {
  }
;


export declare type CapitalCallSummary = {
  fundManager: damlTypes.Party;
  investors: damlTypes.Party[];
  auditor: damlTypes.Party;
  dealId: string;
  totalTarget: damlTypes.Numeric;
  totalCollected: damlTypes.Numeric;
};

export declare interface CapitalCallSummaryInterface {
  Archive: damlTypes.Choice<CapitalCallSummary, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, CapitalCallSummary.Key> & damlTypes.ChoiceFrom<damlTypes.Template<CapitalCallSummary, CapitalCallSummary.Key>>;
  RecordCollected: damlTypes.Choice<CapitalCallSummary, RecordCollected, damlTypes.ContractId<CapitalCallSummary>, CapitalCallSummary.Key> & damlTypes.ChoiceFrom<damlTypes.Template<CapitalCallSummary, CapitalCallSummary.Key>>;
}
export declare const CapitalCallSummary:
  damlTypes.Template<CapitalCallSummary, CapitalCallSummary.Key, 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be:Convene:CapitalCallSummary'> &
  damlTypes.ToInterface<CapitalCallSummary, never> &
  CapitalCallSummaryInterface;

export declare namespace CapitalCallSummary {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<CapitalCallSummary, CapitalCallSummary.Key, typeof CapitalCallSummary.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<CapitalCallSummary, typeof CapitalCallSummary.templateId>
  export type Event = damlLedger.Event<CapitalCallSummary, CapitalCallSummary.Key, typeof CapitalCallSummary.templateId>
  export type QueryResult = damlLedger.QueryResult<CapitalCallSummary, CapitalCallSummary.Key, typeof CapitalCallSummary.templateId>
}



export declare type Contribute = {
};

export declare const Contribute:
  damlTypes.Serializable<Contribute> & {
  }
;


export declare type CapitalCallNotice = {
  fundManager: damlTypes.Party;
  investor: damlTypes.Party;
  auditor: damlTypes.Party;
  dealId: string;
  amount: damlTypes.Numeric;
};

export declare interface CapitalCallNoticeInterface {
  Archive: damlTypes.Choice<CapitalCallNotice, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<CapitalCallNotice, undefined>>;
  Contribute: damlTypes.Choice<CapitalCallNotice, Contribute, damlTypes.ContractId<Contribution>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<CapitalCallNotice, undefined>>;
}
export declare const CapitalCallNotice:
  damlTypes.Template<CapitalCallNotice, undefined, 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be:Convene:CapitalCallNotice'> &
  damlTypes.ToInterface<CapitalCallNotice, never> &
  CapitalCallNoticeInterface;

export declare namespace CapitalCallNotice {
  export type CreateEvent = damlLedger.CreateEvent<CapitalCallNotice, undefined, typeof CapitalCallNotice.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<CapitalCallNotice, typeof CapitalCallNotice.templateId>
  export type Event = damlLedger.Event<CapitalCallNotice, undefined, typeof CapitalCallNotice.templateId>
  export type QueryResult = damlLedger.QueryResult<CapitalCallNotice, undefined, typeof CapitalCallNotice.templateId>
}



export declare type IssueCapitalCall = {
  callAmounts: CallAmount[];
};

export declare const IssueCapitalCall:
  damlTypes.Serializable<IssueCapitalCall> & {
  }
;


export declare type DealResult = {
  fundManager: damlTypes.Party;
  investors: damlTypes.Party[];
  auditor: damlTypes.Party;
  dealId: string;
  description: string;
  targetCapital: damlTypes.Numeric;
  approved: boolean;
  approveCount: damlTypes.Int;
  rejectCount: damlTypes.Int;
  totalVotes: damlTypes.Int;
  capitalCallIssued: boolean;
};

export declare interface DealResultInterface {
  IssueCapitalCall: damlTypes.Choice<DealResult, IssueCapitalCall, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.ContractId<CapitalCallSummary>, damlTypes.ContractId<FundLedger>, damlTypes.ContractId<CapitalCallNotice>[]>, DealResult.Key> & damlTypes.ChoiceFrom<damlTypes.Template<DealResult, DealResult.Key>>;
  Archive: damlTypes.Choice<DealResult, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, DealResult.Key> & damlTypes.ChoiceFrom<damlTypes.Template<DealResult, DealResult.Key>>;
}
export declare const DealResult:
  damlTypes.Template<DealResult, DealResult.Key, 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be:Convene:DealResult'> &
  damlTypes.ToInterface<DealResult, never> &
  DealResultInterface;

export declare namespace DealResult {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<DealResult, DealResult.Key, typeof DealResult.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<DealResult, typeof DealResult.templateId>
  export type Event = damlLedger.Event<DealResult, DealResult.Key, typeof DealResult.templateId>
  export type QueryResult = damlLedger.QueryResult<DealResult, DealResult.Key, typeof DealResult.templateId>
}



export declare type VoteReceipt = {
  fundManager: damlTypes.Party;
  investor: damlTypes.Party;
  auditor: damlTypes.Party;
  dealId: string;
};

export declare interface VoteReceiptInterface {
  Archive: damlTypes.Choice<VoteReceipt, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, VoteReceipt.Key> & damlTypes.ChoiceFrom<damlTypes.Template<VoteReceipt, VoteReceipt.Key>>;
}
export declare const VoteReceipt:
  damlTypes.Template<VoteReceipt, VoteReceipt.Key, 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be:Convene:VoteReceipt'> &
  damlTypes.ToInterface<VoteReceipt, never> &
  VoteReceiptInterface;

export declare namespace VoteReceipt {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.Party, string, damlTypes.Party>
  export type CreateEvent = damlLedger.CreateEvent<VoteReceipt, VoteReceipt.Key, typeof VoteReceipt.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<VoteReceipt, typeof VoteReceipt.templateId>
  export type Event = damlLedger.Event<VoteReceipt, VoteReceipt.Key, typeof VoteReceipt.templateId>
  export type QueryResult = damlLedger.QueryResult<VoteReceipt, VoteReceipt.Key, typeof VoteReceipt.templateId>
}



export declare type ConsumeVote = {
};

export declare const ConsumeVote:
  damlTypes.Serializable<ConsumeVote> & {
  }
;


export declare type Vote = {
  fundManager: damlTypes.Party;
  investor: damlTypes.Party;
  auditor: damlTypes.Party;
  dealId: string;
  approve: boolean;
};

export declare interface VoteInterface {
  Archive: damlTypes.Choice<Vote, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, Vote.Key> & damlTypes.ChoiceFrom<damlTypes.Template<Vote, Vote.Key>>;
  ConsumeVote: damlTypes.Choice<Vote, ConsumeVote, boolean, Vote.Key> & damlTypes.ChoiceFrom<damlTypes.Template<Vote, Vote.Key>>;
}
export declare const Vote:
  damlTypes.Template<Vote, Vote.Key, 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be:Convene:Vote'> &
  damlTypes.ToInterface<Vote, never> &
  VoteInterface;

export declare namespace Vote {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3<damlTypes.Party, damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<Vote, Vote.Key, typeof Vote.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<Vote, typeof Vote.templateId>
  export type Event = damlLedger.Event<Vote, Vote.Key, typeof Vote.templateId>
  export type QueryResult = damlLedger.QueryResult<Vote, Vote.Key, typeof Vote.templateId>
}



export declare type TallyVotes = {
  voteCids: damlTypes.ContractId<Vote>[];
};

export declare const TallyVotes:
  damlTypes.Serializable<TallyVotes> & {
  }
;


export declare type CastVote = {
  investor: damlTypes.Party;
  approve: boolean;
};

export declare const CastVote:
  damlTypes.Serializable<CastVote> & {
  }
;


export declare type DealProposal = {
  fundManager: damlTypes.Party;
  investors: damlTypes.Party[];
  auditor: damlTypes.Party;
  dealId: string;
  description: string;
  targetCapital: damlTypes.Numeric;
  voteDeadline: damlTypes.Time;
};

export declare interface DealProposalInterface {
  TallyVotes: damlTypes.Choice<DealProposal, TallyVotes, damlTypes.ContractId<DealResult>, DealProposal.Key> & damlTypes.ChoiceFrom<damlTypes.Template<DealProposal, DealProposal.Key>>;
  Archive: damlTypes.Choice<DealProposal, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, DealProposal.Key> & damlTypes.ChoiceFrom<damlTypes.Template<DealProposal, DealProposal.Key>>;
  CastVote: damlTypes.Choice<DealProposal, CastVote, damlTypes.ContractId<Vote>, DealProposal.Key> & damlTypes.ChoiceFrom<damlTypes.Template<DealProposal, DealProposal.Key>>;
}
export declare const DealProposal:
  damlTypes.Template<DealProposal, DealProposal.Key, 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be:Convene:DealProposal'> &
  damlTypes.ToInterface<DealProposal, never> &
  DealProposalInterface;

export declare namespace DealProposal {
  export type Key = pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.Party, string>
  export type CreateEvent = damlLedger.CreateEvent<DealProposal, DealProposal.Key, typeof DealProposal.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<DealProposal, typeof DealProposal.templateId>
  export type Event = damlLedger.Event<DealProposal, DealProposal.Key, typeof DealProposal.templateId>
  export type QueryResult = damlLedger.QueryResult<DealProposal, DealProposal.Key, typeof DealProposal.templateId>
}



export declare type RecordPlatformFee = {
  dealId: string;
  grossAmount: damlTypes.Numeric;
};

export declare const RecordPlatformFee:
  damlTypes.Serializable<RecordPlatformFee> & {
  }
;


export declare type PlatformAgreement = {
  platform: damlTypes.Party;
  fundManager: damlTypes.Party;
  auditor: damlTypes.Party;
  feeRate: damlTypes.Numeric;
};

export declare interface PlatformAgreementInterface {
  Archive: damlTypes.Choice<PlatformAgreement, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<PlatformAgreement, undefined>>;
  RecordPlatformFee: damlTypes.Choice<PlatformAgreement, RecordPlatformFee, pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2<damlTypes.ContractId<PlatformFeeRecord>, damlTypes.Numeric>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<PlatformAgreement, undefined>>;
}
export declare const PlatformAgreement:
  damlTypes.Template<PlatformAgreement, undefined, 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be:Convene:PlatformAgreement'> &
  damlTypes.ToInterface<PlatformAgreement, never> &
  PlatformAgreementInterface;

export declare namespace PlatformAgreement {
  export type CreateEvent = damlLedger.CreateEvent<PlatformAgreement, undefined, typeof PlatformAgreement.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<PlatformAgreement, typeof PlatformAgreement.templateId>
  export type Event = damlLedger.Event<PlatformAgreement, undefined, typeof PlatformAgreement.templateId>
  export type QueryResult = damlLedger.QueryResult<PlatformAgreement, undefined, typeof PlatformAgreement.templateId>
}



export declare type AcceptPlatformService = {
};

export declare const AcceptPlatformService:
  damlTypes.Serializable<AcceptPlatformService> & {
  }
;


export declare type PlatformServiceOffer = {
  platform: damlTypes.Party;
  fundManager: damlTypes.Party;
  auditor: damlTypes.Party;
  feeRate: damlTypes.Numeric;
};

export declare interface PlatformServiceOfferInterface {
  Archive: damlTypes.Choice<PlatformServiceOffer, pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive, {}, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<PlatformServiceOffer, undefined>>;
  AcceptPlatformService: damlTypes.Choice<PlatformServiceOffer, AcceptPlatformService, damlTypes.ContractId<PlatformAgreement>, undefined> & damlTypes.ChoiceFrom<damlTypes.Template<PlatformServiceOffer, undefined>>;
}
export declare const PlatformServiceOffer:
  damlTypes.Template<PlatformServiceOffer, undefined, 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be:Convene:PlatformServiceOffer'> &
  damlTypes.ToInterface<PlatformServiceOffer, never> &
  PlatformServiceOfferInterface;

export declare namespace PlatformServiceOffer {
  export type CreateEvent = damlLedger.CreateEvent<PlatformServiceOffer, undefined, typeof PlatformServiceOffer.templateId>
  export type ArchiveEvent = damlLedger.ArchiveEvent<PlatformServiceOffer, typeof PlatformServiceOffer.templateId>
  export type Event = damlLedger.Event<PlatformServiceOffer, undefined, typeof PlatformServiceOffer.templateId>
  export type QueryResult = damlLedger.QueryResult<PlatformServiceOffer, undefined, typeof PlatformServiceOffer.templateId>
}



export declare type CallAmount = {
  investor: damlTypes.Party;
  amount: damlTypes.Numeric;
};

export declare const CallAmount:
  damlTypes.Serializable<CallAmount> & {
  }
;

