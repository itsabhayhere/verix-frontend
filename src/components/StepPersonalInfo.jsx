'use client';
import { useMemo } from 'react';

export default function StepPersonalInfo({ data, setData, onNext }) {
  const update = (field, value) => setData((prev) => ({ ...prev, [field]: value }));

  const canProceed = useMemo(() => {
    return data.name?.length > 2 && data.dob && data.mobile?.length === 10;
  }, [data.name, data.dob, data.mobile]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      
      {/* ── Architectural Header ── */}
      <header className="flex items-start gap-4 pb-2">
        <div className="w-1 h-12 bg-[var(--accent-primary)] rounded-full hidden md:block" />
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Account Identity
          </h2>
          <p className="text-sm text-[var(--text-secondary)] font-medium opacity-80">
            Please ensure your details match your government-issued artifacts.
          </p>
        </div>
      </header>

      {/* ── Form Canvas ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
        
        <Field label="Legal Full Name">
          <input
            type="text"
            placeholder="e.g. Abhay Kumar"
            value={data.name || ''}
            onChange={(e) => update('name', e.target.value)}
            className="w-full bg-white border border-[var(--border)] rounded-[var(--radius-md)] px-5 py-3 text-[15px] font-medium text-[var(--text-primary)] outline-none transition-all focus:border-[var(--accent-secondary)] focus:shadow-[0_0_0_4px_var(--bg-muted)] placeholder:opacity-40"
          />
        </Field>

        <Field label="Date of Birth">
          <input
            type="date"
            value={data.dob || ''}
            onChange={(e) => update('dob', e.target.value)}
            className="w-full bg-white border border-[var(--border)] rounded-[var(--radius-md)] px-5 py-3 text-[15px] text-[var(--text-primary)] outline-none transition-all focus:border-[var(--accent-secondary)] focus:shadow-[0_0_0_4px_var(--bg-muted)]"
          />
        </Field>

        <Field label="Mobile Connectivity">
          <div className="flex group focus-within:shadow-[0_0_0_4px_var(--bg-muted)] rounded-[var(--radius-md)] transition-all">
            <span className="flex items-center px-5 bg-[var(--bg-muted)] border border-[var(--border)] border-r-0 rounded-l-[var(--radius-md)] text-[11px] font-mono font-bold text-[var(--accent-primary)]">
              +91
            </span>
            <input
              type="tel"
              maxLength={10}
              placeholder="00000 00000"
              value={data.mobile || ''}
              onChange={(e) => update('mobile', e.target.value.replace(/\D/g, ''))}
              className="w-full bg-white border border-[var(--border)] rounded-r-[var(--radius-md)] px-5 py-3 text-[15px] font-mono text-[var(--text-primary)] outline-none focus:border-[var(--accent-secondary)]"
            />
          </div>
        </Field>

        <Field label="Electronic Mail">
          <input
            type="email"
            placeholder="abhay@tzex.in"
            value={data.email || ''}
            onChange={(e) => update('email', e.target.value)}
            className="w-full bg-white border border-[var(--border)] rounded-[var(--radius-md)] px-5 py-3 text-[15px] font-medium text-[var(--text-primary)] outline-none transition-all focus:border-[var(--accent-secondary)] focus:shadow-[0_0_0_4px_var(--bg-muted)]"
          />
        </Field>

        <Field label="Gender Identity">
          <div className="relative">
            <select
              value={data.gender || ''}
              onChange={(e) => update('gender', e.target.value)}
              className="w-full appearance-none bg-white border border-[var(--border)] rounded-[var(--radius-md)] px-5 py-3 text-[15px] text-[var(--text-primary)] outline-none cursor-pointer focus:border-[var(--accent-secondary)] focus:shadow-[0_0_0_4px_var(--bg-muted)]"
            >
              <option value="" disabled>Select option...</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
            <div className="absolute right-5 top-1/2 -translate-y-1/2 pointer-events-none text-[var(--accent-primary)] opacity-40">
              <svg width="12" height="12" viewBox="0 0 12 12"><path fill="currentColor" d="M6 8L1 3h10z"/></svg>
            </div>
          </div>
        </Field>

        <div className="md:col-span-2">
          <Field label="Primary Residence">
            <textarea
              rows={3}
              placeholder="Full street address, city, and postal code"
              value={data.address || ''}
              onChange={(e) => update('address', e.target.value)}
              className="w-full bg-white border border-[var(--border)] rounded-[var(--radius-md)] px-5 py-4 text-[15px] text-[var(--text-primary)] outline-none transition-all focus:border-[var(--accent-secondary)] focus:shadow-[0_0_0_4px_var(--bg-muted)] resize-none"
            />
          </Field>
        </div>
      </div>

      {/* ── Command Footer ── */}
      <footer className="pt-10 border-t border-[var(--border)] flex items-center justify-end">
        <button
          onClick={onNext}
          disabled={!canProceed}
          className={`
            px-12 py-4 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] transition-all duration-500
            ${canProceed 
              ? 'bg-[var(--accent-vibrant)] text-white shadow-[0_10px_30px_rgba(226,149,120,0.3)] hover:-translate-y-1 active:scale-95' 
              : 'bg-[var(--bg-muted)] text-[var(--text-tertiary)] opacity-40 cursor-not-allowed'}
          `}
        >
          Initialize Verification →
        </button>
      </footer>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-3">
      <label className="font-mono text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--accent-primary)] opacity-80">
        {label}
      </label>
      {children}
    </div>
  );
}