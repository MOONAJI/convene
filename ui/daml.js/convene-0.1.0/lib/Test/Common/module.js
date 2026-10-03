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

var Convene = require('../../Convene/module');


exports.FundedDeal = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({parties: exports.TestParties.decoder, agreementCid: damlTypes.ContractId(Convene.PlatformAgreement).decoder, fundLedgerCid: damlTypes.ContractId(Convene.FundLedger).decoder, contributionCids: damlTypes.List(damlTypes.ContractId(Convene.Contribution)).decoder, }); }),
  encode: function (__typed__) {
  return {
    parties: exports.TestParties.encode(__typed__.parties),
    agreementCid: damlTypes.ContractId(Convene.PlatformAgreement).encode(__typed__.agreementCid),
    fundLedgerCid: damlTypes.ContractId(Convene.FundLedger).encode(__typed__.fundLedgerCid),
    contributionCids: damlTypes.List(damlTypes.ContractId(Convene.Contribution)).encode(__typed__.contributionCids),
  };
}
,
};



exports.ApprovedDeal = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({parties: exports.TestParties.decoder, agreementCid: damlTypes.ContractId(Convene.PlatformAgreement).decoder, resultCid: damlTypes.ContractId(Convene.DealResult).decoder, }); }),
  encode: function (__typed__) {
  return {
    parties: exports.TestParties.encode(__typed__.parties),
    agreementCid: damlTypes.ContractId(Convene.PlatformAgreement).encode(__typed__.agreementCid),
    resultCid: damlTypes.ContractId(Convene.DealResult).encode(__typed__.resultCid),
  };
}
,
};



exports.TestParties = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({fundManager: damlTypes.Party.decoder, investor1: damlTypes.Party.decoder, investor2: damlTypes.Party.decoder, investor3: damlTypes.Party.decoder, auditor: damlTypes.Party.decoder, platform: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    fundManager: damlTypes.Party.encode(__typed__.fundManager),
    investor1: damlTypes.Party.encode(__typed__.investor1),
    investor2: damlTypes.Party.encode(__typed__.investor2),
    investor3: damlTypes.Party.encode(__typed__.investor3),
    auditor: damlTypes.Party.encode(__typed__.auditor),
    platform: damlTypes.Party.encode(__typed__.platform),
  };
}
,
};

