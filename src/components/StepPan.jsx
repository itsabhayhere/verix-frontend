'use client';

import { useState, useCallback, useMemo } from 'react';

export default function StepPan({
  files,
  setFiles,
  formData,
  setFormData,
  onNext,
  onBack,
}) {
  const [panValue, setPanValue] = useState(formData?.panNumber || '');

  const handleFileChange = useCallback(
    (e) => {
      const f = e.target.files[0];
      if (f) {
        setFiles((prev) => ({ ...prev, panCard: f }));
      }
    },
    [setFiles]
  );

  const panRegex = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
  const isValidPan = useMemo(() => panRegex.test(panValue), [panValue]);
  const canProceed = !!files.panCard && isValidPan;

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700">

      {/* ── Architectural Header ── */}
      <header className="flex items-start gap-4 pb-2">
        <div className="w-1 h-12 bg-[var(--accent-primary)] rounded-full hidden md:block" />
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Tax Identity
          </h2>
          <p className="text-sm text-[var(--text-secondary)] font-medium opacity-80">
            Securely transmit your Permanent Account Number for verification.
          </p>
        </div>
      </header>

      {/* ── Document Canvas ── */}
      <label
        className={`
        relative flex flex-col items-center justify-center p-12 border border-[var(--border)] rounded-[var(--radius-lg)] cursor-pointer transition-all duration-500 group
        ${
          files.panCard
            ? 'bg-[var(--accent-soft)]/30 border-[var(--accent-secondary)]'
            : 'bg-white hover:bg-[var(--bg-surface-raised)] hover:border-[var(--accent-secondary)]/50 shadow-[var(--shadow-premium)]'
        }
      `}
      >
        <input
          id="panUpload"
          type="file"
          className="hidden"
          accept="image/*,application/pdf"
          onChange={handleFileChange}
        />

        {/* Floating Icon Logic */}
        <div
          className={`
          w-16 h-16 rounded-2xl flex items-center justify-center mb-5 transition-all duration-500 shadow-sm
          ${
            files.panCard
              ? 'bg-[var(--accent-primary)] text-white rotate-6'
              : 'bg-[var(--bg-base)] text-[var(--accent-primary)] group-hover:scale-110'
          }
        `}
        >
          {files.panCard ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/></svg>
          )}
        </div>

        <div className="text-center">
          <h4 className={`text-sm font-bold tracking-tight ${files.panCard ? 'text-[var(--accent-primary)]' : 'text-[var(--text-primary)]'}`}>
            {files.panCard ? 'Artifact Captured' : 'Upload Physical Card'}
          </h4>

          <p className="text-[10px] text-[var(--text-tertiary)] mt-1 font-mono uppercase tracking-[0.2em] font-bold">
            {files.panCard ? files.panCard.name : 'PNG, JPG or PDF'}
          </p>
        </div>
      </label>

      {/* ── Semantic Input Section ── */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-1">
          <label className="font-mono text-[10px] font-bold uppercase tracking-[0.25em] text-[var(--text-secondary)]">
            Registry Number
          </label>
          {panValue.length > 0 && (
            <span className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase tracking-widest ${isValidPan ? 'bg-[var(--accent-secondary)]/20 text-[var(--accent-primary)]' : 'bg-[var(--accent-soft)] text-[var(--accent-vibrant)]'}`}>
              {isValidPan ? 'Verified Format' : 'Pattern Mismatch'}
            </span>
          )}
        </div>

        <input
          type="text"
          placeholder="ABCDE1234F"
          maxLength={10}
          value={panValue}
          onChange={(e) => {
            const val = e.target.value.toUpperCase();
            setPanValue(val);
            setFormData((prev) => ({ ...prev, panNumber: val }));
          }}
          className={`
          w-full bg-white border rounded-[var(--radius-md)]
          p-5 text-2xl font-mono tracking-[0.4em] outline-none transition-all duration-300
          ${
            isValidPan
              ? 'border-[var(--accent-primary)] shadow-[0_0_0_4px_var(--bg-muted)]'
              : 'border-[var(--border)] focus:border-[var(--accent-secondary)] focus:ring-4 focus:ring-[var(--bg-muted)]'
          }
        `}
        />
      </section>

      {/* ── Command Footer ── */}
      <footer className="flex items-center justify-between pt-10 border-t border-[var(--border)]">
        <button
          onClick={onBack}
          className="px-6 py-2 text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)] hover:text-[var(--text-primary)] transition-colors"
        >
          ← Return
        </button>

        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`
          px-12 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500
          ${
            canProceed
              ? 'bg-[var(--accent-vibrant)] text-white shadow-[0_10px_20px_rgba(226,149,120,0.3)] hover:-translate-y-1'
              : 'bg-[var(--bg-muted)] text-[var(--text-tertiary)] opacity-40 cursor-not-allowed'
          }
        `}
        >
          Verify Artifact →
        </button>
      </footer>
    </div>
  );
}