/** Ilustrasi empty state: papan klip dengan kaca pembesar. */
export function EmptyIllustration({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 200 160" fill="none" className={className} aria-hidden>
      <ellipse cx="100" cy="146" rx="70" ry="8" fill="var(--muted)" />
      <rect x="52" y="22" width="84" height="110" rx="14" fill="var(--card)" stroke="var(--border)" strokeWidth="2" />
      <rect x="76" y="14" width="36" height="16" rx="6" fill="var(--secondary)" stroke="var(--border)" strokeWidth="2" />
      <rect x="66" y="48" width="44" height="6" rx="3" fill="var(--muted)" />
      <rect x="66" y="62" width="56" height="6" rx="3" fill="var(--muted)" />
      <rect x="66" y="76" width="36" height="6" rx="3" fill="var(--muted)" />
      <rect x="66" y="90" width="50" height="6" rx="3" fill="var(--muted)" />
      <circle cx="132" cy="96" r="22" fill="var(--card)" stroke="var(--primary)" strokeWidth="5" />
      <path d="m148 112 16 16" stroke="var(--primary)" strokeWidth="7" strokeLinecap="round" />
      <path d="m124 96 6 6 10-12" stroke="var(--success)" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="40" cy="40" r="4" fill="var(--warning)" />
      <circle cx="165" cy="36" r="3" fill="var(--success)" />
      <circle cx="30" cy="104" r="3" fill="var(--primary)" opacity=".5" />
    </svg>
  );
}
