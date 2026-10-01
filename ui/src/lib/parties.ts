import { useEffect, useState } from "react";
import { useLedger, useParty } from "@daml/react";
import { partyHint } from "./format";

export type KnownParties = {
  investors: string[];
  auditor?: string;
};

const INVESTOR_HINT = /^Investor\d+$/i;

// FundManager butuh party ID investor & auditor untuk mengisi DealProposal.
// Sumber utama: daftar party yang dikenal participant. Cadangan: party di
// `Setup:setupConvene` dialokasikan dengan hint nama role pada participant yang
// sama, jadi ID-nya bisa diturunkan dari namespace party yang sedang login.
export const useKnownParties = (): KnownParties | undefined => {
  const ledger = useLedger();
  const me = useParty();
  const [known, setKnown] = useState<KnownParties>();

  useEffect(() => {
    let cancelled = false;
    const derive = (): KnownParties => {
      const namespace = me.split("::")[1];
      return namespace
        ? {
            investors: ["Investor1", "Investor2", "Investor3"].map(h => `${h}::${namespace}`),
            auditor: `Auditor::${namespace}`,
          }
        : { investors: [] };
    };

    ledger
      .listKnownParties()
      .then(parties => {
        const ids = parties.map(p => p.identifier);
        const investors = ids
          .filter(id => INVESTOR_HINT.test(partyHint(id)))
          .sort((a, b) => partyHint(a).localeCompare(partyHint(b), "en", { numeric: true }));
        const auditor = ids.find(id => partyHint(id) === "Auditor");
        if (!cancelled) setKnown(investors.length > 0 ? { investors, auditor } : derive());
      })
      .catch(() => {
        if (!cancelled) setKnown(derive());
      });
    return () => {
      cancelled = true;
    };
  }, [ledger, me]);

  return known;
};
