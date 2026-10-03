// Generated from Test/Common.daml
/* eslint-disable @typescript-eslint/camelcase */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-use-before-define */
import * as jtv from '@mojotech/json-type-validation';
import * as damlTypes from '@daml/types';
/* eslint-disable-next-line @typescript-eslint/no-unused-vars */
import * as damlLedger from '@daml/ledger';

import * as Convene from '../../Convene/module';

export declare type FundedDeal = {
  parties: TestParties;
  agreementCid: damlTypes.ContractId<Convene.PlatformAgreement>;
  fundLedgerCid: damlTypes.ContractId<Convene.FundLedger>;
  contributionCids: damlTypes.ContractId<Convene.Contribution>[];
};

export declare const FundedDeal:
  damlTypes.Serializable<FundedDeal> & {
  }
;


export declare type ApprovedDeal = {
  parties: TestParties;
  agreementCid: damlTypes.ContractId<Convene.PlatformAgreement>;
  resultCid: damlTypes.ContractId<Convene.DealResult>;
};

export declare const ApprovedDeal:
  damlTypes.Serializable<ApprovedDeal> & {
  }
;


export declare type TestParties = {
  fundManager: damlTypes.Party;
  investor1: damlTypes.Party;
  investor2: damlTypes.Party;
  investor3: damlTypes.Party;
  auditor: damlTypes.Party;
  platform: damlTypes.Party;
};

export declare const TestParties:
  damlTypes.Serializable<TestParties> & {
  }
;

