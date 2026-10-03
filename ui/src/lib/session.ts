import { encode } from "jwt-simple";
import Ledger from "@daml/ledger";
import { RoleKey, roleForUserId } from "./roles";
import { httpBaseUrl, wsBaseUrl } from "./config";

// Login dev (BE.md bagian 2): JWT tanpa tanda tangan yang valid, sub = Ledger API
// User ID. JSON API sandbox tidak memverifikasi signature, jadi "secret" cukup.
export type Session = {
  userId: string;
  party: string;
  token: string;
  role: RoleKey;
};

const STORAGE_KEY = "convene.session";

export const makeToken = (userId: string): string =>
  encode({ sub: userId, scope: "daml_ledger_api" }, "secret", "HS256");

export const login = async (userId: string): Promise<Session> => {
  const token = makeToken(userId);
  const ledger = new Ledger({ token, httpBaseUrl, wsBaseUrl });
  const user = await ledger.getUser();
  if (!user.primaryParty) {
    throw new Error(`User "${userId}" has no primary party on this ledger.`);
  }
  return { userId, party: user.primaryParty, token, role: roleForUserId(userId) };
};

// sessionStorage (per tab) supaya tiap tab browser bisa login sebagai role berbeda
// saat demo. Dibungkus try/catch: storage bisa diblokir.
export const saveSession = (session: Session | undefined) => {
  try {
    if (session) sessionStorage.setItem(STORAGE_KEY, JSON.stringify(session));
    else sessionStorage.removeItem(STORAGE_KEY);
  } catch (_) {
    // abaikan
  }
};

export const loadSession = (): Session | undefined => {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as Session) : undefined;
  } catch (_) {
    return undefined;
  }
};
