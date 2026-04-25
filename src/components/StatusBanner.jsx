'use client';

export default function StatusBanner({
  kycData,
  loading = false,
  onResume
}) {
  const status = kycData?.status || 'pending';

  const CONFIG = {
    under_review: {
      theme: "warning",
      title: "Review in Progress",
      body: "Your identity documents are currently being processed by our compliance engine.",
      eta: "Typical turn-around: 2–4 hours",
    },
  
    approved: {
      theme: "success",
      title: "Identity Verified",
      body: "Verification complete. Your account limits have been successfully upgraded.",
    },
  
    rejected: {
      theme: "danger",
      title: "Verification Declined",
      body: "We could not validate your documents. Please check your email for specific details.",
    },
  
    pending: {
      theme: "neutral",
      title: "Awaiting Submission",
      body: "Start your eKYC process to unlock full platform capabilities.",
    },
  };

  const active = CONFIG[status] || CONFIG.pending;

  const THEME_STYLES = {
    warning:
      'bg-[var(--accent-warning-light)] border-amber-200 shadow-amber-50',
    success:
      'bg-[var(--accent-success-light)] border-emerald-200 shadow-emerald-50',
    danger:
      'bg-[var(--accent-danger-light)] border-red-200 shadow-red-50',
    neutral:
      'bg-[var(--bg-surface-raised)] border-[var(--border)] shadow-sm',
  };

  if (loading) {
    return (
      <div className="animate-pulse rounded-[var(--radius-lg)] h-[110px] bg-[var(--bg-muted)] border border-[var(--border)]" />
    );
  }

  return (
    <section
      role="status"
      aria-live="polite"
      className={`
        relative overflow-hidden flex items-start gap-5 p-5
        rounded-[var(--radius-lg)] border transition-all duration-500
        ${THEME_STYLES[active.theme]}
      `}
    >
      {/* STATUS ICON */}
      <div
        className="
        w-12 h-12 rounded-2xl flex items-center justify-center
        flex-shrink-0 border shadow-sm transition-transform
        duration-500 hover:rotate-3 bg-white
      "
      >
        <StatusIcon type={status} />
      </div>

      {/* TEXT CONTENT */}
      <div className="flex-1 space-y-1 py-0.5">
        <div className="flex items-center gap-3">

          <h2 className="text-[15px] font-bold tracking-tight text-[var(--text-primary)]">
            {active.title}
          </h2>

          {active.showPulse && (
            <span className="px-2 py-0.5 rounded-md bg-amber-500 text-white text-[9px] font-bold uppercase tracking-widest animate-pulse">
              Live
            </span>
          )}

        </div>

        <p className="text-[13px] leading-relaxed text-[var(--text-secondary)] opacity-90 max-w-2xl">
          {active.body}
        </p>

        {/* ETA */}
        {active.eta && (
          <div className="flex items-center gap-2 pt-2">
            <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-warning)] animate-ping" />

            <span className="font-mono text-[10px] font-bold text-[var(--accent-warning)] uppercase tracking-tighter">
              {active.eta}
            </span>
          </div>
        )}

        {/* ACTION BUTTON */}
        {active.action && onResume && (
          <button
            onClick={onResume}
            className="
              mt-3 text-xs font-semibold px-4 py-2 rounded-md
              border border-[var(--border-strong)]
              hover:bg-[var(--bg-muted)]
              transition
            "
          >
            {active.action}
          </button>
        )}

        {/* TIMESTAMP */}
        {kycData?.updatedAt && (
          <div className="text-[10px] font-mono text-[var(--text-tertiary)] pt-1">
            Last update: {new Date(kycData.updatedAt).toLocaleString()}
          </div>
        )}

      </div>

      {/* BACKGROUND DECORATION */}
      <div className="absolute -right-4 -bottom-4 opacity-5 pointer-events-none select-none transform rotate-12 scale-150">
        <StatusIcon type={status} />
      </div>

    </section>
  );
}


/* ICON SYSTEM */

function StatusIcon({ type }) {
  const props = {
    width: 20,
    height: 20,
    strokeWidth: 2.5,
    stroke: 'currentColor',
    fill: 'none',
    strokeLinecap: 'round',
    strokeLinejoin: 'round'
  };

  switch (type) {
    case 'under_review':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
      );

    case 'approved':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
          <polyline points="22 4 12 14.01 9 11.01" />
        </svg>
      );

    case 'rejected':
      return (
        <svg {...props} viewBox="0 0 24 24">
          <circle cx="12" cy="12" r="10" />
          <line x1="15" y1="9" x2="9" y2="15" />
          <line x1="9" y1="9" x2="15" y2="15" />
        </svg>
      );

    default:
      return (
        <svg {...props} viewBox="0 0 24 24">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="16" y1="13" x2="8" y2="13" />
          <line x1="16" y1="17" x2="8" y2="17" />
        </svg>
      );
  }
}