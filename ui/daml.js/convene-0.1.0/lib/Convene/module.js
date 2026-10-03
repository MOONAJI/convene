"use strict";
/* eslint-disable-next-line no-unused-vars */
function __export(m) {
/* eslint-disable-next-line no-prototype-builtins */
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
Object.defineProperty(exports, "__esModule", { value: true });
/* eslint-disable-next-line no-unused-vars */
var jtv = require('@mojotech/json-type-validation');
/* eslint-disable-next-line no-unused-vars */
var damlTypes = require('@daml/types');
/* eslint-disable-next-line no-unused-vars */
var damlLedger = require('@daml/ledger');

var pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7 = require('@daml.js/40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7');
var pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662 = require('@daml.js/d14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662');


exports.DistributionSummary = damlTypes.assembleTemplate(
{
  templateId: 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be:Convene:DistributionSummary',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({fundManager: damlTypes.Party.decoder, investors: damlTypes.List(damlTypes.Party).decoder, auditor: damlTypes.Party.decoder, dealId: damlTypes.Text.decoder, totalContributed: damlTypes.Numeric(10).decoder, totalDistributed: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    fundManager: damlTypes.Party.encode(__typed__.fundManager),
    investors: damlTypes.List(damlTypes.Party).encode(__typed__.investors),
    auditor: damlTypes.Party.encode(__typed__.auditor),
    dealId: damlTypes.Text.encode(__typed__.dealId),
    totalContributed: damlTypes.Numeric(10).encode(__typed__.totalContributed),
    totalDistributed: damlTypes.Numeric(10).encode(__typed__.totalDistributed),
  };
}
,
  Archive: {
    template: function () { return exports.DistributionSummary; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.DistributionSummary, ['ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be', 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be']);



exports.DistributionNotice = damlTypes.assembleTemplate(
{
  templateId: 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be:Convene:DistributionNotice',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({fundManager: damlTypes.Party.decoder, investor: damlTypes.Party.decoder, auditor: damlTypes.Party.decoder, dealId: damlTypes.Text.decoder, contributed: damlTypes.Numeric(10).decoder, payout: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    fundManager: damlTypes.Party.encode(__typed__.fundManager),
    investor: damlTypes.Party.encode(__typed__.investor),
    auditor: damlTypes.Party.encode(__typed__.auditor),
    dealId: damlTypes.Text.encode(__typed__.dealId),
    contributed: damlTypes.Numeric(10).encode(__typed__.contributed),
    payout: damlTypes.Numeric(10).encode(__typed__.payout),
  };
}
,
  Archive: {
    template: function () { return exports.DistributionNotice; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.DistributionNotice, ['ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be', 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be']);



exports.PlatformFeeRecord = damlTypes.assembleTemplate(
{
  templateId: 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be:Convene:PlatformFeeRecord',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({fundManager: damlTypes.Party.decoder, platform: damlTypes.Party.decoder, auditor: damlTypes.Party.decoder, dealId: damlTypes.Text.decoder, grossAmount: damlTypes.Numeric(10).decoder, feeRate: damlTypes.Numeric(10).decoder, feeAmount: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    fundManager: damlTypes.Party.encode(__typed__.fundManager),
    platform: damlTypes.Party.encode(__typed__.platform),
    auditor: damlTypes.Party.encode(__typed__.auditor),
    dealId: damlTypes.Text.encode(__typed__.dealId),
    grossAmount: damlTypes.Numeric(10).encode(__typed__.grossAmount),
    feeRate: damlTypes.Numeric(10).encode(__typed__.feeRate),
    feeAmount: damlTypes.Numeric(10).encode(__typed__.feeAmount),
  };
}
,
  Archive: {
    template: function () { return exports.PlatformFeeRecord; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.PlatformFeeRecord, ['ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be', 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be']);



exports.TriggerExit = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({exitAmount: damlTypes.Numeric(10).decoder, platformAgreementCid: damlTypes.ContractId(exports.PlatformAgreement).decoder, contributionCids: damlTypes.List(damlTypes.ContractId(exports.Contribution)).decoder, }); }),
  encode: function (__typed__) {
  return {
    exitAmount: damlTypes.Numeric(10).encode(__typed__.exitAmount),
    platformAgreementCid: damlTypes.ContractId(exports.PlatformAgreement).encode(__typed__.platformAgreementCid),
    contributionCids: damlTypes.List(damlTypes.ContractId(exports.Contribution)).encode(__typed__.contributionCids),
  };
}
,
};



exports.RecordContribution = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({amount: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    amount: damlTypes.Numeric(10).encode(__typed__.amount),
  };
}
,
};



exports.FundLedger = damlTypes.assembleTemplate(
{
  templateId: 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be:Convene:FundLedger',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({fundManager: damlTypes.Party.decoder, investors: damlTypes.List(damlTypes.Party).decoder, auditor: damlTypes.Party.decoder, dealId: damlTypes.Text.decoder, totalContributed: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    fundManager: damlTypes.Party.encode(__typed__.fundManager),
    investors: damlTypes.List(damlTypes.Party).encode(__typed__.investors),
    auditor: damlTypes.Party.encode(__typed__.auditor),
    dealId: damlTypes.Text.encode(__typed__.dealId),
    totalContributed: damlTypes.Numeric(10).encode(__typed__.totalContributed),
  };
}
,
  TriggerExit: {
    template: function () { return exports.FundLedger; },
    choiceName: 'TriggerExit',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.TriggerExit.decoder; }),
    argumentEncode: function (__typed__) { return exports.TriggerExit.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.ContractId(exports.PlatformFeeRecord), damlTypes.ContractId(exports.DistributionSummary), damlTypes.List(damlTypes.ContractId(exports.DistributionNotice))).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.ContractId(exports.PlatformFeeRecord), damlTypes.ContractId(exports.DistributionSummary), damlTypes.List(damlTypes.ContractId(exports.DistributionNotice))).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.FundLedger; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  RecordContribution: {
    template: function () { return exports.FundLedger; },
    choiceName: 'RecordContribution',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RecordContribution.decoder; }),
    argumentEncode: function (__typed__) { return exports.RecordContribution.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.FundLedger).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.FundLedger).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.FundLedger, ['ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be', 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be']);



exports.Contribution = damlTypes.assembleTemplate(
{
  templateId: 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be:Convene:Contribution',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({fundManager: damlTypes.Party.decoder, investor: damlTypes.Party.decoder, auditor: damlTypes.Party.decoder, dealId: damlTypes.Text.decoder, amount: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    fundManager: damlTypes.Party.encode(__typed__.fundManager),
    investor: damlTypes.Party.encode(__typed__.investor),
    auditor: damlTypes.Party.encode(__typed__.auditor),
    dealId: damlTypes.Text.encode(__typed__.dealId),
    amount: damlTypes.Numeric(10).encode(__typed__.amount),
  };
}
,
  Archive: {
    template: function () { return exports.Contribution; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.Contribution, ['ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be', 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be']);



exports.RecordCollected = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({amount: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    amount: damlTypes.Numeric(10).encode(__typed__.amount),
  };
}
,
};



exports.CapitalCallSummary = damlTypes.assembleTemplate(
{
  templateId: 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be:Convene:CapitalCallSummary',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({fundManager: damlTypes.Party.decoder, investors: damlTypes.List(damlTypes.Party).decoder, auditor: damlTypes.Party.decoder, dealId: damlTypes.Text.decoder, totalTarget: damlTypes.Numeric(10).decoder, totalCollected: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    fundManager: damlTypes.Party.encode(__typed__.fundManager),
    investors: damlTypes.List(damlTypes.Party).encode(__typed__.investors),
    auditor: damlTypes.Party.encode(__typed__.auditor),
    dealId: damlTypes.Text.encode(__typed__.dealId),
    totalTarget: damlTypes.Numeric(10).encode(__typed__.totalTarget),
    totalCollected: damlTypes.Numeric(10).encode(__typed__.totalCollected),
  };
}
,
  Archive: {
    template: function () { return exports.CapitalCallSummary; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  RecordCollected: {
    template: function () { return exports.CapitalCallSummary; },
    choiceName: 'RecordCollected',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RecordCollected.decoder; }),
    argumentEncode: function (__typed__) { return exports.RecordCollected.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.CapitalCallSummary).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.CapitalCallSummary).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.CapitalCallSummary, ['ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be', 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be']);



exports.Contribute = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.CapitalCallNotice = damlTypes.assembleTemplate(
{
  templateId: 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be:Convene:CapitalCallNotice',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({fundManager: damlTypes.Party.decoder, investor: damlTypes.Party.decoder, auditor: damlTypes.Party.decoder, dealId: damlTypes.Text.decoder, amount: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    fundManager: damlTypes.Party.encode(__typed__.fundManager),
    investor: damlTypes.Party.encode(__typed__.investor),
    auditor: damlTypes.Party.encode(__typed__.auditor),
    dealId: damlTypes.Text.encode(__typed__.dealId),
    amount: damlTypes.Numeric(10).encode(__typed__.amount),
  };
}
,
  Archive: {
    template: function () { return exports.CapitalCallNotice; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  Contribute: {
    template: function () { return exports.CapitalCallNotice; },
    choiceName: 'Contribute',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.Contribute.decoder; }),
    argumentEncode: function (__typed__) { return exports.Contribute.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.Contribution).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.Contribution).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.CapitalCallNotice, ['ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be', 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be']);



exports.IssueCapitalCall = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({callAmounts: damlTypes.List(exports.CallAmount).decoder, }); }),
  encode: function (__typed__) {
  return {
    callAmounts: damlTypes.List(exports.CallAmount).encode(__typed__.callAmounts),
  };
}
,
};



exports.DealResult = damlTypes.assembleTemplate(
{
  templateId: 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be:Convene:DealResult',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({fundManager: damlTypes.Party.decoder, investors: damlTypes.List(damlTypes.Party).decoder, auditor: damlTypes.Party.decoder, dealId: damlTypes.Text.decoder, description: damlTypes.Text.decoder, targetCapital: damlTypes.Numeric(10).decoder, approved: damlTypes.Bool.decoder, approveCount: damlTypes.Int.decoder, rejectCount: damlTypes.Int.decoder, totalVotes: damlTypes.Int.decoder, capitalCallIssued: damlTypes.Bool.decoder, }); }),
  encode: function (__typed__) {
  return {
    fundManager: damlTypes.Party.encode(__typed__.fundManager),
    investors: damlTypes.List(damlTypes.Party).encode(__typed__.investors),
    auditor: damlTypes.Party.encode(__typed__.auditor),
    dealId: damlTypes.Text.encode(__typed__.dealId),
    description: damlTypes.Text.encode(__typed__.description),
    targetCapital: damlTypes.Numeric(10).encode(__typed__.targetCapital),
    approved: damlTypes.Bool.encode(__typed__.approved),
    approveCount: damlTypes.Int.encode(__typed__.approveCount),
    rejectCount: damlTypes.Int.encode(__typed__.rejectCount),
    totalVotes: damlTypes.Int.encode(__typed__.totalVotes),
    capitalCallIssued: damlTypes.Bool.encode(__typed__.capitalCallIssued),
  };
}
,
  IssueCapitalCall: {
    template: function () { return exports.DealResult; },
    choiceName: 'IssueCapitalCall',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.IssueCapitalCall.decoder; }),
    argumentEncode: function (__typed__) { return exports.IssueCapitalCall.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.ContractId(exports.CapitalCallSummary), damlTypes.ContractId(exports.FundLedger), damlTypes.List(damlTypes.ContractId(exports.CapitalCallNotice))).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.ContractId(exports.CapitalCallSummary), damlTypes.ContractId(exports.FundLedger), damlTypes.List(damlTypes.ContractId(exports.CapitalCallNotice))).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.DealResult; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.DealResult, ['ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be', 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be']);



exports.VoteReceipt = damlTypes.assembleTemplate(
{
  templateId: 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be:Convene:VoteReceipt',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Text, damlTypes.Party).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Text, damlTypes.Party).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({fundManager: damlTypes.Party.decoder, investor: damlTypes.Party.decoder, auditor: damlTypes.Party.decoder, dealId: damlTypes.Text.decoder, }); }),
  encode: function (__typed__) {
  return {
    fundManager: damlTypes.Party.encode(__typed__.fundManager),
    investor: damlTypes.Party.encode(__typed__.investor),
    auditor: damlTypes.Party.encode(__typed__.auditor),
    dealId: damlTypes.Text.encode(__typed__.dealId),
  };
}
,
  Archive: {
    template: function () { return exports.VoteReceipt; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.VoteReceipt, ['ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be', 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be']);



exports.ConsumeVote = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.Vote = damlTypes.assembleTemplate(
{
  templateId: 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be:Convene:Vote',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Party, damlTypes.Text).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple3(damlTypes.Party, damlTypes.Party, damlTypes.Text).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({fundManager: damlTypes.Party.decoder, investor: damlTypes.Party.decoder, auditor: damlTypes.Party.decoder, dealId: damlTypes.Text.decoder, approve: damlTypes.Bool.decoder, }); }),
  encode: function (__typed__) {
  return {
    fundManager: damlTypes.Party.encode(__typed__.fundManager),
    investor: damlTypes.Party.encode(__typed__.investor),
    auditor: damlTypes.Party.encode(__typed__.auditor),
    dealId: damlTypes.Text.encode(__typed__.dealId),
    approve: damlTypes.Bool.encode(__typed__.approve),
  };
}
,
  Archive: {
    template: function () { return exports.Vote; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  ConsumeVote: {
    template: function () { return exports.Vote; },
    choiceName: 'ConsumeVote',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.ConsumeVote.decoder; }),
    argumentEncode: function (__typed__) { return exports.ConsumeVote.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Bool.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Bool.encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.Vote, ['ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be', 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be']);



exports.TallyVotes = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({voteCids: damlTypes.List(damlTypes.ContractId(exports.Vote)).decoder, }); }),
  encode: function (__typed__) {
  return {
    voteCids: damlTypes.List(damlTypes.ContractId(exports.Vote)).encode(__typed__.voteCids),
  };
}
,
};



exports.CastVote = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({investor: damlTypes.Party.decoder, approve: damlTypes.Bool.decoder, }); }),
  encode: function (__typed__) {
  return {
    investor: damlTypes.Party.encode(__typed__.investor),
    approve: damlTypes.Bool.encode(__typed__.approve),
  };
}
,
};



exports.DealProposal = damlTypes.assembleTemplate(
{
  templateId: 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be:Convene:DealProposal',
  keyDecoder: damlTypes.lazyMemo(function () { return damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).decoder; }); }),
  keyEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.Party, damlTypes.Text).encode(__typed__); },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({fundManager: damlTypes.Party.decoder, investors: damlTypes.List(damlTypes.Party).decoder, auditor: damlTypes.Party.decoder, dealId: damlTypes.Text.decoder, description: damlTypes.Text.decoder, targetCapital: damlTypes.Numeric(10).decoder, voteDeadline: damlTypes.Time.decoder, }); }),
  encode: function (__typed__) {
  return {
    fundManager: damlTypes.Party.encode(__typed__.fundManager),
    investors: damlTypes.List(damlTypes.Party).encode(__typed__.investors),
    auditor: damlTypes.Party.encode(__typed__.auditor),
    dealId: damlTypes.Text.encode(__typed__.dealId),
    description: damlTypes.Text.encode(__typed__.description),
    targetCapital: damlTypes.Numeric(10).encode(__typed__.targetCapital),
    voteDeadline: damlTypes.Time.encode(__typed__.voteDeadline),
  };
}
,
  TallyVotes: {
    template: function () { return exports.DealProposal; },
    choiceName: 'TallyVotes',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.TallyVotes.decoder; }),
    argumentEncode: function (__typed__) { return exports.TallyVotes.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.DealResult).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.DealResult).encode(__typed__); },
  },
  Archive: {
    template: function () { return exports.DealProposal; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  CastVote: {
    template: function () { return exports.DealProposal; },
    choiceName: 'CastVote',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.CastVote.decoder; }),
    argumentEncode: function (__typed__) { return exports.CastVote.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.Vote).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.Vote).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.DealProposal, ['ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be', 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be']);



exports.RecordPlatformFee = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({dealId: damlTypes.Text.decoder, grossAmount: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    dealId: damlTypes.Text.encode(__typed__.dealId),
    grossAmount: damlTypes.Numeric(10).encode(__typed__.grossAmount),
  };
}
,
};



exports.PlatformAgreement = damlTypes.assembleTemplate(
{
  templateId: 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be:Convene:PlatformAgreement',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({platform: damlTypes.Party.decoder, fundManager: damlTypes.Party.decoder, auditor: damlTypes.Party.decoder, feeRate: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    platform: damlTypes.Party.encode(__typed__.platform),
    fundManager: damlTypes.Party.encode(__typed__.fundManager),
    auditor: damlTypes.Party.encode(__typed__.auditor),
    feeRate: damlTypes.Numeric(10).encode(__typed__.feeRate),
  };
}
,
  Archive: {
    template: function () { return exports.PlatformAgreement; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  RecordPlatformFee: {
    template: function () { return exports.PlatformAgreement; },
    choiceName: 'RecordPlatformFee',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.RecordPlatformFee.decoder; }),
    argumentEncode: function (__typed__) { return exports.RecordPlatformFee.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.PlatformFeeRecord), damlTypes.Numeric(10)).decoder; }),
    resultEncode: function (__typed__) { return pkg40f452260bef3f29dede136108fc08a88d5a5250310281067087da6f0baddff7.DA.Types.Tuple2(damlTypes.ContractId(exports.PlatformFeeRecord), damlTypes.Numeric(10)).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.PlatformAgreement, ['ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be', 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be']);



exports.AcceptPlatformService = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({}); }),
  encode: function (__typed__) {
  return {
  };
}
,
};



exports.PlatformServiceOffer = damlTypes.assembleTemplate(
{
  templateId: 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be:Convene:PlatformServiceOffer',
  keyDecoder: damlTypes.lazyMemo(function () { return jtv.constant(undefined); }),
  keyEncode: function () { throw 'EncodeError'; },
  decoder: damlTypes.lazyMemo(function () { return jtv.object({platform: damlTypes.Party.decoder, fundManager: damlTypes.Party.decoder, auditor: damlTypes.Party.decoder, feeRate: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    platform: damlTypes.Party.encode(__typed__.platform),
    fundManager: damlTypes.Party.encode(__typed__.fundManager),
    auditor: damlTypes.Party.encode(__typed__.auditor),
    feeRate: damlTypes.Numeric(10).encode(__typed__.feeRate),
  };
}
,
  Archive: {
    template: function () { return exports.PlatformServiceOffer; },
    choiceName: 'Archive',
    argumentDecoder: damlTypes.lazyMemo(function () { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.decoder; }),
    argumentEncode: function (__typed__) { return pkgd14e08374fc7197d6a0de468c968ae8ba3aadbf9315476fd39071831f5923662.DA.Internal.Template.Archive.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.Unit.decoder; }),
    resultEncode: function (__typed__) { return damlTypes.Unit.encode(__typed__); },
  },
  AcceptPlatformService: {
    template: function () { return exports.PlatformServiceOffer; },
    choiceName: 'AcceptPlatformService',
    argumentDecoder: damlTypes.lazyMemo(function () { return exports.AcceptPlatformService.decoder; }),
    argumentEncode: function (__typed__) { return exports.AcceptPlatformService.encode(__typed__); },
    resultDecoder: damlTypes.lazyMemo(function () { return damlTypes.ContractId(exports.PlatformAgreement).decoder; }),
    resultEncode: function (__typed__) { return damlTypes.ContractId(exports.PlatformAgreement).encode(__typed__); },
  },
}

);


damlTypes.registerTemplate(exports.PlatformServiceOffer, ['ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be', 'ff5ae87a4301a7b579b7d4a182ab4db696e0beeefaf0fae98de3d6fb11efe9be']);



exports.CallAmount = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({investor: damlTypes.Party.decoder, amount: damlTypes.Numeric(10).decoder, }); }),
  encode: function (__typed__) {
  return {
    investor: damlTypes.Party.encode(__typed__.investor),
    amount: damlTypes.Numeric(10).encode(__typed__.amount),
  };
}
,
};

