// Generated from Setup.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as pkg32900813312474adf647a3529eab30cb5778cc8cbd5012000acb1eff81211f59 from '@daml.js/daml-script-2.10.6';

export declare type ConveneParties = {
  fundManager: damlTypes.Party;
  investor1: damlTypes.Party;
  investor2: damlTypes.Party;
  investor3: damlTypes.Party;
  auditor: damlTypes.Party;
  platform: damlTypes.Party;
};

export declare const ConveneParties:
  damlTypes.Serializable<ConveneParties> & {
  }
;


export declare type TestUser = {
  alias: string;
  public: damlTypes.Party;
  participantName: damlTypes.Optional<pkg32900813312474adf647a3529eab30cb5778cc8cbd5012000acb1eff81211f59.Daml.Script.ParticipantName>;
};

export declare const TestUser:
  damlTypes.Serializable<TestUser> & {
  }
;


export declare type Parties = {
  alice: damlTypes.Party;
  bob: damlTypes.Party;
  charlie: damlTypes.Party;
  public: damlTypes.Party;
};

export declare const Parties:
  damlTypes.Serializable<Parties> & {
  }
;

