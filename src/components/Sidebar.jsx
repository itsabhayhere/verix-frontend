'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/lib/api';

export function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  const [kycStatus, setKycStatus] = useState(null);

  useEffect(() => {
    if (!user) return;
    const syncStatus = async () => {
      try {
        const { data } = await api.get('/kyc/status');
        setKycStatus(data.data?.status || null);
      } catch (e) {
        setKycStatus(null);
      }
    };
    syncStatus();
  }, [user]);

  // UseMemo for nav links to prevent unnecessary re-renders
  const navLinks = useMemo(() => [
    { href: '/dashboard', label: 'Overview', type: 'dashboard' },
    { 
      href: '/kyc/upload', 
      label: 'Identity Vault', 
      type: 'kyc', 
      badge: !kycStatus || kycStatus === 'pending' 
    },
    { href: '/kyc/status', label: 'Status Tracker', type: 'status' },
    ...(user?.role === 'admin' 
      ? [{ href: '/admin', label: 'Administration', type: 'admin' }] 
      : []),
  ], [kycStatus, user?.role]);

  return (
    <aside className="w-[260px] h-full flex flex-col bg-[var(--bg-surface)] border-r border-[var(--border)] overflow-hidden">
      
      {/* ── Brand Identity ── */}
      <header className="p-6 border-b border-[var(--border)] bg-[var(--bg-surface-raised)]">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[var(--text-primary)] shadow-lg shadow-slate-200 flex items-center justify-center text-white font-mono font-bold text-lg">
            V
          </div>
          <div>
            <h2 className="text-sm font-bold tracking-tight text-[var(--text-primary)]">VeriX Cloud</h2>
            <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-tertiary)] font-bold">
              Secure Ledger v2.0
            </span>
          </div>
        </div>
      </header>

      {/* ── Main Navigation ── */}
      <nav className="flex-1 px-4 py-8 space-y-1 overflow-y-auto">
        <p className="px-3 mb-4 font-mono text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-widest">
          Main Console
        </p>
        {navLinks.map((link) => (
          <SidebarLink 
            key={link.href} 
            {...link} 
            active={pathname === link.href} 
          />
        ))}
      </nav>

      {/* ── System Health / Context ── */}
      <div className="px-6 py-4">
        <div className="p-3 bg-[var(--bg-muted)] rounded-[var(--radius-md)] border border-[var(--border)]">
          <div className="flex justify-between items-center mb-1">
             <span className="text-[10px] font-bold text-[var(--text-secondary)] uppercase">Security</span>
             <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-success)] shadow-[0_0_8px_var(--accent-success)]" />
          </div>
          <p className="text-[10px] text-[var(--text-tertiary)]">AES-256 Bit Encryption Active</p>
        </div>
      </div>

      {/* ── User Profile Footer ── */}
      <footer className="p-4 border-t border-[var(--border)] bg-[var(--bg-surface-raised)]">
        <div className="flex items-center gap-3 p-2 rounded-xl border border-transparent hover:border-[var(--border)] hover:bg-white transition-all cursor-pointer group">
          <div className="w-9 h-9 rounded-full bg-[var(--accent-primary-light)] border border-[var(--accent-primary)] flex items-center justify-center text-[var(--accent-primary)] font-bold text-xs">
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-[var(--text-primary)] truncate">{user?.name}</p>
            <p className="text-[10px] text-[var(--text-tertiary)] truncate">{user?.email}</p>
          </div>
          <div className="text-[var(--text-tertiary)] opacity-0 group-hover:opacity-100 transition-opacity">
             <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17"/></svg>
          </div>
        </div>
        <p className="mt-4 px-2 text-[9px] font-mono text-[var(--text-tertiary)] uppercase opacity-60">
          © 2026 VeriX Cloud Node
        </p>
      </footer>
    </aside>
  );
}

// Sub-component for individual links
function SidebarLink({ href, label, type, active, badge }) {
  return (
    <Link
      href={href}
      className={`
        flex items-center gap-3 px-3 py-2.5 rounded-[var(--radius-sm)] transition-all duration-200 group
        ${active 
          ? 'bg-[var(--accent-primary-light)] text-[var(--accent-primary)] border border-[var(--accent-primary)/10]' 
          : 'text-[var(--text-secondary)] hover:bg-[var(--bg-muted)] hover:text-[var(--text-primary)] border border-transparent'}
      `}
    >
      <div className={`transition-transform duration-300 ${active ? 'scale-110' : 'group-hover:scale-110'}`}>
        <NavIcon type={type} active={active} />
      </div>
      <span className={`text-[13px] flex-1 font-medium ${active ? 'font-bold' : ''}`}>
        {label}
      </span>
      {badge && (
        <span className="w-1.5 h-1.5 rounded-full bg-[var(--accent-warning)] animate-pulse shadow-[0_0_6px_var(--accent-warning)]" />
      )}
    </Link>
  );
}

// Semantic Icon System (No Emojis)
function NavIcon({ type, active }) {
  const stroke = active ? 'var(--accent-primary)' : 'currentColor';
  const props = { width: 18, height: 18, stroke, strokeWidth: 2.25, fill: "none", strokeLinecap: "round", strokeLinejoin: "round" };

  switch (type) {
    case 'dashboard': return <svg {...props} viewBox="0 0 24 24"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>;
    case 'kyc': return <svg {...props} viewBox="0 0 24 24"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>;
    case 'status': return <svg {...props} viewBox="0 0 24 24"><path d="M12 20V10"/><path d="M18 20V4"/><path d="M6 20v-4"/></svg>;
    case 'admin': return <svg {...props} viewBox="0 0 24 24"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>;
    default: return null;
  }
}