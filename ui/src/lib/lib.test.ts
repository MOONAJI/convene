import { centsOf, money, partyName, percent, timeLeft, toNumeric } from "./format";
import { errorMessage } from "./errors";
import { nextDealId } from "../components/stages/ProposalStage";

describe("format", () => {
  it("turns Canton party ids into display names", () => {
    expect(partyName("Investor2::1220abcdef")).toBe("Investor 2");
    expect(partyName("FundManager::1220abcdef")).toBe("Fund manager");
    expect(partyName("Auditor::1220abcdef")).toBe("Auditor");
  });

  it("rounds amounts to cents so they fit Daml Numeric", () => {
    expect(toNumeric(166666.666)).toBe("166666.67");
    expect(toNumeric(0.1 + 0.2)).toBe("0.30");
    expect(centsOf("150000")).toBe(150000);
    expect(centsOf("not a number")).toBe(0);
    expect(centsOf("")).toBe(0);
  });

  it("formats money and fee rates", () => {
    expect(money("732600.0000000000")).toBe("$732,600.00");
    expect(percent("0.0100000000")).toBe("1%");
    expect(percent(0.4)).toBe("40%");
  });

  it("counts down to the vote deadline", () => {
    const now = Date.parse("2026-09-26T10:00:00Z");
    expect(timeLeft("2026-09-26T10:09:08Z", now)).toBe("9m 8s left");
    expect(timeLeft("2026-09-26T09:59:00Z", now)).toBe("closed");
  });
});

describe("errorMessage", () => {
  it("extracts the assertMsg text from a JSON API rejection", () => {
    // Teks asli dari JSON API saat IssueCapitalCall dijalankan dua kali.
    const rejection = {
      errors: [
        'FAILED_PRECONDITION: UNHANDLED_EXCEPTION(9,f7d3c76b): Interpretation error: Error: Unhandled Daml exception: DA.Exception.AssertionFailed:AssertionFailed@3f4deaf1{ message = "Capital call has already been issued for this deal" }\n    in choice 7fba073c:Convene:DealResult:IssueCapitalCall',
      ],
      status: 400,
    };
    expect(errorMessage(rejection)).toBe("Capital call has already been issued for this deal.");
  });

  it("explains an unreachable ledger", () => {
    expect(errorMessage(new TypeError("Failed to fetch"))).toMatch(/daml start/);
    // Teks asli di browser saat JSON API mati dan request lewat proxy dev server.
    expect(errorMessage(new SyntaxError("Unexpected token 'E', \"Error occu\"... is not valid JSON"))).toMatch(/daml start/);
  });
});

describe("nextDealId", () => {
  it("suggests an ID above the highest existing one", () => {
    expect(nextDealId([])).toBe("DEAL-001");
    expect(nextDealId(["DEAL-001", "DEAL-003"])).toBe("DEAL-004");
    expect(nextDealId(["custom", "DEAL-009"])).toBe("DEAL-010");
  });
});
