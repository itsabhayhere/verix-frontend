'use client';
import { useMemo } from 'react';

const STEPS = [
  { label: 'Profile Entry', description: 'Core contact details' },
  { label: 'Identity Vault', description: 'Gov ID verification' },
  { label: 'Biometrics', description: 'Liveness face scan' },
  { label: 'Compliance Review', description: 'Final verification' },
];

export default function KYCProgressCard({ kycData }) {
  const { currentStep, statusLabel, theme } = useMemo(() => {
    const isApproved = kycData?.status === 'approved';
    const isRejected = kycData?.status === 'rejected';
    const isUnderReview = kycData?.status === 'under_review';

    let step = 1;
    if (isApproved || isRejected) step = 4;
    else if (isUnderReview) step = 3;
    else if (kycData) step = 2;

    const percent = (step / STEPS.length) * 100;

    const theme = isRejected
      ? { color: 'var(--accent-danger)', bg: 'var(--accent-danger-light)', border: 'rgba(220,38,38,0.1)' }
      : isApproved
      ? { color: 'var(--accent-success)', bg: 'var(--accent-success-light)', border: 'rgba(22,163,74,0.1)' }
      : { color: 'var(--accent-warning)', bg: 'var(--accent-warning-light)', border: 'rgba(217,119,6,0.1)' };

    return {
      currentStep: step,
      percent,
      statusLabel: isRejected ? 'Rejected' : isApproved ? 'Verified' : 'Active Review',
      theme
    };
  }, [kycData]);

  return (
    <div className="w-full max-w-[380px] bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-lg)] p-6 shadow-[var(--shadow-md)] overflow-hidden">
      
      {/* ── Top Header ── */}
      <header className="flex justify-between items-center mb-8">
        <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">
          Audit Trail
        </h3>
        <div 
          className="px-2.5 py-1 rounded-full text-[10px] font-bold font-mono border transition-colors duration-300"
          style={{ background: theme.bg, color: theme.color, borderColor: theme.border }}
        >
          {statusLabel}
        </div>
      </header>

      {/* ── Vertical Timeline ── */}
      <div className="space-y-0 relative">
        {STEPS.map((step, i) => {
          const isDone = i < currentStep - 1;
          const isActive = i === currentStep - 1;
          const isLast = i === STEPS.length - 1;

          return (
            <div key={step.label} className="flex gap-4 group">
              {/* Left Column: Visual Indicators */}
              <div className="flex flex-col items-center flex-shrink-0 w-8">
                <div 
                  className={`
                    w-7 h-7 rounded-xl flex items-center justify-center transition-all duration-500 z-10 border
                    ${isDone ? 'bg-[var(--accent-success)] border-[var(--accent-success)] text-white' : 
                      isActive ? 'bg-white border-[var(--accent-primary)] shadow-[0_0_0_4px_var(--accent-primary-light)]' : 
                      'bg-[var(--bg-muted)] border-[var(--border)] text-[var(--text-tertiary)]'}
                  `}
                >
                  {isDone ? (
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>
                  ) : (
                    <span className="font-mono text-[10px] font-bold">{i + 1}</span>
                  )}
                </div>
                
                {!isLast && (
                  <div className={`w-[2px] h-10 transition-colors duration-700 ${isDone ? 'bg-[var(--accent-success)] opacity-30' : 'bg-[var(--border)]'}`} />
                )}
              </div>

              {/* Right Column: Context */}
              <div className={`flex-1 pt-0.5 ${!isLast ? 'pb-6' : ''}`}>
                <h4 className={`text-[13px] font-bold leading-tight transition-colors ${isActive ? 'text-[var(--accent-primary)]' : isDone ? 'text-[var(--text-primary)]' : 'text-[var(--text-tertiary)]'}`}>
                  {step.label}
                </h4>
                <p className="text-[11px] text-[var(--text-secondary)] mt-0.5 font-medium opacity-80">
                  {isDone ? 'Validated Successfully' : isActive ? 'Action Required' : 'Awaiting Previous Step'}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Footer Progress Area ── */}
      <footer className="mt-8 pt-6 border-t border-[var(--border)]">
        <div className="flex justify-between items-end mb-3">
          <div className="space-y-1">
            <p className="font-mono text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-tighter">Current Status</p>
            <p className="text-xs font-bold text-[var(--text-primary)]">Phase {currentStep} Complete</p>
          </div>
          <span className="font-mono text-xs font-bold text-[var(--accent-primary)]">
            {((currentStep / STEPS.length) * 100).toFixed(0)}%
          </span>
        </div>

        <div className="h-1.5 w-full bg-[var(--bg-muted)] rounded-full overflow-hidden border border-[var(--border)]">
          <div 
            className="h-full transition-all duration-1000 cubic-bezier(0.16, 1, 0.3, 1)"
            style={{ 
              width: `${(currentStep / STEPS.length) * 100}%`,
              background: kycData?.status === 'rejected' ? 'var(--accent-danger)' : 
                         currentStep === 4 ? 'var(--accent-success)' : 'var(--accent-primary)'
            }}
          />
        </div>
      </footer>
    </div>
  );
}