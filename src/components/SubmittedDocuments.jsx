'use client';
import { useMemo } from 'react';

export default function SubmittedDocuments({ kycData }) {
  const documentList = useMemo(() => [
    { name: 'Identity Proof (Front)', type: 'ID_FRONT', status: kycData?.documents?.aadhaarFront },
    { name: 'Identity Proof (Back)', type: 'ID_BACK', status: kycData?.documents?.aadhaarBack },
    { name: 'Tax Identification', type: 'PAN', status: kycData?.documents?.panCard },
    { name: 'Biometric Session', type: 'SELFIE', status: kycData?.documents?.selfie },
  ], [kycData]);

  return (
    <section className="w-full bg-white border border-[var(--border)] rounded-[var(--radius-lg)] p-7 shadow-[var(--shadow-premium)]">
      
      {/* ── Architectural Header ── */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-6 bg-[var(--accent-primary)] rounded-full" />
          <h3 className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--text-secondary)]">
            Artifact_Manifest
          </h3>
        </div>
        <div className="px-3 py-1 bg-[var(--bg-base)] rounded-full border border-[var(--border)]">
           <span className="font-mono text-[9px] font-bold text-[var(--accent-primary)] uppercase tracking-widest">Secure_Vault</span>
        </div>
      </header>

      {/* ── Document List ── */}
      <div className="space-y-3">
        {documentList.map((doc) => {
          const isUploaded = !!doc.status;
          
          return (
            <div
              key={doc.type}
              className={`
                group flex items-center justify-between p-4 rounded-[var(--radius-md)] border transition-all duration-500
                ${isUploaded 
                  ? 'bg-white border-[var(--border)] hover:border-[var(--accent-secondary)]/50 hover:bg-[var(--bg-surface-raised)]' 
                  : 'bg-[var(--bg-base)]/50 border-transparent opacity-50 grayscale'}
              `}
            >
              {/* Left: Artifact Identity */}
              <div className="flex items-center gap-5">
                <div className={`
                  w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500
                  ${isUploaded 
                    ? 'bg-[var(--bg-base)] text-[var(--accent-primary)] border border-[var(--border)] shadow-sm group-hover:bg-white' 
                    : 'bg-[var(--bg-muted)] text-[var(--text-tertiary)]'}
                `}>
                  <DocIcon type={doc.type} />
                </div>
                
                <div className="flex flex-col gap-0.5">
                  <span className={`text-[15px] font-bold tracking-tight transition-colors ${isUploaded ? 'text-[var(--text-primary)] group-hover:text-[var(--accent-primary)]' : 'text-[var(--text-tertiary)]'}`}>
                    {doc.name}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-tertiary)] opacity-80">
                      {isUploaded ? 'Verified_Hash' : 'Pending_Capture'}
                    </span>
                    {isUploaded && <div className="w-1 h-1 rounded-full bg-[var(--accent-secondary)]" />}
                  </div>
                </div>
              </div>

              {/* Right: State & Action */}
              <div className="flex items-center gap-4">
                <span className={`
                  px-4 py-1.5 rounded-full font-mono text-[9px] font-bold tracking-[0.1em] border transition-all
                  ${isUploaded 
                    ? 'bg-[var(--accent-secondary)]/10 text-[var(--accent-primary)] border-[var(--accent-secondary)]/20' 
                    : 'bg-white text-[var(--text-tertiary)] border-[var(--border)]'}
                `}>
                  {isUploaded ? 'VALID' : 'NULL'}
                </span>
                
                {isUploaded && (
                  <button className="w-8 h-8 rounded-full bg-[var(--accent-soft)]/40 text-[var(--accent-vibrant)] flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 hover:scale-110 hover:bg-[var(--accent-soft)]">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function DocIcon({ type }) {
  const props = { width: 20, height: 20, strokeWidth: 2.2, stroke: "currentColor", fill: "none" };
  switch (type) {
    case 'ID_FRONT':
    case 'ID_BACK':
      return <svg {...props} viewBox="0 0 24 24"><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 8h10M7 12h10M7 16h6"/></svg>;
    case 'PAN':
      return <svg {...props} viewBox="0 0 24 24"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>;
    default:
      return <svg {...props} viewBox="0 0 24 24"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>;
  }
}