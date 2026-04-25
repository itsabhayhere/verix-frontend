'use client';
import { useEffect, useState, useMemo } from 'react';
import Link from 'next/link';
import api from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

// Standardized UI Components
import StatsCard from '@/components/StatsCard';
import KYCProgressCard from '@/components/KYCProgressCard';
import QuickActions from '@/components/QuickActions';

export default function DashboardPage() {
  const { user } = useAuth();
  const [kycData, setKycData] = useState(null);
  const [stats, setStats] = useState({ submitted: 0, approved: 0, pending: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kycRes, statsRes] = await Promise.all([
          api.get('/kyc/my'),
          api.get('/kyc/status').catch(() => null),
        ]);
        if (kycRes.data.data) setKycData(kycRes.data.data);
        if (statsRes?.data.data) setStats(statsRes.data.data);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const kycPending = useMemo(() => !kycData || kycData.status === 'pending', [kycData]);
  const initials = useMemo(() => user?.name?.split(' ').map(n => n[0]).join('').toUpperCase() || 'V', [user]);

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-in fade-in duration-1000">
      
      {/* ── Architectural Header ── */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-[var(--border)]">
        <div className="flex items-center gap-6">
          <div className="relative group">
            <div className="w-16 h-16 rounded-[var(--radius-lg)] bg-white border border-[var(--border)] flex items-center justify-center text-[var(--accent-primary)] font-bold text-xl shadow-[var(--shadow-premium)] group-hover:rotate-3 transition-transform duration-500">
              {initials}
            </div>
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[var(--accent-secondary)] border-4 border-[var(--bg-base)] rounded-full shadow-sm" />
          </div>
          <div className="space-y-1">
            <p className="font-mono text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-[0.3em]">Identity Hub</p>
            <h1 className="text-3xl font-extrabold tracking-tight text-[var(--text-primary)]">
              Welcome back, {user?.name.split(' ')[0]}
            </h1>
          </div>
        </div>
        
        <div className="flex gap-3">
          <button className="px-5 py-2.5 text-[10px] font-bold uppercase tracking-widest text-[var(--text-secondary)] bg-white border border-[var(--border)] rounded-full hover:bg-[var(--bg-surface-raised)] hover:border-[var(--border-strong)] transition-all shadow-sm">
            Export Logs
          </button>
        </div>
      </header>

      {/* ── Whimsical Engagement Banner ── */}
      {kycPending && (
        <div className="relative overflow-hidden rounded-[var(--radius-lg)] bg-white border border-[var(--border)] p-8 shadow-[var(--shadow-premium)] animate-float">
          {/* Decorative Background Blob */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-[var(--accent-soft)] rounded-full blur-[80px] -mr-32 -mt-32 opacity-40" />
          
          <div className="flex flex-col md:flex-row items-center gap-8 relative z-10 text-center md:text-left">
            <div className="w-16 h-16 rounded-2xl bg-[var(--accent-soft)] flex items-center justify-center text-[var(--accent-vibrant)] shadow-inner">
               <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>
            </div>
            <div className="flex-1 space-y-1">
              <h3 className="text-lg font-bold text-[var(--text-primary)] tracking-tight">Protect Your Account</h3>
              <p className="text-sm text-[var(--text-secondary)] opacity-80 max-w-md">Complete your identity verification to enable secure withdrawals and institutional-grade features.</p>
            </div>
            <Link
              href="/kyc/upload"
              className="px-8 py-3.5 bg-[var(--accent-vibrant)] text-white text-[11px] font-bold uppercase tracking-widest rounded-full hover:scale-105 hover:shadow-[0_10px_20px_rgba(226,149,120,0.3)] transition-all active:scale-95"
            >
              Verify Identity →
            </Link>
          </div>
        </div>
      )}

      {/* ── Metric Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        <StatsCard label="Ledger Entries" value={kycData ? 1 : 0} variant="neutral" trend="Total" />
        <StatsCard label="Account State" value={kycData?.status === 'approved' ? 'Verified' : 'Idle'} variant={kycData?.status === 'approved' ? 'success' : 'neutral'} />
        <StatsCard label="Review Queue" value={kycData?.status === 'under_review' ? 1 : 0} variant="warning" />
        <StatsCard label="Alerts" value={kycData?.status === 'rejected' ? 1 : 0} variant="danger" />
      </div>

      {/* ── Secondary Layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2">
          <div className="bg-white rounded-[var(--radius-lg)] border border-[var(--border)] shadow-[var(--shadow-premium)] overflow-hidden">
             <div className="px-8 py-4 border-b border-[var(--border)] bg-[var(--bg-surface-raised)]">
                <span className="font-mono text-[9px] font-bold text-[var(--accent-primary)] uppercase tracking-widest">Processing_Timeline</span>
             </div>
             <KYCProgressCard kycData={kycData} />
          </div>
        </div>
        <div className="lg:col-span-1">
          <QuickActions />
        </div>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto space-y-12 animate-pulse py-10 px-6">
      <div className="flex items-center gap-6">
        <div className="w-16 h-16 bg-white border border-slate-100 rounded-[var(--radius-lg)]" />
        <div className="space-y-3">
          <div className="h-2 w-24 bg-slate-100 rounded" />
          <div className="h-6 w-64 bg-slate-100 rounded" />
        </div>
      </div>
      <div className="grid grid-cols-4 gap-6">
        {[1, 2, 3, 4].map(i => <div key={i} className="h-32 bg-white border border-slate-100 rounded-[var(--radius-lg)]" />)}
      </div>
    </div>
  );
}