import React, { useEffect, useState } from "react";
import DamlLedger from "@daml/react";
import LoginScreen from "./LoginScreen";
import Workspace from "./Workspace";
import { Session, loadSession, login, saveSession } from "../lib/session";
import { httpBaseUrl, wsBaseUrl } from "../lib/config";

const App: React.FC = () => {
  const [session, setSession] = useState<Session>();
  // Session tersimpan divalidasi ulang ke ledger: sandbox in-memory bisa
  // mengalokasikan party baru setiap `daml start` di-restart.
  const [checking, setChecking] = useState(() => !!loadSession());

  useEffect(() => {
    const saved = loadSession();
    if (!saved) return;
    let cancelled = false;
    login(saved.userId)
      .then(fresh => {
        if (cancelled) return;
        saveSession(fresh);
        setSession(fresh);
      })
      .catch(() => saveSession(undefined))
      .finally(() => {
        if (!cancelled) setChecking(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const signIn = (s: Session) => {
    saveSession(s);
    setSession(s);
  };
  const signOut = () => {
    saveSession(undefined);
    setSession(undefined);
  };

  if (checking) return <div className="min-h-screen" aria-busy="true" />;
  if (!session) return <LoginScreen onLogin={signIn} />;

  return (
    <DamlLedger
      token={session.token}
      party={session.party}
      user={{ userId: session.userId, primaryParty: session.party }}
      httpBaseUrl={httpBaseUrl}
      wsBaseUrl={wsBaseUrl}
    >
      <Workspace session={session} onSignOut={signOut} />
    </DamlLedger>
  );
};

export default App;
