'use client';
import Link from 'next/link';

const ACTIONS = [
  {
    title: 'Identity Verification',
    subtitle: 'Upload government artifacts',
    href: '/kyc/upload',
    highlight: true,
    type: 'id'
  },
  {
    title: 'Registry Status',
    subtitle: 'Audit your application logs',
    href: '/kyc/status',
    highlight: false,
    type: 'status'
  },
  {
    title: 'Biometric Session',
    subtitle: 'Initialize liveness scan',
    href: '/kyc/upload',
    highlight: false,
    type: 'biometric'
  },
];

export default function QuickActions() {
  return (
    <section className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-7 shadow-[var(--shadow-premium)]">
      {/* ── Section Logic ── */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[var(--accent-primary)] rounded-full" />
          <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--text-secondary)]">
            Command_Center
          </h3>
        </div>
        <div className="w-2 h-2 rounded-full bg-[var(--accent-soft)]" />
      </header>

      <div className="space-y-3">
        {ACTIONS.map((action) => (
          <Link
            key={action.title}
            href={action.href}
            className={`
              group flex items-center gap-5 p-5 rounded-[var(--radius-md)] border transition-all duration-500
              ${action.highlight 
                ? 'bg-[var(--bg-surface-raised)] border-[var(--accent-secondary)]/30' 
                : 'bg-white border-[var(--border)] hover:border-[var(--accent-secondary)]/50 hover:bg-[var(--bg-surface-raised)]'}
            `}
          >
            {/* ── Architectural Icon Container ── */}
            <div className={`
              w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
              ${action.highlight 
                ? 'bg-[var(--accent-primary)] text-white shadow-[0_10px_20px_rgba(0,109,119,0.2)]' 
                : 'bg-[var(--bg-base)] text-[var(--accent-primary)] border border-[var(--border)] group-hover:bg-white'}
            `}>
              <ActionIcon type={action.type} />
            </div>

            {/* ── Metadata ── */}
            <div className="flex-1 min-w-0">
              <h4 className="text-[15px] font-bold tracking-tight text-[var(--text-primary)] transition-colors group-hover:text-[var(--accent-primary)]">
                {action.title}
              </h4>
              <p className="text-[11px] font-medium text-[var(--text-tertiary)] opacity-80 uppercase tracking-tighter">
                {action.subtitle}
              </p>
            </div>

            {/* ── Whimsical Action Indicator ── */}
            <div className={`
              transition-all duration-500 flex items-center justify-center w-8 h-8 rounded-full
              ${action.highlight 
                ? 'bg-[var(--accent-vibrant)] text-white group-hover:rotate-45' 
                : 'bg-[var(--accent-soft)]/40 text-[var(--accent-vibrant)] opacity-0 group-hover:opacity-100 group-hover:scale-110'}
            `}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M7 17l10-10M7 7h10v10"/>
              </svg>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}

function ActionIcon({ type }) {
  const props = { width: 20, height: 20, strokeWidth: 2.2, stroke: "currentColor", fill: "none" };
  
  switch (type) {
    case 'id':
      return <svg {...props} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 8h10M7 12h10M7 16h6" /></svg>;
    case 'status':
      return <svg {...props} viewBox="0 0 24 24"><path d="M12 20V10M18 20V4M6 20v-4" /></svg>;
    default:
      return <svg {...props} viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" /><circle cx="12" cy="7" r="4" /></svg>;
  }
}