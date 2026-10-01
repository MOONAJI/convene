// Role Convene dan cara tiap role ditampilkan. Nama kelas Tailwind ditulis utuh
// (bukan dirangkai) supaya ikut ter-scan oleh Tailwind CLI.

export type RoleKey = "fm" | "investor" | "auditor";

export type RoleStyle = {
  text: string;
  bg: string;
  border: string;
  // Tombol utama berwarna role; teks gelap supaya kontras di atas bronze/emerald.
  button: string;
};

export const roleStyles: Record<RoleKey, RoleStyle> = {
  fm: {
    text: "text-role-fm",
    bg: "bg-role-fm",
    border: "border-role-fm",
    button: "bg-role-fm text-bg hover:bg-[#d8b35e]",
  },
  investor: {
    text: "text-role-investor",
    bg: "bg-role-investor",
    border: "border-role-investor",
    button: "bg-role-investor text-bg hover:bg-[#3bbb8e]",
  },
  auditor: {
    text: "text-role-auditor",
    bg: "bg-role-auditor",
    border: "border-role-auditor",
    button: "bg-role-auditor text-ink hover:bg-[#6a8aab]",
  },
};

export type DemoUser = {
  userId: string;
  role: RoleKey;
  label: string;
  summary: string;
};

// User ID huruf kecil, dibuat oleh `Setup:setupConvene` (init-script di daml.yaml).
export const demoUsers: DemoUser[] = [
  {
    userId: "fundmanager",
    role: "fm",
    label: "Fund manager",
    summary: "Proposes deals, tallies votes, calls capital and runs the exit. Sees every contract in the fund.",
  },
  {
    userId: "investor1",
    role: "investor",
    label: "Investor 1",
    summary: "Votes and contributes. Sees their own ballot, notices and payout, plus fund totals.",
  },
  {
    userId: "investor2",
    role: "investor",
    label: "Investor 2",
    summary: "Same rights as every LP. Cannot see what Investor 1 or 3 voted or paid.",
  },
  {
    userId: "investor3",
    role: "investor",
    label: "Investor 3",
    summary: "Same rights as every LP. Cannot see what Investor 1 or 2 voted or paid.",
  },
  {
    userId: "auditor",
    role: "auditor",
    label: "Auditor",
    summary: "Read-only. Observes every contract, including the platform fee record.",
  },
];

export const roleForUserId = (userId: string): RoleKey => {
  const found = demoUsers.find(u => u.userId === userId);
  if (found) return found.role;
  if (userId.startsWith("investor")) return "investor";
  if (userId === "auditor") return "auditor";
  return "fm";
};
