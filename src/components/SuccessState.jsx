'use client';
import Link from 'next/link';

export default function SuccessState({ referenceNumber = 'VRX-992-001' }) {
  return (
    <div className="max-w-[520px] mx-auto flex flex-col items-center py-20 px-8 text-center animate-in fade-in slide-in-from-bottom-6 duration-1000">
      
      {/* ── Architectural Success Anchor ── */}
      <div className="relative mb-12">
        {/* Soft Organic Glow */}
        <div className="absolute inset-0 rounded-full bg-[var(--accent-secondary)] opacity-20 blur-3xl scale-150 animate-pulse" />
        
        <div className="relative w-24 h-24 rounded-full bg-white border border-[var(--border)] flex items-center justify-center text-[var(--accent-primary)] shadow-[var(--shadow-premium)]">
          <div className="w-16 h-16 rounded-full bg-[var(--bg-base)] flex items-center justify-center border border-[var(--border)]">
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="20 6 9 17 4 12" />
            </svg>
          </div>
        </div>
      </div>

      {/* ── Semantic Messaging ── */}
      <div className="space-y-4 mb-12">
        <div className="flex items-center justify-center gap-3 mb-2">
           <div className="w-8 h-[1px] bg-[var(--accent-secondary)]" />
           <span className="font-mono text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-[0.3em]">Lifecycle_Acknowledged</span>
           <div className="w-8 h-[1px] bg-[var(--accent-secondary)]" />
        </div>
        <h2 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
          Submission Secured
        </h2>
        <p className="text-[15px] leading-relaxed text-[var(--text-secondary)] font-medium max-w-sm mx-auto">
          Your identity artifacts have been hashed and transmitted to our <span className="text-[var(--accent-primary)]">Compliance Node</span>. Verification typically resolves in under 4 hours.
        </p>
      </div>

      {/* ── The "Boutique" Receipt ── */}
      <div className="w-full bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-8 mb-10 shadow-[var(--shadow-premium)] relative group">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-1 bg-[var(--accent-vibrant)] rounded-b-full opacity-60" />
        
        <p className="font-mono text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.25em] mb-4">
          Registry Reference ID
        </p>
        
        <div className="flex items-center justify-center gap-4">
          <span className="font-mono text-2xl font-bold text-[var(--accent-primary)] tracking-[0.3em] uppercase">
            {referenceNumber}
          </span>
          <button 
            onClick={() => navigator.clipboard.writeText(referenceNumber)}
            className="w-10 h-10 flex items-center justify-center rounded-full bg-[var(--bg-base)] text-[var(--accent-primary)] hover:bg-[var(--accent-soft)]/40 transition-all duration-300 group-active:scale-90"
            title="Copy to Registry"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
          </button>
        </div>
      </div>

      {/* ── Command Navigation ── */}
      <footer className="flex flex-col w-full gap-5">
        <Link
          href="/kyc/status"
          className="w-full py-5 bg-[var(--accent-vibrant)] text-white text-[11px] font-bold uppercase tracking-[0.2em] rounded-full shadow-[0_15px_30px_rgba(226,149,120,0.3)] hover:-translate-y-1 active:scale-95 transition-all duration-500"
        >
          Monitor Live Audit
        </Link>
        
        <Link
          href="/dashboard"
          className="group text-[10px] font-bold text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-all flex items-center justify-center gap-3 uppercase tracking-widest"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="transition-transform group-hover:-translate-x-1"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          Return to Dashboard
        </Link>
      </footer>

      {/* ── Trust Signal ── */}
      <div className="mt-16 flex items-center gap-3 px-5 py-2 bg-[var(--bg-surface-raised)] border border-[var(--border)] rounded-full">
        <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-secondary)] animate-pulse" />
        <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[var(--accent-primary)]">
          Node_Delhi_Alpha // 256_Bit_TLS_Active
        </span>
      </div>
    </div>
  );
}