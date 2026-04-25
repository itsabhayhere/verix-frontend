'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// ─────────────────────────────────────────────
// SVG ICON SYSTEM
// ─────────────────────────────────────────────
const ShieldIcon = ({ size = 20, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
    <polyline points="9 12 11 14 15 10" />
  </svg>
);

const MailIcon = ({ size = 16, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <polyline points="2 4 12 13 22 4" />
  </svg>
);

const LockIcon = ({ size = 16, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="5" y="11" width="14" height="10" rx="2" />
    <path d="M8 11V7a4 4 0 0 1 8 0v4" />
    <circle cx="12" cy="16" r="1.2" fill={stroke} stroke="none" />
  </svg>
);

const EyeIcon = ({ size = 16, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <ellipse cx="12" cy="12" rx="9" ry="5.5" />
    <circle cx="12" cy="12" r="2.2" />
  </svg>
);

const EyeOffIcon = ({ size = 16, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
    <line x1="1" y1="1" x2="23" y2="23" />
  </svg>
);

const AlertIcon = ({ size = 14, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="12" y1="8" x2="12" y2="12" />
    <circle cx="12" cy="16" r="0.8" fill={stroke} stroke="none" />
  </svg>
);

const CheckIcon = ({ size = 13, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const ArrowRightIcon = ({ size = 14, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);

const NetworkIcon = ({ size = 16, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="5" r="2" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="19" r="2" />
    <path d="M12 7v4l-5 6" /><path d="M12 11l5 8" />
  </svg>
);

const GlobeIcon = ({ size = 14, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="9" />
    <path d="M2 12h20" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

// ─────────────────────────────────────────────
// DECORATIVE SVG — Left Panel Background
// ─────────────────────────────────────────────
const NodeMesh = () => (
  <svg viewBox="0 0 440 560" fill="none" xmlns="http://www.w3.org/2000/svg"
    style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.55 }}>
    <defs>
      <radialGradient id="meshGrad" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor="#006D77" stopOpacity="0.08" />
        <stop offset="100%" stopColor="#006D77" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="440" height="560" fill="url(#meshGrad)" />
    <pattern id="lgrid" x="0" y="0" width="44" height="44" patternUnits="userSpaceOnUse">
      <path d="M 44 0 L 0 0 0 44" fill="none" stroke="#006D77" strokeWidth="0.5" strokeOpacity="0.12" />
    </pattern>
    <rect width="440" height="560" fill="url(#lgrid)" />
    <circle cx="220" cy="260" r="120" stroke="#83C5BE" strokeWidth="0.8" strokeOpacity="0.2" fill="none" />
    <circle cx="220" cy="260" r="70"  stroke="#006D77" strokeWidth="0.6" strokeOpacity="0.15" fill="none" strokeDasharray="3 8" />
    <circle cx="220" cy="260" r="30"  fill="rgba(0,109,119,0.07)" stroke="#83C5BE" strokeWidth="1" strokeOpacity="0.3" />
    <circle cx="220" cy="260" r="12"  fill="rgba(0,109,119,0.12)" />
    <path d="M220 251l-7 4v4c0 4.1 2.9 7.9 7 8.8 4.1-.9 7-4.7 7-8.8v-4l-7-4z" fill="none" stroke="#006D77" strokeWidth="1.2" strokeOpacity="0.6" strokeLinecap="round" strokeLinejoin="round" />
    <polyline points="217 260 219 262 223 258" stroke="#83C5BE" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    {[
      [220, 160], [310, 210], [310, 310], [220, 360], [130, 310], [130, 210],
    ].map(([cx, cy], i) => (
      <g key={i}>
        <line x1="220" y1="260" x2={cx} y2={cy} stroke="#83C5BE" strokeWidth="0.6" strokeOpacity="0.25" strokeDasharray="3 6" />
        <circle cx={cx} cy={cy} r="10" fill="rgba(131,197,190,0.1)" stroke="#83C5BE" strokeWidth="0.8" strokeOpacity="0.4" />
        <circle cx={cx} cy={cy} r="3.5" fill="#006D77" fillOpacity="0.5" />
      </g>
    ))}
    {[
      [220, 90], [360, 168], [360, 352], [220, 430], [80, 352], [80, 168],
    ].map(([cx, cy], i) => (
      <g key={i}>
        <circle cx={cx} cy={cy} r="6" fill="rgba(0,109,119,0.05)" stroke="#83C5BE" strokeWidth="0.6" strokeOpacity="0.25" />
        <circle cx={cx} cy={cy} r="2" fill="#83C5BE" fillOpacity="0.4" />
      </g>
    ))}
  </svg>
);

const TrustBadge = ({ label }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <div style={{ width: 16, height: 16, borderRadius: '50%', background: 'rgba(0,109,119,0.08)', border: '1px solid rgba(0,109,119,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <CheckIcon size={9} stroke="var(--accent-primary)" />
    </div>
    <span style={{ fontSize: 10, fontWeight: 600, color: 'var(--text-tertiary)', letterSpacing: '0.06em' }}>{label}</span>
  </div>
);

// ─────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────
export default function LoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();

  const [email, setEmail]           = useState('');
  const [password, setPassword]     = useState('');
  const [showPass, setShowPass]     = useState(false);
  const [error, setError]           = useState('');
  const [isSyncing, setIsSyncing]   = useState(false);
  const [mounted, setMounted]       = useState(false);

  useEffect(() => { setMounted(true); }, []);
  useEffect(() => { if (user) router.push('/dashboard'); }, [user, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSyncing(true);
    try {
      await login(email, password);
      setTimeout(() => router.push('/dashboard'), 500);
    } catch (err) {
      setError(err.response?.data?.message || 'Authentication protocol failed. Verify credentials.');
      setIsSyncing(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;600;700&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes fadeUp   { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn   { from{opacity:0} to{opacity:1} }
        @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes blink    { 0%,100%{opacity:1} 50%{opacity:0.25} }
        @keyframes pulse-ring { 0% { transform:scale(1); opacity:0.5; } 100% { transform:scale(2.6); opacity:0; } }
        @keyframes errorIn  { from{opacity:0;transform:translateY(-8px) scale(0.98)} to{opacity:1;transform:translateY(0) scale(1)} }

        .page-enter { animation: fadeIn .6s ease both; }
        .card-enter { animation: fadeUp .8s cubic-bezier(.16,1,.3,1) both; }

        .form-input {
          width: 100%;
          background: var(--bg-surface-raised, #F8FDFF);
          border: 1px solid var(--border);
          border-radius: var(--radius-md);
          padding: 13px 16px 13px 44px;
          font-size: 14px;
          font-family: 'DM Sans', sans-serif;
          color: var(--text-primary);
          outline: none;
          transition: border-color .25s ease, box-shadow .25s ease;
        }
        .form-input:focus {
          border-color: var(--accent-secondary);
          background: #fff;
          box-shadow: 0 0 0 4px rgba(131,197,190,0.15);
        }

        .submit-btn {
          width: 100%; padding: 15px 28px;
          display: flex; align-items: center; justify-content: center; gap: 10px;
          background: var(--accent-primary);
          color: #fff; font-size: 12px; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase;
          border: none; border-radius: 100px; cursor: pointer;
          box-shadow: 0 14px 36px rgba(0,109,119,0.22);
          transition: all .2s ease;
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); background: #005960; }
        .submit-btn:disabled { opacity: 0.6; cursor: wait; }

        .pass-toggle {
          position: absolute; right: 14px; top: 50%; transform: translateY(-50%);
          background: none; border: none; cursor: pointer; color: var(--text-tertiary);
        }

        .feature-row {
          display: flex; align-items: flex-start; gap: 14px; padding: 14px 0;
          border-bottom: 1px solid var(--border);
        }
        .feature-icon-wrap {
          width: 36px; height: 36px; border-radius: 10px; flex-shrink: 0;
          background: rgba(0,109,119,0.07); border: 1px solid rgba(0,109,119,0.12);
          display: flex; align-items: center; justify-content: center;
        }

        /* 📱 RESPONSIVE OVERRIDES */
        @media (max-width: 900px) {
          .main-grid {
            grid-template-columns: 1fr !important;
          }
          .left-panel {
            padding: 40px 24px !important;
            border-right: none !important;
            border-bottom: 1px solid var(--border);
          }
          .right-panel {
            padding: 40px 24px !important;
          }
          .node-mesh-container {
             height: 120% !important; /* Stretch to cover mobile aspect ratio */
          }
          .headline {
            font-size: 38px !important;
          }
        }
      `}</style>

      <div className="page-enter" style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-base)', fontFamily: "'DM Sans', sans-serif",
        padding: '20px 16px', position: 'relative', overflow: 'hidden',
      }}>
        {/* Ambient background decoration */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-10%', left: '-8%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(131,197,190,0.15) 0%, transparent 70%)', filter: 'blur(60px)' }} />
          <div style={{ position: 'absolute', bottom: '-10%', right: '-5%', width: '50vw', height: '50vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(0,109,119,0.08) 0%, transparent 70%)', filter: 'blur(80px)' }} />
        </div>

        <div className="card-enter main-grid" style={{
          width: '100%', maxWidth: 980,
          display: 'grid', gridTemplateColumns: '1fr 420px',
          background: '#fff', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-lg)', boxShadow: '0 32px 80px rgba(0,48,73,0.08)',
          overflow: 'hidden', position: 'relative', zIndex: 1,
        }}>

          {/* ── LEFT PANEL ── */}
          <div className="left-panel" style={{
            position: 'relative', overflow: 'hidden', background: 'var(--bg-base)',
            borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between', padding: '48px 44px', minHeight: '340px'
          }}>
            <div className="node-mesh-container" style={{ position: 'absolute', inset: 0 }}><NodeMesh /></div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldIcon size={17} stroke="#EDF6F9" />
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: '0.28em', color: 'var(--accent-primary)' }}>VeriX</span>
              </div>
            </div>

            <div style={{ position: 'relative', zIndex: 1, margin: '32px 0' }}>
              <h1 className="headline" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '52px', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.08, color: 'var(--text-primary)', marginBottom: 20 }}>
                Refined.<br />Resilient.<br /><em style={{ color: 'var(--accent-primary)', fontStyle: 'italic' }}>Recognized.</em>
              </h1>
              <p style={{ fontSize: 15, color: 'var(--text-tertiary)', lineHeight: 1.75, maxWidth: 300 }}>
                Access the global VeriX node ledger — manage high-fidelity identity artifacts.
              </p>

              {/* Features - Hidden on very small screens to save space if desired, or keep as is */}
              <div style={{ marginTop: 36 }}>
                {[
                  { Icon: ShieldIcon, label: 'AES-256 encrypted session' },
                  { Icon: NetworkIcon, label: 'Delhi Secure Node · LTS' },
                ].map(({ Icon: Ic, label }) => (
                  <div key={label} className="feature-row">
                    <div className="feature-icon-wrap"><Ic size={15} stroke="var(--accent-primary)" /></div>
                    <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-primary)', alignSelf: 'center' }}>{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-secondary)', animation: 'pulse-ring 2s infinite' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: 'var(--text-tertiary)' }}>SYSTEMS_NOMINAL</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="right-panel" style={{ background: '#fff', padding: '52px 44px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 100, background: 'rgba(0,109,119,0.06)', border: '1px solid rgba(0,109,119,0.1)', marginBottom: 16 }}>
                <span style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--accent-secondary)', animation: 'blink 1.8s infinite' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: 'var(--accent-primary)' }}>CONSOLE ENTRY</span>
              </div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 30, color: 'var(--text-primary)', marginBottom: 8 }}>Initialize session.</h2>
              <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Use system-managed credentials.</p>
            </div>

            {error && (
              <div style={{ display: 'flex', gap: 10, padding: '14px', borderRadius: '8px', background: 'rgba(226,149,120,0.08)', border: '1px solid rgba(226,149,120,0.25)', marginBottom: 20, animation: 'errorIn .3s ease' }}>
                <AlertIcon size={14} stroke="var(--accent-vibrant)" />
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-vibrant)' }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ flex: 1 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20, marginBottom: 28 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: 'var(--accent-primary)' }}>NODE IDENTIFIER</label>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}><MailIcon size={15} stroke="var(--text-tertiary)" /></div>
                    <input type="email" className="form-input" placeholder="ops@verix.cloud" value={email} onChange={e => setEmail(e.target.value)} required />
                  </div>
                </div>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                    <label style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: 'var(--accent-primary)' }}>CIPHER KEY</label>
                    <Link href="/forgot-password" style={{ fontSize: 11, color: 'var(--text-tertiary)', textDecoration: 'none' }}>Forgot?</Link>
                  </div>
                  <div style={{ position: 'relative' }}>
                    <div style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }}><LockIcon size={15} stroke="var(--text-tertiary)" /></div>
                    <input type={showPass ? 'text' : 'password'} className="form-input" style={{ paddingRight: 44 }} placeholder="••••••••••••" value={password} onChange={e => setPassword(e.target.value)} required />
                    <button type="button" className="pass-toggle" onClick={() => setShowPass(!showPass)}>
                      {showPass ? <EyeOffIcon size={15} /> : <EyeIcon size={15} />}
                    </button>
                  </div>
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={isSyncing}>
                {isSyncing ? 'Syncing...' : 'Synchronize Session'}
                {!isSyncing && <ArrowRightIcon size={14} stroke="#fff" />}
              </button>
            </form>

            <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: '24px 0' }}>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--text-tertiary)' }}>OR</span>
              <div style={{ flex: 1, height: '1px', background: 'var(--border)' }} />
            </div>

            <Link href="/register" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, padding: '13px', border: '1px solid var(--border-strong)', borderRadius: 100, fontSize: 12, fontWeight: 700, color: 'var(--text-primary)', textDecoration: 'none' }}>
              Request Access
            </Link>

            <div style={{ marginTop: 28, paddingTop: 20, borderTop: '1px solid var(--border)', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
              <TrustBadge label="AES-256" />
              <TrustBadge label="SOC 2" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}