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

const ArrowRightIcon = ({ size = 14, stroke = 'currentColor' }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
  </svg>
);

const NodeMesh = () => (
  <svg viewBox="0 0 440 560" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.55 }}>
    <defs>
      <radialGradient id="meshGrad" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor="#006D77" stopOpacity="0.08" /><stop offset="100%" stopColor="#006D77" stopOpacity="0" />
      </radialGradient>
    </defs>
    <rect width="440" height="560" fill="url(#meshGrad)" />
    <pattern id="lgrid" x="0" y="0" width="44" height="44" patternUnits="userSpaceOnUse">
      <path d="M 44 0 L 0 0 0 44" fill="none" stroke="#006D77" strokeWidth="0.5" strokeOpacity="0.12" />
    </pattern>
    <rect width="440" height="560" fill="url(#lgrid)" />
    <circle cx="220" cy="260" r="120" stroke="#83C5BE" strokeWidth="0.8" strokeOpacity="0.2" fill="none" />
    <circle cx="220" cy="260" r="30" fill="rgba(0,109,119,0.07)" stroke="#83C5BE" strokeWidth="1" strokeOpacity="0.3" />
    {[220, 160, 310, 210, 310, 310, 220, 360, 130, 310, 130, 210].map((val, i, arr) => i % 2 === 0 && (
      <circle key={i} cx={arr[i]} cy={arr[i+1]} r="3.5" fill="#006D77" fillOpacity="0.5" />
    ))}
  </svg>
);

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function RegisterPage() {
  const { register, user } = useAuth();
  const router = useRouter();
  
  const [form, setForm] = useState({ 
    name: '', 
    email: '', 
    mobile: '', 
    password: '', 
    confirmPassword: '' 
  });
  const [error, setError] = useState('');
  const [isSyncing, setIsSyncing] = useState(false);

  useEffect(() => { if (user) router.push('/dashboard'); }, [user, router]);

  const updateField = (field, value) => setForm(prev => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // Pre-flight Logic
    if (form.password !== form.confirmPassword) {
      return setError('Credential mismatch: Ciphers do not align.');
    }

    setIsSyncing(true);
    try {
      await register({ 
        name: form.name, 
        email: form.email, 
        mobile: form.mobile, 
        password: form.password 
      });
      
      // Handshake beat for UX
      setTimeout(() => router.push('/dashboard'), 800);
    } catch (err) {
      setError(err.response?.data?.message || 'Protocol access rejected by node.');
      setIsSyncing(false);
    }
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;600;700&display=swap');
        
        .page-enter { animation: fadeIn .6s ease both; }
        .card-enter { animation: fadeUp .8s cubic-bezier(.16,1,.3,1) both; }
        @keyframes fadeUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes fadeIn { from{opacity:0} to{opacity:1} }
        @keyframes blink  { 0%,100%{opacity:1} 50%{opacity:0.25} }
        @keyframes spin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }

        .form-input {
          width: 100%; background: #F8FDFF; border: 1px solid var(--border);
          border-radius: var(--radius-md); padding: 12px 16px;
          font-size: 14px; font-family: 'DM Sans', sans-serif;
          color: var(--text-primary); outline: none; transition: all .25s ease;
        }
        .form-input:focus { border-color: var(--accent-secondary); background: #fff; box-shadow: 0 0 0 4px rgba(131,197,190,0.15); }

        .submit-btn {
          width: 100%; padding: 15px; display: flex; align-items: center; justify-content: center; gap: 10px;
          background: var(--accent-primary); color: #fff; font-size: 11px; font-weight: 700;
          letter-spacing: 0.14em; text-transform: uppercase; border-radius: 100px; border: none;
          cursor: pointer; transition: all .2s ease; box-shadow: 0 14px 36px rgba(0,109,119,0.2);
        }
        .submit-btn:hover:not(:disabled) { transform: translateY(-2px); background: #005960; }
        .submit-btn:disabled { opacity: 0.7; cursor: wait; }

        .animate-spin-fast { animation: spin 0.8s linear infinite; }

        @media (max-width: 900px) {
          .main-grid { grid-template-columns: 1fr !important; }
          .left-panel { padding: 40px 24px !important; border-right: none !important; border-bottom: 1px solid var(--border); }
          .right-panel { padding: 40px 24px !important; }
          .headline { font-size: 38px !important; }
          .form-inner-grid { grid-template-columns: 1fr !important; gap: 16px !important; }
        }
      `}</style>

      <div className="page-enter" style={{
        minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-base)', padding: '24px 16px', position: 'relative', overflow: 'hidden'
      }}>
        {/* Ambient background decoration */}
        <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
          <div style={{ position: 'absolute', top: '-5%', left: '-5%', width: '60vw', height: '60vw', borderRadius: '50%', background: 'radial-gradient(circle, rgba(131,197,190,0.12) 0%, transparent 70%)', filter: 'blur(60px)' }} />
        </div>

        <div className="card-enter main-grid" style={{
          width: '100%', maxWidth: 1050, display: 'grid', gridTemplateColumns: '400px 1fr',
          background: '#fff', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)',
          boxShadow: '0 32px 80px rgba(0,48,73,0.08)', overflow: 'hidden', position: 'relative', zIndex: 1
        }}>

          {/* ── LEFT PANEL ── */}
          <div className="left-panel" style={{
            position: 'relative', overflow: 'hidden', background: 'var(--bg-base)',
            borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column',
            justifyContent: 'space-between', padding: '52px 44px'
          }}>
            <NodeMesh />
            
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 34, height: 34, borderRadius: 9, background: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <ShieldIcon size={17} stroke="#EDF6F9" />
                </div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, fontWeight: 700, letterSpacing: '0.28em', color: 'var(--accent-primary)' }}>VeriX</span>
              </div>
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <h1 className="headline" style={{ fontFamily: "'DM Serif Display', serif", fontSize: '46px', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.1, color: 'var(--text-primary)', marginBottom: 20 }}>
                Join the <br /><em style={{ color: 'var(--accent-primary)', fontStyle: 'italic' }}>Protocol.</em>
              </h1>
              <p style={{ fontSize: 14, color: 'var(--text-tertiary)', lineHeight: 1.7, maxWidth: 280 }}>
                Initialize your identity profile to begin secure artifact verification and node-ledger audits.
              </p>
            </div>

            <div style={{ position: 'relative', zIndex: 1 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--accent-secondary)', animation: 'blink 1.5s infinite' }} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.2em', color: 'var(--text-tertiary)' }}>AWAITING_ENROLLMENT</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT PANEL ── */}
          <div className="right-panel" style={{ background: '#fff', padding: '52px', display: 'flex', flexDirection: 'column' }}>
            <div style={{ marginBottom: 32 }}>
               <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '4px 12px', borderRadius: 100, background: 'rgba(0,109,119,0.06)', border: '1px solid rgba(0,109,119,0.1)', marginBottom: 16 }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '0.18em', color: 'var(--accent-primary)' }}>NODE_REGISTRATION</span>
              </div>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 32, color: 'var(--text-primary)', marginBottom: 8 }}>Request Access</h2>
              <p style={{ fontSize: 13, color: 'var(--text-tertiary)' }}>Complete profile initialization to access the secure registry.</p>
            </div>

            {error && (
              <div style={{ display: 'flex', padding: '14px', borderRadius: '8px', background: 'rgba(226,149,120,0.08)', border: '1px solid rgba(226,149,120,0.25)', marginBottom: 24 }}>
                <p style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent-vibrant)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ flex: 1 }}>
              <div className="form-inner-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: 32 }}>
                <div style={{ gridColumn: 'span 2' }}>
                  <label style={{ display: 'block', marginBottom: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.15em' }}>LEGAL FULL NAME</label>
                  <input type="text" className="form-input" placeholder="Abhay Kumar" value={form.name} onChange={e => updateField('name', e.target.value)} required />
                </div>
                
                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.15em' }}>NODE IDENTIFIER (EMAIL)</label>
                  <input type="email" className="form-input" placeholder="ops@verix.cloud" value={form.email} onChange={e => updateField('email', e.target.value)} required />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.15em' }}>MOBILE CONNECTIVITY</label>
                  <div style={{ display: 'flex' }}>
                    <span style={{ display: 'flex', alignItems: 'center', padding: '0 12px', background: '#f1f5f9', border: '1px solid var(--border)', borderRight: 'none', borderRadius: 'var(--radius-md) 0 0 var(--radius-md)', fontSize: '12px', fontWeight: 700, color: 'var(--accent-primary)' }}>+91</span>
                    <input type="tel" className="form-input" style={{ borderRadius: '0 var(--radius-md) var(--radius-md) 0' }} placeholder="00000 00000" value={form.mobile} onChange={e => updateField('mobile', e.target.value)} required />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.15em' }}>CIPHER KEY</label>
                  <input type="password" className="form-input" placeholder="••••••••" value={form.password} onChange={e => updateField('password', e.target.value)} required />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '0.15em' }}>CONFIRM CIPHER</label>
                  <input type="password" className="form-input" placeholder="••••••••" value={form.confirmPassword} onChange={e => updateField('confirmPassword', e.target.value)} required />
                </div>
              </div>

              <button type="submit" className="submit-btn" disabled={isSyncing}>
                {isSyncing ? (
                  <>
                    <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin-fast" />
                    <span>Initializing Node...</span>
                  </>
                ) : (
                  <>
                    Register Protocol Access
                    <ArrowRightIcon size={14} stroke="#fff" />
                  </>
                )}
              </button>
            </form>

            <footer style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid var(--border)', textAlign: 'center' }}>
              <p style={{ fontSize: 11, fontFamily: "'JetBrains Mono', monospace", fontWeight: 600, color: 'var(--text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                Already have node access?{' '}
                <Link href="/login" style={{ color: 'var(--accent-primary)', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'border-color 0.2s' }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent-primary)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'transparent'}>
                  Initialize Entry
                </Link>
              </p>
            </footer>
          </div>

        </div>
      </div>
    </>
  );
}