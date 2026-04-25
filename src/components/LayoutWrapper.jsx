'use client';

import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { Topbar } from '@/components/Topbar';

const STANDALONE_PATHS = ['/','/login', '/register', '/forgot-password'];

export default function LayoutWrapper({ children }) {
  const pathname = usePathname();

  const isStandalone = STANDALONE_PATHS.includes(pathname);
    const isAdminRoute = pathname?.startsWith('/admin');

  // 01. Standalone Render (Auth Pages)
  if (isStandalone) {
    return (
      <main className="min-h-screen bg-[var(--bg-base)] antialiased">
        {children}
      </main>
    );
  }

  return (
    <div className={`
      h-screen w-full overflow-hidden bg-[var(--bg-base)] selection:bg-[var(--accent-primary-light)] selection:text-[var(--accent-primary)]
      ${isAdminRoute ? 'flex flex-col' : 'grid grid-cols-1 md:grid-cols-[280px_1fr]'}
    `}>
      
      {/* ── Conditional Sidebar: Hidden for Admin ── */}
      {!isAdminRoute && (
        <aside className="hidden md:block h-full overflow-y-auto border-r border-[var(--border)] bg-[var(--bg-surface)] z-30 shadow-sm">
          <Sidebar />
        </aside>
      )}

      {/* ── Primary Viewport Context ── */}
      <div className="flex flex-col min-w-0 h-full relative overflow-hidden">
        
        {/* Unified Header: Sticky with Glassmorphism */}
        <header className="sticky top-0 z-40 w-full bg-[var(--bg-surface)]/75 backdrop-blur-xl border-b border-[var(--border)] h-14 flex items-center">
          <div className="w-full px-2">
            {/* You might want to pass an isAdmin prop to Topbar to show Admin-specific tabs */}
            <Topbar isAdmin={isAdminRoute} />
          </div>
        </header>

        {/* ── Main Operations Area ── */}
        <main
          id="primary-canvas"
          className="flex-1 overflow-y-auto overflow-x-hidden scroll-smooth"
        >
          {/* Senior Layout Tip: 
              Admin routes use a wider container (1800px) and a neutral 'island' background 
              to make the white data cards pop. 
          */}
          <div 
            className={`
              mx-auto p-6 md:p-8 lg:p-12 animate-in fade-in slide-in-from-bottom-2 duration-700
              ${isAdminRoute ? 'max-w-[1800px]' : 'max-w-[1400px]'}
            `}
          >
            {children}
          </div>

          {/* Persistent System Footer */}
          <footer className="mt-auto py-10 px-12 border-t border-[var(--border)] bg-[var(--bg-surface-raised)]/30">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 opacity-30 grayscale">
              <div className="flex flex-col items-center md:items-start gap-1">
                <p className="text-[10px] font-mono uppercase tracking-[0.2em] text-[var(--text-tertiary)] font-bold">
                  System Ver: 2.4.5-LTS // Delhi_Node_01
                </p>
                <p className="text-[9px] font-mono text-[var(--text-tertiary)]">
                  Session Type: {isAdminRoute ? 'Privileged_Admin' : 'Standard_User'}
                </p>
              </div>
              <div className="flex gap-8 font-mono text-[9px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">
                 <div className="flex items-center gap-2">
                    <div className="w-1.5 h-1.5 rounded-full bg-[var(--accent-success)] animate-pulse" />
                    <span>Uptime: 99.9%</span>
                 </div>
                 <span>SSL: AES_256</span>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}