'use client';
import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

// ─────────────────────────────────────────────
// SVG ICON SYSTEM — no emojis, pure geometry
// ─────────────────────────────────────────────
const Icon = {
  Shield: ({ size = 24, stroke = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2L3 7v5c0 5.25 3.75 10.15 9 11.25C17.25 22.15 21 17.25 21 12V7L12 2z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
  Eye: ({ size = 24, stroke = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="12" rx="9" ry="5.5" />
      <circle cx="12" cy="12" r="2.2" />
      <line x1="12" y1="2" x2="12" y2="6" />
      <line x1="12" y1="18" x2="12" y2="22" />
    </svg>
  ),
  Fingerprint: ({ size = 24, stroke = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2a7 7 0 0 0-7 7" /><path d="M5 14a7 7 0 0 0 13.9 1.4" />
      <path d="M8 9a4 4 0 0 1 8 0c0 3-1 5-1 8" />
      <path d="M12 9v1" /><path d="M10 18.5c.5-2 1-4 1-6" />
      <path d="M15 13c0 3-.5 5-1.5 7" />
    </svg>
  ),
  Globe: ({ size = 24, stroke = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M2 12h20" /><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
    </svg>
  ),
  Lock: ({ size = 24, stroke = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="5" y="11" width="14" height="10" rx="2" />
      <path d="M8 11V7a4 4 0 0 1 8 0v4" />
      <circle cx="12" cy="16" r="1.2" fill={stroke} stroke="none" />
    </svg>
  ),
  Document: ({ size = 24, stroke = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="8" y1="13" x2="16" y2="13" /><line x1="8" y1="17" x2="12" y2="17" />
    </svg>
  ),
  Network: ({ size = 24, stroke = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="5" r="2" /><circle cx="5" cy="19" r="2" /><circle cx="19" cy="19" r="2" />
      <path d="M12 7v4l-5 6" /><path d="M12 11l5 8" /><line x1="5" y1="19" x2="19" y2="19" />
    </svg>
  ),
  Check: ({ size = 18, stroke = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  ),
  Arrow: ({ size = 18, stroke = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12" />
      <polyline points="12 5 19 12 12 19" />
    </svg>
  ),
  Scan: ({ size = 24, stroke = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7V5a2 2 0 0 1 2-2h2" /><path d="M17 3h2a2 2 0 0 1 2 2v2" />
      <path d="M21 17v2a2 2 0 0 1-2 2h-2" /><path d="M7 21H5a2 2 0 0 1-2-2v-2" />
      <line x1="3" y1="12" x2="21" y2="12" strokeDasharray="2 2" />
    </svg>
  ),
  ChevronRight: ({ size = 16, stroke = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="9 18 15 12 9 6" />
    </svg>
  ),
  Verified: ({ size = 24, stroke = 'currentColor' }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l2.4 3.6L18 4.8l-.6 4.2 3.6 2.4-3.6 2.4.6 4.2-3.6-1.2L12 20.4l-2.4-3.6L6 18l.6-4.2L3 11.4 6.6 9l-.6-4.2 3.6 1.2L12 2z" />
      <polyline points="9 12 11 14 15 10" />
    </svg>
  ),
};

// ─────────────────────────────────────────────
// DECORATIVE SVG BACKGROUNDS
// ─────────────────────────────────────────────
const HeroOrb = () => (
  <svg viewBox="0 0 600 600" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%', height: '100%' }}>
    <defs>
      <radialGradient id="orb1" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#83C5BE" stopOpacity="0.18" />
        <stop offset="100%" stopColor="#83C5BE" stopOpacity="0" />
      </radialGradient>
      <radialGradient id="orb2" cx="50%" cy="50%" r="50%">
        <stop offset="0%" stopColor="#006D77" stopOpacity="0.10" />
        <stop offset="100%" stopColor="#006D77" stopOpacity="0" />
      </radialGradient>
    </defs>
    <circle cx="300" cy="300" r="280" fill="url(#orb1)" />
    <circle cx="300" cy="300" r="180" fill="url(#orb2)" />
    <circle cx="300" cy="300" r="200" stroke="#83C5BE" strokeOpacity="0.12" strokeWidth="1" fill="none" />
    <circle cx="300" cy="300" r="260" stroke="#006D77" strokeOpacity="0.07" strokeWidth="1" fill="none" />
    <circle cx="300" cy="300" r="120" stroke="#83C5BE" strokeOpacity="0.15" strokeWidth="0.5" fill="none" strokeDasharray="4 8" />
  </svg>
);

const GridPattern = () => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.035 }} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="grid" x="0" y="0" width="48" height="48" patternUnits="userSpaceOnUse">
        <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#006D77" strokeWidth="1" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#grid)" />
  </svg>
);

const HexPattern = () => (
  <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.04 }} xmlns="http://www.w3.org/2000/svg">
    <defs>
      <pattern id="hex" x="0" y="0" width="60" height="52" patternUnits="userSpaceOnUse">
        <polygon points="30,2 58,16 58,36 30,50 2,36 2,16" fill="none" stroke="#006D77" strokeWidth="0.8" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#hex)" />
  </svg>
);

// ─────────────────────────────────────────────
// ANIMATED COUNTER
// ─────────────────────────────────────────────
function useCounter(target, duration = 2000, start = false) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime = null;
    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setVal(Math.floor(eased * target));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, target, duration]);
  return val;
}

// ─────────────────────────────────────────────
// INTERSECTION OBSERVER HOOK
// ─────────────────────────────────────────────
function useInView(threshold = 0.15) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setInView(true); observer.disconnect(); }
    }, { threshold });
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [threshold]);
  return [ref, inView];
}

// ─────────────────────────────────────────────
// STAT CARD
// ─────────────────────────────────────────────
function StatCard({ value, suffix, label, desc, delay = 0 }) {
  const [ref, inView] = useInView();
  const count = useCounter(value, 1800, inView);
  return (
    <div ref={ref} style={{
      padding: '36px 32px',
      borderRight: '1px solid var(--border)',
      opacity: inView ? 1 : 0,
      transform: inView ? 'none' : 'translateY(16px)',
      transition: `opacity 0.6s ${delay}ms ease, transform 0.6s ${delay}ms ease`,
    }}>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 2 }}>
        <span style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.05em', color: 'var(--text-primary)', lineHeight: 1 }}>
          {count.toLocaleString()}
        </span>
        <span style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent-primary)' }}>{suffix}</span>
      </div>
      <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.18em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginTop: 8, fontFamily: 'monospace' }}>{label}</div>
      <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 6 }}>{desc}</div>
    </div>
  );
}

// ─────────────────────────────────────────────
// KYC FLOW STEP DATA
// ─────────────────────────────────────────────
const STEPS = [
  {
    id: 0, label: 'Capture',
    IconComp: Icon.Scan,
    title: 'Document Ingestion',
    desc: 'Government-issued ID is submitted and pre-processed for glare, skew, and resolution validation before entering the cryptographic pipeline.',
    checks: [
      { ok: true,  text: 'Resolution ≥ 300 DPI confirmed' },
      { ok: true,  text: 'Anti-glare normalisation applied' },
      { ok: true,  text: 'Boundary detection complete' },
      { ok: null,  text: 'Hologram scan in progress' },
    ],
    progress: 30, hash: null,
  },
  {
    id: 1, label: 'OCR Extract',
    IconComp: Icon.Document,
    title: 'Optical Character Recognition',
    desc: 'Dual-engine OCR (Latin + Devanagari) extracts all fields. MRZ zone is parsed and cross-validated against printed text for tamper signals.',
    checks: [
      { ok: true,  text: 'Name: ARJUN MEHTA extracted' },
      { ok: true,  text: 'DOB: 12-Aug-1994 validated' },
      { ok: true,  text: 'MRZ checksum passed' },
      { ok: true,  text: 'Field consistency verified' },
    ],
    progress: 55, hash: null,
  },
  {
    id: 2, label: 'Liveness',
    IconComp: Icon.Eye,
    title: 'Biometric Liveness Detection',
    desc: 'ISO/IEC 30107-3 certified 3D depth-map analysis defeats printed photos, deepfakes, and silicone masks using passive liveness scoring.',
    checks: [
      { ok: true,  text: 'Face detected — 97.4% confidence' },
      { ok: true,  text: 'Depth variance: live (0.94)' },
      { ok: true,  text: 'Anti-deepfake model: PASS' },
      { ok: false, text: 'Occlusion detected — retry issued' },
    ],
    progress: 72, hash: null,
  },
  {
    id: 3, label: 'Risk Score',
    IconComp: Icon.Shield,
    title: 'ML Risk Inference Engine',
    desc: '300+ behavioural and contextual signals — device fingerprint, IP geo, velocity, and PEP/sanctions watchlists — synthesised in real time.',
    checks: [
      { ok: true,  text: 'Device fingerprint: trusted' },
      { ok: true,  text: 'IP geo matches declared country' },
      { ok: true,  text: 'Sanctions list: no match' },
      { ok: true,  text: 'Risk score: 14 / 100 (LOW)' },
    ],
    progress: 88, hash: null,
  },
  {
    id: 4, label: 'Commit',
    IconComp: Icon.Verified,
    title: 'Immutable Ledger Commit',
    desc: 'Verification artifact is SHA-3 hashed and committed across 3 geo-redundant nodes. The record is permanently auditable by any authorised party.',
    checks: [
      { ok: true, text: 'Artifact hash generated' },
      { ok: true, text: 'Consensus: 3 / 3 nodes' },
      { ok: true, text: 'Block height: #4,291,847' },
      { ok: true, text: 'Certificate issued — APPROVED' },
    ],
    progress: 100,
    hash: 'a3f9c2e1b847d056f3129a0c4e7f8b2d1a6e3c90f5d47b8a2e1c6f3d0b9a47e2',
  },
];

// ─────────────────────────────────────────────
// FEATURE DATA
// ─────────────────────────────────────────────
const FEATURES = [
  { Icon: Icon.Document, title: 'Document Intelligence', desc: 'AI-powered OCR for 180+ document types across 195 countries. MRZ scanning, hologram checks, and font forensics in under 100 ms.', tag: '180+ Doc Types' },
  { Icon: Icon.Fingerprint, title: 'Biometric Liveness', desc: 'Passive 3D depth-map analysis defeats printed photos, deepfakes, and replay attacks. Certified to ISO/IEC 30107-3 Level 2.', tag: 'ISO 30107-3' },
  { Icon: Icon.Shield, title: 'Instant Risk Scoring', desc: '300+ ML signals — device, behaviour, geo, and watchlist — synthesised into a real-time risk score with full explainability.', tag: '300+ Signals' },
  { Icon: Icon.Lock, title: 'End-to-End Encryption', desc: 'AES-256 in transit and at rest. Zero-knowledge proofs ensure identity attributes are verified without ever being exposed.', tag: 'AES-256' },
  { Icon: Icon.Globe, title: 'Global Node Network', desc: '28 regional nodes across 6 continents. Sub-100 ms round-trips and automatic geo-failover ensure zero-downtime operations.', tag: '28 Nodes' },
  { Icon: Icon.Network, title: 'Regulatory Coverage', desc: 'Pre-built compliance flows for DPDP, GDPR, RBI V-KYC, FATF, and AML5D directives — 47 regulated markets and counting.', tag: '47 Jurisdictions' },
];

// ─────────────────────────────────────────────
// COMPLIANCE DATA
// ─────────────────────────────────────────────
const COMPLIANCE = [
  { fw: 'DPDP Act 2023',         region: 'India',   coverage: 'Data localisation, consent, breach notification',     status: 'Compliant', cert: 'CERT-IN-2024-0091'  },
  { fw: 'GDPR',                  region: 'EU / EEA', coverage: 'Right to erasure, data minimisation, DPA registration', status: 'Compliant', cert: 'EU-DPA-2024-7732'   },
  { fw: 'FATF AML / CFT',        region: 'Global',   coverage: 'CDD, EDD, PEP screening, sanctions watchlist',         status: 'Compliant', cert: 'FATF-VRX-2024'      },
  { fw: 'ISO / IEC 27001',       region: 'Global',   coverage: 'Information security management system',               status: 'Certified', cert: 'BSI-IS-1029-2024'   },
  { fw: 'SOC 2 Type II',         region: 'US',       coverage: 'Security, availability, confidentiality controls',     status: 'Audited',   cert: 'SOC2-2024-Q3'       },
  { fw: 'RBI KYC Master Dir.',   region: 'India',    coverage: 'V-KYC, Aadhaar OTP, Video KYC, Re-KYC',               status: 'Compliant', cert: 'RBI-VKYC-VRX-024'   },
];

// ─────────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────────
export default function LandingPage() {
  const [activeStep, setActiveStep] = useState(0);
  const [navScrolled, setNavScrolled] = useState(false);
  const [statsRef, statsInView] = useInView(0.2);

  useEffect(() => {
    const onScroll = () => setNavScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const step = STEPS[activeStep];

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700;9..40,800&family=DM+Serif+Display:ital@0;1&family=JetBrains+Mono:wght@400;600;700&display=swap');

        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes float    { 0%,100%{transform:translateY(0)}  50%{transform:translateY(-8px)} }
        @keyframes fadeUp   { from{opacity:0;transform:translateY(28px)} to{opacity:1;transform:translateY(0)} }
        @keyframes scanline { 0%{top:-4px} 100%{top:calc(100% + 4px)} }
        @keyframes spinSlow { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
        @keyframes pulse-ring {
          0%   { transform:scale(1); opacity:.5; }
          100% { transform:scale(2.4); opacity:0; }
        }
        @keyframes shimmer {
          0%   { background-position: -600px 0; }
          100% { background-position:  600px 0; }
        }
        @keyframes ticker {
          0%   { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes blink { 0%,100%{opacity:1} 50%{opacity:0} }

        .hero-enter   { animation: fadeUp .9s ease both; }
        .hero-enter-2 { animation: fadeUp .9s .15s ease both; }
        .hero-enter-3 { animation: fadeUp .9s .30s ease both; }
        .hero-enter-4 { animation: fadeUp .9s .45s ease both; }

        .float { animation: float 5s ease-in-out infinite; }

        .step-btn {
          background: none; border: none; cursor: pointer;
          padding: 0; width: 100%; text-align: left;
        }
        .step-btn:focus-visible { outline: 2px solid var(--accent-secondary); border-radius: 12px; }

        .feature-card {
          background: var(--bg-surface);
          border: 1px solid var(--border);
          border-radius: var(--radius-lg);
          padding: 36px 32px;
          transition: border-color .35s ease, transform .35s ease, box-shadow .35s ease;
        }
        .feature-card:hover {
          border-color: var(--accent-secondary);
          transform: translateY(-6px);
          box-shadow: 0 30px 60px rgba(0,48,73,.07);
        }

        .nav-link {
          font-size: 11px; font-weight: 700; letter-spacing: .15em;
          text-transform: uppercase; color: var(--text-tertiary);
          text-decoration: none; transition: color .2s;
        }
        .nav-link:hover { color: var(--accent-primary); }

        .compliance-row:hover td { background: rgba(0,109,119,.025); }
        .compliance-row td { transition: background .2s; }

        .ticker-wrap { overflow: hidden; width: 100%; }
        .ticker-inner { display: flex; width: max-content; animation: ticker 30s linear infinite; }
        .ticker-inner:hover { animation-play-state: paused; }

        .progress-fill {
          height: 100%; border-radius: 4px;
          background: linear-gradient(90deg, var(--accent-secondary), var(--accent-primary));
          transition: width .8s cubic-bezier(.16,1,.3,1);
        }

        .hash-display {
          font-family: 'JetBrains Mono', monospace;
          font-size: 11px; line-height: 1.9; word-break: break-all;
          color: var(--accent-primary);
          background: rgba(0,109,119,.05);
          border: 1px solid rgba(0,109,119,.12);
          border-radius: 12px; padding: 14px 18px;
        }

        .cta-btn-primary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 17px 36px;
          background: var(--accent-vibrant);
          color: #fff; font-size: 13px; font-weight: 700;
          letter-spacing: .12em; text-transform: uppercase;
          border: none; border-radius: 100px; cursor: pointer;
          text-decoration: none;
          box-shadow: 0 16px 40px rgba(226,149,120,.28);
          transition: transform .2s, box-shadow .2s;
        }
        .cta-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 24px 50px rgba(226,149,120,.4); }

        .cta-btn-secondary {
          display: inline-flex; align-items: center; gap: 10px;
          padding: 17px 36px;
          background: transparent;
          color: var(--text-primary); font-size: 13px; font-weight: 700;
          letter-spacing: .12em; text-transform: uppercase;
          border: 1px solid var(--border-strong); border-radius: 100px; cursor: pointer;
          text-decoration: none;
          transition: background .2s, border-color .2s;
        }
        .cta-btn-secondary:hover { background: var(--bg-muted); border-color: var(--accent-secondary); }
      `}</style>

      <div style={{ background: 'var(--bg-base)', color: 'var(--text-primary)', fontFamily: "'DM Sans', system-ui, sans-serif", overflowX: 'hidden' }}>

        {/* ── NAV ── */}
        <nav style={{
          position: 'fixed', top: 0, width: '100%', zIndex: 100,
          height: 72,
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0 56px',
          background: navScrolled ? 'rgba(237,246,249,0.85)' : 'transparent',
          backdropFilter: navScrolled ? 'blur(16px) saturate(120%)' : 'none',
          borderBottom: navScrolled ? '1px solid var(--border)' : '1px solid transparent',
          transition: 'background .4s ease, border-color .4s ease',
        }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{
              width: 36, height: 36,
              background: 'var(--accent-primary)',
              borderRadius: 10,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon.Shield size={18} stroke="#EDF6F9" />
            </div>
            <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, letterSpacing: '0.3em', color: 'var(--text-primary)' }}>VeriX</span>
          </div>

          <div style={{ display: 'flex', gap: 40 }}>
            {['Infrastructure', 'Security', 'Compliance'].map(l => (
              <a key={l} href={`#${l.toLowerCase()}`} className="nav-link">{l}</a>
            ))}
          </div>

          <Link href="/login" style={{
            padding: '10px 26px',
            background: 'var(--accent-primary)', color: '#EDF6F9',
            fontSize: 11, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase',
            borderRadius: 100, textDecoration: 'none',
            transition: 'opacity .2s',
          }}
            onMouseEnter={e => e.currentTarget.style.opacity = '.85'}
            onMouseLeave={e => e.currentTarget.style.opacity = '1'}
          >
            Access Console
          </Link>
        </nav>

        {/* ── HERO ── */}
        <section style={{ position: 'relative', minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '140px 56px 100px', overflow: 'hidden' }}>
          <GridPattern />

          {/* Orb */}
          <div style={{ position: 'absolute', right: '-60px', top: '50%', transform: 'translateY(-50%)', width: '680px', height: '680px', opacity: 0.9, pointerEvents: 'none' }} className="float">
            <HeroOrb />
          </div>

          {/* Spinning dashed ring */}
          <div style={{
            position: 'absolute', right: 140, top: '50%', transform: 'translateY(-50%)',
            width: 340, height: 340, borderRadius: '50%',
            border: '1px dashed rgba(131,197,190,0.25)',
            animation: 'spinSlow 40s linear infinite',
            pointerEvents: 'none',
          }} />

          {/* Hero content */}
          <div style={{ position: 'relative', zIndex: 1, maxWidth: 760 }}>
            <div className="hero-enter" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, background: 'rgba(0,109,119,.07)', border: '1px solid rgba(0,109,119,.12)', marginBottom: 32 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent-secondary)', display: 'inline-block', animation: 'blink 1.8s ease infinite' }} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>Protocol v2.4 LTS · All Systems Operational</span>
            </div>

            <h1 className="hero-enter-2" style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(50px, 7vw, 88px)', fontWeight: 400, letterSpacing: '-0.02em', lineHeight: 1.04, color: 'var(--text-primary)', marginBottom: 28 }}>
              Identity<br />
              <em style={{ color: 'var(--accent-primary)', fontStyle: 'italic' }}>Infrastructure</em><br />
              for the Future.
            </h1>

            <p className="hero-enter-3" style={{ fontSize: 19, color: 'var(--text-tertiary)', maxWidth: 560, lineHeight: 1.75, marginBottom: 52, fontWeight: 400 }}>
              Deploy cryptographically-secured eKYC workflows at scale — real-time liveness detection, document hashing, and decentralised consensus in a single unified platform.
            </p>

            <div className="hero-enter-4" style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <a href="#infrastructure" className="cta-btn-primary">
                Initialize Your Node
                <Icon.Arrow size={16} stroke="#fff" />
              </a>
              <a href="#security" className="cta-btn-secondary">
                Audit Registry
                <Icon.ChevronRight size={16} stroke="var(--text-primary)" />
              </a>
            </div>

            {/* Micro trust badges */}
            <div className="hero-enter-4" style={{ display: 'flex', gap: 24, marginTop: 52, flexWrap: 'wrap' }}>
              {['AES-256 Encrypted', 'ISO 27001 Certified', 'SOC 2 Type II', 'GDPR Compliant'].map(b => (
                <div key={b} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                  <Icon.Check size={14} stroke="var(--accent-primary)" />
                  <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-tertiary)' }}>{b}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── LIVE TICKER ── */}
        <div style={{ borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface)', padding: '14px 0', overflow: 'hidden' }}>
          <div className="ticker-inner" style={{ display: 'flex', gap: 0 }}>
            {[...Array(2)].map((_, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 0, whiteSpace: 'nowrap' }}>
                {[
                  ['Verifications Today', '2,441,820'],
                  ['Avg Decision Time',   '0.31s'],
                  ['Active Nodes',        '28 / 28'],
                  ['Pass Rate',           '99.7%'],
                  ['Countries Covered',   '140+'],
                  ['Fraud Blocked Today', '12,449'],
                  ['Uptime',              '99.98%'],
                ].map(([label, value]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', padding: '0 48px' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase', color: 'var(--text-tertiary)' }}>{label}</span>
                    <span style={{ margin: '0 12px', color: 'var(--border-strong)', fontSize: 12 }}>·</span>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: 'var(--accent-primary)', letterSpacing: '.1em' }}>{value}</span>
                    <span style={{ margin: '0 0 0 48px', color: 'var(--border-strong)', fontSize: 12 }}>|</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        {/* ── STATS STRIP ── */}
        <div ref={statsRef} style={{ margin: '0 56px', display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-premium)' }}>
          <StatCard value={2400000} suffix="+" label="Verifications / Day" desc="Across 140+ countries" delay={0} />
          <StatCard value={99}      suffix=".7%" label="Accuracy Rate"       desc="Document + biometric" delay={100} />
          <StatCard value={28}      suffix=""    label="Global Nodes"         desc="6 continents, zero downtime" delay={200} />
          <div style={{ padding: '36px 32px' }}>
            <div style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.05em', color: 'var(--text-primary)', lineHeight: 1 }}>0.3<span style={{ fontSize: 22, fontWeight: 700, color: 'var(--accent-primary)' }}>s</span></div>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '.18em', textTransform: 'uppercase', color: 'var(--text-tertiary)', marginTop: 8, fontFamily: 'monospace' }}>Avg Decision Time</div>
            <div style={{ fontSize: 13, color: 'var(--text-tertiary)', marginTop: 6 }}>AI-powered decisioning</div>
          </div>
        </div>

        {/* ── KYC FLOW DEMO ── */}
        <section id="infrastructure" style={{ padding: '120px 56px' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto' }}>
            {/* Heading */}
            <div style={{ marginBottom: 64 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>// Interactive KYC Walkthrough</span>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(34px,4vw,54px)', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginTop: 14, marginBottom: 14 }}>
                Complete verification <em style={{ color: 'var(--accent-primary)' }}>in seconds.</em>
              </h2>
              <p style={{ fontSize: 17, color: 'var(--text-tertiary)', maxWidth: 540, lineHeight: 1.75 }}>Click each stage to walk through the full eKYC pipeline — from document capture to ledger commit.</p>
            </div>

            {/* Flow Shell */}
            <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-premium)' }}>

              {/* Window chrome */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid var(--border)', background: 'var(--bg-surface-raised)' }}>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-tertiary)', letterSpacing: '.15em' }}>// VERIFICATION_SESSION · TXN_9F2A7B4E</span>
                <div style={{ display: 'flex', gap: 6 }}>
                  {['#FFB4A2', '#B5D5C5', '#006D77'].map((c, i) => <div key={i} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />)}
                </div>
              </div>

              {/* Step tabs */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', borderBottom: '1px solid var(--border)' }}>
                {STEPS.map((s, i) => {
                  const isActive = activeStep === i;
                  const isDone   = activeStep > i;
                  return (
                    <button key={s.id} className="step-btn" onClick={() => setActiveStep(i)} style={{
                      padding: '24px 16px', textAlign: 'center',
                      borderRight: i < 4 ? '1px solid var(--border)' : 'none',
                      background: isActive ? 'rgba(0,109,119,.04)' : 'transparent',
                      borderBottom: isActive ? '2px solid var(--accent-primary)' : '2px solid transparent',
                      transition: 'background .2s',
                    }}>
                      <div style={{
                        width: 40, height: 40, borderRadius: 12, margin: '0 auto 10px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: isActive ? 'rgba(0,109,119,.08)' : 'var(--bg-muted)',
                        border: isActive ? '1px solid rgba(0,109,119,.2)' : '1px solid transparent',
                        transition: 'all .2s',
                      }}>
                        <s.IconComp size={18} stroke={isActive ? 'var(--accent-primary)' : isDone ? 'var(--accent-secondary)' : 'var(--text-tertiary)'} />
                      </div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: 'var(--text-tertiary)', marginBottom: 3, letterSpacing: '.1em' }}>STEP_0{i + 1}</div>
                      <div style={{ fontSize: 12, fontWeight: 700, color: isActive ? 'var(--accent-primary)' : 'var(--text-tertiary)', letterSpacing: '.02em' }}>{s.label}</div>
                      <div style={{
                        marginTop: 8, fontSize: 9, padding: '2px 8px', borderRadius: 100,
                        fontFamily: "'JetBrains Mono', monospace", fontWeight: 700, display: 'inline-block',
                        background: isActive ? 'rgba(0,109,119,.08)' : isDone ? 'rgba(131,197,190,.15)' : 'var(--bg-muted)',
                        color: isActive ? 'var(--accent-primary)' : isDone ? 'var(--accent-secondary)' : 'var(--text-tertiary)',
                      }}>
                        {isActive ? 'ACTIVE' : isDone ? 'DONE' : 'PENDING'}
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Detail panel */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0, minHeight: 280 }}>
                {/* Left */}
                <div style={{ padding: '40px 40px', borderRight: '1px solid var(--border)' }}>
                  <h3 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 22, fontWeight: 400, color: 'var(--text-primary)', marginBottom: 12 }}>{step.title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-tertiary)', lineHeight: 1.75, marginBottom: 28 }}>{step.desc}</p>

                  {/* Progress */}
                  <div style={{ marginBottom: 24 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-tertiary)', letterSpacing: '.12em', textTransform: 'uppercase' }}>Pipeline Progress</span>
                      <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, color: 'var(--accent-primary)' }}>{step.progress}%</span>
                    </div>
                    <div style={{ height: 4, background: 'var(--bg-muted)', borderRadius: 4, overflow: 'hidden' }}>
                      <div className="progress-fill" style={{ width: `${step.progress}%` }} />
                    </div>
                  </div>

                  {/* Hash */}
                  {step.hash && (
                    <div>
                      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-tertiary)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 8 }}>SHA-3 Artifact Hash</div>
                      <div className="hash-display">{step.hash}</div>
                    </div>
                  )}
                </div>

                {/* Right — checklist */}
                <div style={{ padding: '40px 40px' }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-tertiary)', letterSpacing: '.12em', textTransform: 'uppercase', marginBottom: 20 }}>Verification Signals</div>
                  <ul style={{ listStyle: 'none' }}>
                    {step.checks.map((c, i) => (
                      <li key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 0', borderBottom: i < step.checks.length - 1 ? '1px solid var(--border)' : 'none' }}>
                        <div style={{
                          width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          background: c.ok === true ? 'rgba(131,197,190,.2)' : c.ok === false ? 'rgba(226,149,120,.15)' : 'var(--bg-muted)',
                          border: `1px solid ${c.ok === true ? 'rgba(0,109,119,.2)' : c.ok === false ? 'rgba(226,149,120,.3)' : 'var(--border)'}`,
                        }}>
                          {c.ok === true  && <Icon.Check size={11} stroke="var(--accent-primary)" />}
                          {c.ok === false && <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="var(--accent-vibrant)" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>}
                          {c.ok === null  && <div style={{ width: 5, height: 5, borderRadius: '50%', background: 'var(--text-tertiary)', animation: 'blink 1.4s infinite' }} />}
                        </div>
                        <span style={{ fontSize: 13, color: c.ok === null ? 'var(--text-tertiary)' : 'var(--text-primary)', fontWeight: c.ok === true ? 500 : 400 }}>{c.text}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section id="security" style={{ padding: '100px 56px', background: 'var(--bg-surface)', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', position: 'relative', overflow: 'hidden' }}>
          <HexPattern />
          <div style={{ maxWidth: 1080, margin: '0 auto', position: 'relative' }}>
            <div style={{ marginBottom: 64 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>// Core Capabilities</span>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(34px,4vw,54px)', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginTop: 14, marginBottom: 14 }}>
                Built for enterprise-grade <em style={{ color: 'var(--accent-primary)' }}>trust.</em>
              </h2>
              <p style={{ fontSize: 17, color: 'var(--text-tertiary)', maxWidth: 520, lineHeight: 1.75 }}>Every layer of the VeriX stack is purpose-built for identity verification at scale.</p>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 24 }}>
              {FEATURES.map(({ Icon: Ic, title, desc, tag }, i) => (
                <div key={title} className="feature-card" style={{ animationDelay: `${i * 80}ms` }}>
                  <div style={{
                    width: 52, height: 52, borderRadius: 14,
                    background: 'rgba(0,109,119,.07)',
                    border: '1px solid rgba(0,109,119,.12)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 24,
                  }}>
                    <Ic size={22} stroke="var(--accent-primary)" />
                  </div>
                  <h3 style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)', marginBottom: 10, letterSpacing: '-0.02em' }}>{title}</h3>
                  <p style={{ fontSize: 14, color: 'var(--text-tertiary)', lineHeight: 1.75, marginBottom: 20 }}>{desc}</p>
                  <span style={{
                    display: 'inline-block', padding: '4px 12px', borderRadius: 100,
                    background: 'rgba(131,197,190,.15)', color: 'var(--accent-primary)',
                    fontSize: 10, fontWeight: 700, letterSpacing: '.15em', textTransform: 'uppercase',
                    fontFamily: "'JetBrains Mono', monospace",
                    border: '1px solid rgba(0,109,119,.1)',
                  }}>{tag}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── VISUAL BREAK — Architecture Diagram ── */}
        <section style={{ padding: '120px 56px', background: 'var(--bg-base)' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 80, alignItems: 'center' }}>
              {/* Left text */}
              <div>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>// Distributed Architecture</span>
                <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(32px,3.5vw,48px)', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginTop: 14, marginBottom: 20 }}>
                  Verification that <em style={{ color: 'var(--accent-primary)' }}>never sleeps.</em>
                </h2>
                <p style={{ fontSize: 16, color: 'var(--text-tertiary)', lineHeight: 1.8, marginBottom: 32 }}>
                  28 regional nodes operate in active-active consensus. Every verification request is processed by the nearest node and replicated globally — zero single points of failure.
                </p>
                {[
                  ['Sub-100ms', 'Round-trip latency globally'],
                  ['3-of-3 Consensus', 'Required for ledger commit'],
                  ['Auto Failover', 'Geo-redundant by design'],
                ].map(([val, label]) => (
                  <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, color: 'var(--accent-primary)', minWidth: 140 }}>{val}</span>
                    <span style={{ fontSize: 14, color: 'var(--text-tertiary)' }}>{label}</span>
                  </div>
                ))}
              </div>

              {/* Right — SVG architecture art */}
              <div style={{ position: 'relative' }} className="float">
                <svg viewBox="0 0 420 380" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ width: '100%' }}>
                  <defs>
                    <radialGradient id="nodeGrad" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#006D77" stopOpacity="0.12" />
                      <stop offset="100%" stopColor="#006D77" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  {/* Central node */}
                  <circle cx="210" cy="190" r="56" fill="url(#nodeGrad)" stroke="#006D77" strokeWidth="1" strokeOpacity="0.3" />
                  <circle cx="210" cy="190" r="36" fill="rgba(0,109,119,0.08)" stroke="#83C5BE" strokeWidth="1" strokeOpacity="0.5" />
                  <circle cx="210" cy="190" r="18" fill="rgba(0,109,119,0.15)" />
                  <path d="M202 190L208 196L218 184" stroke="#006D77" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                  {/* Orbit dashes */}
                  <circle cx="210" cy="190" r="90" stroke="#83C5BE" strokeWidth="0.8" strokeOpacity="0.3" strokeDasharray="4 10" />
                  <circle cx="210" cy="190" r="140" stroke="#006D77" strokeWidth="0.6" strokeOpacity="0.18" strokeDasharray="3 16" />
                  {/* Outer nodes */}
                  {[
                    [210, 100], [300, 145], [300, 235], [210, 280], [120, 235], [120, 145],
                  ].map(([cx, cy], i) => (
                    <g key={i}>
                      <line x1="210" y1="190" x2={cx} y2={cy} stroke="#83C5BE" strokeWidth="0.8" strokeOpacity="0.4" strokeDasharray="3 6" />
                      <circle cx={cx} cy={cy} r="14" fill="rgba(131,197,190,0.12)" stroke="#83C5BE" strokeWidth="1" strokeOpacity="0.5" />
                      <circle cx={cx} cy={cy} r="5" fill="#006D77" fillOpacity="0.6" />
                    </g>
                  ))}
                  {/* Far nodes */}
                  {[
                    [210, 50], [355, 115], [355, 265], [210, 330], [65, 265], [65, 115],
                  ].map(([cx, cy], i) => (
                    <g key={i}>
                      <circle cx={cx} cy={cy} r="8" fill="rgba(0,109,119,0.06)" stroke="#83C5BE" strokeWidth="0.7" strokeOpacity="0.35" />
                      <circle cx={cx} cy={cy} r="3" fill="#83C5BE" fillOpacity="0.5" />
                    </g>
                  ))}
                  {/* Label */}
                  <text x="210" y="240" textAnchor="middle" fontFamily="'JetBrains Mono', monospace" fontSize="9" fill="#006D77" fillOpacity="0.6" letterSpacing="2">GLOBAL MESH</text>
                </svg>
              </div>
            </div>
          </div>
        </section>

        {/* ── COMPLIANCE TABLE ── */}
        <section id="compliance" style={{ padding: '100px 56px', background: 'var(--bg-surface)', borderTop: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto' }}>
            <div style={{ marginBottom: 56 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '.22em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>// Compliance & Standards</span>
              <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(34px,4vw,54px)', fontWeight: 400, letterSpacing: '-0.02em', color: 'var(--text-primary)', marginTop: 14, marginBottom: 14 }}>
                Certifications & <em style={{ color: 'var(--accent-primary)' }}>regulatory coverage.</em>
              </h2>
              <p style={{ fontSize: 17, color: 'var(--text-tertiary)', maxWidth: 520, lineHeight: 1.75 }}>Pre-certified for the world's most demanding identity verification mandates.</p>
            </div>

            <div style={{ border: '1px solid var(--border)', borderRadius: 'var(--radius-lg)', overflow: 'hidden', boxShadow: 'var(--shadow-premium)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ background: 'var(--bg-surface-raised)', borderBottom: '1px solid var(--border)' }}>
                    {['Framework', 'Region', 'Coverage', 'Status', 'Certificate ID'].map(h => (
                      <th key={h} style={{ padding: '14px 20px', fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--text-tertiary)', textAlign: 'left' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {COMPLIANCE.map((row, i) => (
                    <tr key={row.fw} className="compliance-row" style={{ borderBottom: i < COMPLIANCE.length - 1 ? '1px solid var(--border)' : 'none' }}>
                      <td style={{ padding: '16px 20px', fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{row.fw}</td>
                      <td style={{ padding: '16px 20px', fontSize: 13, color: 'var(--text-tertiary)' }}>{row.region}</td>
                      <td style={{ padding: '16px 20px', fontSize: 13, color: 'var(--text-tertiary)', maxWidth: 260 }}>{row.coverage}</td>
                      <td style={{ padding: '16px 20px' }}>
                        <span style={{
                          display: 'inline-block', padding: '3px 12px', borderRadius: 100,
                          fontSize: 10, fontWeight: 700, fontFamily: "'JetBrains Mono', monospace", letterSpacing: '.12em',
                          background: row.status === 'Audited' ? 'rgba(0,109,119,.07)' : 'rgba(131,197,190,.15)',
                          color: row.status === 'Audited' ? 'var(--accent-primary)' : 'var(--accent-primary)',
                          border: '1px solid rgba(0,109,119,.12)',
                        }}>{row.status}</span>
                      </td>
                      <td style={{ padding: '16px 20px', fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: 'var(--text-tertiary)' }}>{row.cert}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section style={{ padding: '140px 56px', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
          <GridPattern />
          {/* Orb bg */}
          <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', width: 700, height: 700, borderRadius: '50%', background: 'radial-gradient(circle, rgba(131,197,190,0.12) 0%, transparent 65%)', pointerEvents: 'none' }} />

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '6px 16px', borderRadius: 100, background: 'rgba(0,109,119,.07)', border: '1px solid rgba(0,109,119,.12)', marginBottom: 32 }}>
              <Icon.Shield size={13} stroke="var(--accent-primary)" />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, fontWeight: 700, letterSpacing: '.2em', textTransform: 'uppercase', color: 'var(--accent-primary)' }}>Enterprise Ready · Free 30-Day Trial</span>
            </div>

            <h2 style={{ fontFamily: "'DM Serif Display', serif", fontSize: 'clamp(40px,6vw,72px)', fontWeight: 400, letterSpacing: '-0.03em', color: 'var(--text-primary)', lineHeight: 1.06, marginBottom: 24 }}>
              Start verifying identities<br />
              <em style={{ color: 'var(--accent-primary)' }}>at global scale today.</em>
            </h2>
            <p style={{ fontSize: 18, color: 'var(--text-tertiary)', maxWidth: 480, margin: '0 auto 52px', lineHeight: 1.75 }}>
              Deploy your first eKYC node in under 15 minutes. No infrastructure team required.
            </p>
            <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/register" className="cta-btn-primary">
                Initialize Your Node
                <Icon.Arrow size={16} stroke="#fff" />
              </a>
              <a href="/demo" className="cta-btn-secondary">
                Request a Live Demo
                <Icon.ChevronRight size={16} stroke="var(--text-primary)" />
              </a>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer style={{ borderTop: '1px solid var(--border)', padding: '72px 56px 40px', background: 'var(--bg-surface)' }}>
          <div style={{ maxWidth: 1080, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: 60, marginBottom: 64 }}>
              {/* Brand */}
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
                  <div style={{ width: 32, height: 32, background: 'var(--accent-primary)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon.Shield size={16} stroke="#EDF6F9" />
                  </div>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, fontWeight: 700, letterSpacing: '.3em', color: 'var(--text-primary)' }}>VeriX</span>
                </div>
                <p style={{ fontSize: 14, color: 'var(--text-tertiary)', lineHeight: 1.75, maxWidth: 260 }}>
                  The next evolution of identity management and regulatory compliance — built for the institutions that move the world.
                </p>
                <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
                  {['AES-256', 'ISO 27001', 'SOC 2'].map(b => (
                    <span key={b} style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, padding: '4px 10px', borderRadius: 100, background: 'var(--bg-muted)', color: 'var(--text-tertiary)', letterSpacing: '.12em' }}>{b}</span>
                  ))}
                </div>
              </div>

              {/* Links */}
              {[
                { title: 'Systems',  links: ['Nodes', 'Ledger', 'Registry', 'API Docs'] },
                { title: 'Company',  links: ['About', 'Blog', 'Careers', 'Contact'] },
                { title: 'Legal',    links: ['Privacy', 'Protocol', 'Terms', 'Security'] },
              ].map(col => (
                <div key={col.title}>
                  <h4 style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, fontWeight: 700, letterSpacing: '.3em', textTransform: 'uppercase', color: 'var(--accent-primary)', marginBottom: 20 }}>{col.title}</h4>
                  {col.links.map(l => (
                    <a key={l} href="/" style={{ display: 'block', fontSize: 13, fontWeight: 500, color: 'var(--text-tertiary)', textDecoration: 'none', marginBottom: 10, transition: 'color .2s' }}
                      onMouseEnter={e => e.currentTarget.style.color = 'var(--text-primary)'}
                      onMouseLeave={e => e.currentTarget.style.color = 'var(--text-tertiary)'}
                    >{l}</a>
                  ))}
                </div>
              ))}
            </div>

            {/* Bottom bar */}
            <div style={{ borderTop: '1px solid var(--border)', paddingTop: 28, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-tertiary)', letterSpacing: '.1em' }}>© 2025 VeriX Cloud, Inc. All rights reserved.</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: 'var(--text-tertiary)', letterSpacing: '.1em' }}>Protocol v2.4 LTS · Delhi_Secure_Node · Uptime 99.98%</span>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}