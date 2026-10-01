# Convene

**A private, auditable investment club on Canton.** LPs vote on deals, capital calls run, and distributions are recorded, without any LP seeing another LP's vote, contribution or payout.

Built for HackCanton Season 3 (Track 3: Investment Infrastructure).

Flow: **Propose deal → Vote → Capital call → Contribution → Exit and distribution**

## Why Canton

Individual votes and positions stay private per investor, the fund manager and the auditor see everything, and every investor still sees the aggregate result. This is enforced by the ledger, not by the UI: a contract is only delivered to its signatories and observers, so another investor's data never reaches the browser.

| Contract | Fund manager | Owning investor | Other investors | Auditor | Platform |
|---|---|---|---|---|---|
| `DealProposal`, `DealResult` | ✅ | ✅ | ✅ | ✅ | — |
| `Vote`, `VoteReceipt` | ✅ | ✅ own | ❌ | ✅ | — |
| `CapitalCallNotice`, `Contribution` | ✅ | ✅ own | ❌ | ✅ | — |
| `CapitalCallSummary`, `FundLedger` | ✅ | ✅ | ✅ | ✅ | — |
| `DistributionNotice` | ✅ | ✅ own | ❌ | ✅ | — |
| `DistributionSummary` | ✅ | ✅ | ✅ | ✅ | — |
| `PlatformFeeRecord`, `PlatformAgreement` | ✅ | ❌ | ❌ | ✅ | ✅ |

Every row is asserted by `daml/Test/Visibility.daml`.

## Architecture

```
React UI (ui/)                Daml JSON API            Canton sandbox
@daml/react + @daml/ledger ─► HTTP + WebSocket   ─►    Daml model (daml/Convene.daml)
localhost:3000                localhost:7575           localhost:6865
```

- **No custom backend.** The UI talks to the ledger's built-in JSON API. All business rules and visibility rules live in the Daml templates.
- **Parties:** 1 `FundManager`, 3 `Investor`, 1 `Auditor` (read-only), 1 `Platform` (fee counterparty).
- **Stack:** Daml SDK 2.10.6, React 17, TypeScript, Tailwind CSS.
- **Settlement is simulated.** Contributions and payouts are amounts on Daml contracts. Real wallet and token integration is out of scope for the MVP.

```
convene/
├── daml/
│   ├── Convene.daml      core model: all templates and choices
│   ├── Setup.daml        init script: parties, users, platform agreement
│   └── Test/             HappyPath, Visibility, Guards, Common (fixtures)
└── ui/src/
    ├── lib/              session (JWT), useFund (live contract streams), formatting
    └── components/       LoginScreen, Workspace, LedgerView, stages/ (one per flow step)
```

## Run locally

**Prerequisites:** [Daml SDK 2.10.6](https://docs.daml.com/getting-started/installation.html), Java 11 or newer, Node.js 18 or newer.

**Terminal 1: ledger and JSON API.** Keep it running.

```bash
daml start
```

This builds the DAR, generates the TypeScript bindings into `ui/daml.js`, starts the sandbox (6865) and the JSON API (7575), and runs `Setup:setupConvene` to create the parties, users and the 1% platform agreement.

**Terminal 2: UI.**

```bash
cd ui
npm install --legacy-peer-deps
npm start
```

Open http://localhost:3000 and pick a role. There is no password on the local ledger.

| User ID | Role |
|---|---|
| `fundmanager` | Proposes deals, tallies votes, calls capital, triggers the exit |
| `investor1`, `investor2`, `investor3` | Vote and contribute |
| `auditor` | Read-only, sees every contract |

The session is stored per browser tab, so open one tab per role to compare what each one sees. The sandbox is in-memory: restarting `daml start` gives an empty ledger.

**Check the JSON API directly:**

```bash
curl http://localhost:7575/readyz
```

## Tests

```bash
daml test                    # 27 scripts: happy path, visibility, business-rule guards
cd ui && CI=true npm test    # UI unit tests
```

`daml test` prints JVM warnings containing `sun.misc.Unsafe`. They are not failures; read the summary lines ending in `: ok`.

To run a scenario against the live sandbox:

```bash
daml script --dar .daml/dist/convene-0.1.0.dar \
  --script-name Test.HappyPath:happyPath \
  --ledger-host localhost --ledger-port 6865
```

## Templates and choices

All in `daml/Convene.daml`. Internal choices are exercised by other choices, never by the UI.

| Template | Signatory | Observers | Choices (controller) |
|---|---|---|---|
| `PlatformServiceOffer` | Platform | Fund manager, auditor | `AcceptPlatformService` (fund manager) → `PlatformAgreement` |
| `PlatformAgreement` | Platform, fund manager | Auditor | `RecordPlatformFee` (fund manager, internal) → `PlatformFeeRecord` |
| `DealProposal` | Fund manager | All investors, auditor | `CastVote` (investor) → `Vote` + `VoteReceipt`<br>`TallyVotes` (fund manager) → `DealResult` |
| `Vote` | Investor | Fund manager, auditor | `ConsumeVote` (fund manager, internal) |
| `VoteReceipt` | Fund manager | Owning investor, auditor | none |
| `DealResult` | Fund manager | All investors, auditor | `IssueCapitalCall` (fund manager) → `CapitalCallNotice` per investor + `CapitalCallSummary` + `FundLedger` |
| `CapitalCallNotice` | Fund manager | Owning investor, auditor | `Contribute` (investor) → `Contribution` |
| `CapitalCallSummary` | Fund manager | All investors, auditor | `RecordCollected` (fund manager, internal) |
| `Contribution` | Investor | Fund manager, auditor | none |
| `FundLedger` | Fund manager | All investors, auditor | `RecordContribution` (fund manager, internal)<br>`TriggerExit` (fund manager) → `PlatformFeeRecord` + `DistributionNotice` per investor + `DistributionSummary` |
| `PlatformFeeRecord` | Fund manager, Platform | Auditor | none |
| `DistributionNotice` | Fund manager | Owning investor, auditor | none |
| `DistributionSummary` | Fund manager | All investors, auditor | none |

## Rules enforced by the ledger

- **One vote per investor per deal**, only by listed investors, only before the deadline. Votes cannot be changed.
- **Approval is a simple majority** of votes cast, one LP one vote. A tie is rejected.
- **Tally** is allowed once the deadline has passed or every investor has voted, and it must include every vote cast. The fund manager cannot leave votes out.
- **Capital call** only on an approved deal, once per deal, and the total cannot exceed the deal's target capital.
- **Contribution** only by the investor named on the notice, once.
- **Exit:** the platform fee (1%) is taken from the full exit amount first. The rest is distributed in proportion to each investor's contribution. One exit per deal.

`TallyVotes`, `IssueCapitalCall` and `TriggerExit` are `nonconsuming` and archive their contract explicitly. A consuming choice would disclose the private sub-transactions (other investors' votes, notices and the fee record) to every observer of the parent contract.

## More documentation

Internal design notes, in Indonesian: `ARCHITECTURE.md`, `SC.md` (contract spec), `BUSINESSRULES.md`, `BE.md` (JSON API), `ui/FE.md`, `ui/UIUX.md`.
