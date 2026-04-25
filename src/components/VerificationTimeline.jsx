'use client';
import { useMemo } from 'react';

const DEFAULT_STEPS = [
  { event: 'Application Submitted', detail: 'Initial entry received' },
  { event: 'Documents Uploaded', detail: 'ID and Tax artifacts captured' },
  { event: 'OTP Verified', detail: 'Secure connectivity established' },
  { event: 'Manual Review', detail: 'Compliance officer inspection' },
  { event: 'Final Decision', detail: 'Account status determination' },
];

export default function VerificationTimeline({ timeline = [], status }) {
  const events = useMemo(() => {
    const raw =
    timeline.length && status === "rejected"
      ? timeline
      : DEFAULT_STEPS;    
  
    return raw.map((item, idx) => {
      let stepStatus = 'pending';
  
      if (status === 'approved') {
        stepStatus = 'completed';
      }
  
      else if (status === 'rejected') {
        stepStatus = idx < raw.length - 1 ? 'completed' : 'active';
      }
  
      else if (status === 'under_review') {
        if (idx === 0) stepStatus = 'completed';
        else if (idx === 1) stepStatus = 'active';
      }
  
      else if (status === 'pending') {
        if (idx === 0) stepStatus = 'active';
      }
  
      return { ...item, stepStatus };
    });
  
  }, [timeline, status]);

  return (
    <section className="bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-8 shadow-[var(--shadow-premium)]">
      
      {/* ── Architectural Header ── */}
      <header className="flex justify-between items-center mb-10">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[var(--accent-primary)] rounded-full" />
          <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--text-secondary)]">
            Audit_Chronology
          </h3>
        </div>
        <div className="px-3 py-1 bg-[var(--bg-base)] rounded-full border border-[var(--border)]">
          <span className="font-mono text-[9px] font-bold text-[var(--accent-primary)] uppercase tracking-widest">Live_Log</span>
        </div>
      </header>

      {/* ── Timeline Track ── */}
      <div className="space-y-0">
        {events.map((item, idx) => {
          const isLast = idx === events.length - 1;
          const isCompleted = item.stepStatus === 'completed';
          const isActive = item.stepStatus === 'active';

          return (
            <div key={idx} className="flex gap-6 group">
              
              {/* Left Column: Organic Visual Track */}
              <div className="flex flex-col items-center flex-shrink-0 w-5">
                <div className={`
                  relative z-10 w-4 h-4 rounded-full border-[3px] transition-all duration-700 mt-1
                  ${isCompleted 
                    ? 'bg-[var(--accent-primary)] border-[var(--accent-primary)] shadow-[0_0_0_4px_var(--bg-base)]' 
                    : isActive 
                    ? 'bg-white border-[var(--accent-vibrant)] shadow-[0_0_0_6px_var(--accent-soft)]' 
                    : 'bg-white border-[var(--border-strong)]'}
                `}>
                  {/* Subtle steady glow for active step instead of ping */}
                  {isActive && <div className="absolute inset-0 rounded-full bg-[var(--accent-vibrant)] opacity-10 scale-[2.5]" />}
                </div>

                {!isLast && (
                  <div className={`
                    w-[2px] h-12 -mt-1 transition-all duration-1000
                    ${isCompleted ? 'bg-[var(--accent-primary)] opacity-20' : 'bg-[var(--border)]'}
                  `} />
                )}
              </div>

              {/* Right Column: Narrative Content */}
              <div className={`flex-1 ${!isLast ? 'pb-10' : 'pb-0'}`}>
                <div className="flex justify-between items-start">
                  <div className="space-y-1.5">
                    <h4 className={`text-[15px] font-bold tracking-tight transition-colors duration-500 
                      ${isCompleted ? 'text-[var(--text-primary)]' : isActive ? 'text-[var(--accent-vibrant)]' : 'text-[var(--text-tertiary)]'}`}>
                      {item.event}
                    </h4>
                    <p className={`text-[12px] leading-relaxed font-medium transition-opacity duration-500
                      ${isCompleted ? 'text-[var(--text-secondary)]' : 'text-[var(--text-tertiary)] opacity-70'}`}>
                      {item.detail || 'Awaiting registry signal...'}
                    </p>
                  </div>

                  {item.timestamp && (
                    <time className="font-mono text-[9px] font-bold text-[var(--accent-primary)] opacity-40 uppercase tracking-widest mt-1">
                      {new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </time>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}