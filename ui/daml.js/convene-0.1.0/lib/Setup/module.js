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

var pkg32900813312474adf647a3529eab30cb5778cc8cbd5012000acb1eff81211f59 = require('@daml.js/daml-script-2.10.6');


exports.ConveneParties = {
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



exports.TestUser = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({alias: damlTypes.Text.decoder, public: damlTypes.Party.decoder, participantName: damlTypes.Optional(pkg32900813312474adf647a3529eab30cb5778cc8cbd5012000acb1eff81211f59.Daml.Script.ParticipantName).decoder, }); }),
  encode: function (__typed__) {
  return {
    alias: damlTypes.Text.encode(__typed__.alias),
    public: damlTypes.Party.encode(__typed__.public),
    participantName: damlTypes.Optional(pkg32900813312474adf647a3529eab30cb5778cc8cbd5012000acb1eff81211f59.Daml.Script.ParticipantName).encode(__typed__.participantName),
  };
}
,
};



exports.Parties = {
  decoder: damlTypes.lazyMemo(function () { return jtv.object({alice: damlTypes.Party.decoder, bob: damlTypes.Party.decoder, charlie: damlTypes.Party.decoder, public: damlTypes.Party.decoder, }); }),
  encode: function (__typed__) {
  return {
    alice: damlTypes.Party.encode(__typed__.alice),
    bob: damlTypes.Party.encode(__typed__.bob),
    charlie: damlTypes.Party.encode(__typed__.charlie),
    public: damlTypes.Party.encode(__typed__.public),
  };
}
,
};

