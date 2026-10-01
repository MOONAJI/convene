import React from "react";

// Lens C (UIUX.md bagian 5). C mengikuti warna teks, lensa selalu emerald.
export const Logo = ({ className = "h-8 w-8 text-ink" }: { className?: string }) => (
  <svg viewBox="14 20 160 160" className={className} role="img" aria-label="Convene">
    <path fill="currentColor" d="M156.57 156.57 A80 80 0 1 1 156.57 43.43 L136.77 63.23 A52 52 0 1 0 136.77 136.77 Z" />
    <path className="fill-success" d="M148 67.75 A36 36 0 0 1 148 132.25 A36 36 0 0 1 148 67.75 Z" />
  </svg>
);

export const Lockup = ({ size = "md" }: { size?: "md" | "lg" }) => (
  <div className={size === "lg" ? "flex items-center gap-3" : "flex items-center gap-2.5"}>
    <Logo className={size === "lg" ? "h-9 w-9 text-ink" : "h-7 w-7 text-ink"} />
    <span
      className={`font-display font-medium tracking-[-0.025em] text-ink ${size === "lg" ? "text-[28px]" : "text-[21px]"}`}
    >
      Convene
    </span>
  </div>
);
