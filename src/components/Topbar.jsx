'use client';

import { useState, useRef, useEffect } from 'react';
import { useAuth } from '@/context/AuthContext';
import { usePathname, useRouter } from 'next/navigation';
import api from '@/lib/api';

export function Topbar() {
  const { user, setUser } = useAuth(); // Access setUser to manually clear state if needed
  const pathname = usePathname();
  const router = useRouter();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const menuRef = useRef(null);
  
  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
  
      await api.post('/auth/logout');
  
      setUser(null); // now guaranteed available
  
      router.replace('/login');
      router.refresh();
  
    } catch (error) {
      console.error("Logout Failed:", error);
  
      setUser(null);
      router.replace('/login');
  
    } finally {
      setIsLoggingOut(false);
      setIsMenuOpen(false);
    }
  };

  // Click outside listener
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setIsMenuOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getBreadcrumb = () => {
    const parts = pathname.split('/').filter(Boolean);
    return parts.length > 0
      ? parts.map(p => p.charAt(0).toUpperCase() + p.slice(1)).join(' / ')
      : 'Overview';
  };

  return (
    <header className="sticky top-0 z-50 h-14 w-full bg-white/80 backdrop-blur-xl border-b border-[var(--border)] px-6 flex items-center justify-between">
      
      {/* Left: Context Navigation */}
      <nav className="flex items-center gap-2 font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--accent-primary)]">
        <span className="opacity-50">VeriX</span>
        <span className="opacity-20 text-[var(--text-primary)]">/</span>
        <span className="text-[var(--text-secondary)] tracking-normal font-sans text-[11px] font-medium">
          {getBreadcrumb()}
        </span>
      </nav>

      {/* Right: User Identity & Actions */}
      <div className="relative" ref={menuRef}>
        <button 
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          disabled={isLoggingOut}
          className={`flex items-center gap-3 p-1 rounded-full transition-all duration-300 ${isMenuOpen ? 'bg-[var(--bg-muted)]' : 'hover:bg-[var(--bg-muted)]'}`}
        >
          <div className="flex flex-col items-end hidden sm:flex pl-2">
            <span className="text-[11px] font-bold text-[var(--text-primary)] leading-none">
              {user?.name?.split(' ')[0] || 'Account'}
            </span>
            <span className="text-[9px] font-mono font-bold text-[var(--accent-secondary)] uppercase tracking-tighter">
              {user?.role || 'Member'}_Node
            </span>
          </div>

          <div className="w-8 h-8 rounded-full bg-white border border-[var(--border)] shadow-[var(--shadow-premium)] flex items-center justify-center text-[11px] font-bold text-[var(--accent-primary)] font-mono">
            {isLoggingOut ? '...' : (user?.name?.charAt(0).toUpperCase() || 'A')}
          </div>
        </button>

        {/* Dropdown Menu */}
        {isMenuOpen && (
          <div className="absolute right-0 mt-3 w-60 bg-white/95 backdrop-blur-xl border border-[var(--border)] rounded-[var(--radius-md)] shadow-[var(--shadow-premium)] py-2 animate-in fade-in zoom-in-95 duration-200">
            <div className="px-4 py-3 border-b border-[var(--border)] mb-1">
              <p className="text-[9px] font-mono font-bold text-[var(--text-tertiary)] uppercase tracking-widest">Active Session</p>
              <p className="text-[12px] font-bold text-[var(--text-primary)] truncate">{user?.email}</p>
            </div>

            <button className="w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold text-[var(--text-secondary)] hover:bg-[var(--bg-base)] transition-colors uppercase tracking-widest">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1Z"/></svg>
              Settings
            </button>

            {/* Logout Action */}
            <button 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className={`w-full flex items-center gap-3 px-4 py-2.5 text-[11px] font-bold text-[var(--accent-vibrant)] hover:bg-[var(--accent-soft)]/30 transition-colors uppercase tracking-widest border-t border-[var(--border)] mt-1 ${isLoggingOut ? 'opacity-50' : ''}`}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              {isLoggingOut ? 'Terminating...' : 'Terminate Session'}
            </button>
          </div>
        )}
      </div>
    </header>
  );
}