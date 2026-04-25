'use client';
import { useEffect, useState, useMemo, useCallback } from 'react';
import api from '@/lib/api';
import StatsCard from '@/components/StatsCard';
import AdminDetailPanel from '@/components/AdminDetailPanel';

const FILTER_OPTIONS = [
  { value: 'all', label: 'All Artifacts' },
  { value: 'under_review', label: 'Active Queue' },
  { value: 'approved', label: 'Verified' },
  { value: 'rejected', label: 'Flagged' },
];

export default function AdminPage() {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ total: 0, approved: 0, under_review: 0, rejected: 0, pending: 0 });
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [selectedApp, setSelectedApp] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    try {
      const res = await api.get('/admin/stats');
      setStats(res.data.data);
    } catch (err) { console.error("Stats Sync Error", err); }
  }, []);

  const fetchApplications = useCallback(async () => {
    try {
      const params = { limit: 50 };
      if (filter !== 'all') params.status = filter;
      if (search) params.search = search;
      const res = await api.get('/admin/applications', { params });
      setApplications(res.data.data.applications);
    } catch (err) { console.error("Data Fetch Error", err); }
  }, [filter, search]);

  useEffect(() => {
    const sync = async () => {
      setLoading(true);
      await Promise.all([fetchApplications(), fetchStats()]);
      setLoading(false);
    };
    sync();
  }, [fetchApplications, fetchStats]);

  if (loading && !applications.length) return <AdminSkeleton />;

  return (
    <div className="max-w-[1600px] mx-auto space-y-8 md:space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-1000 px-4 py-6 md:py-12">
      
      {/* ── Premium Header ── */}
      <header className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 pb-6 border-b border-[var(--border)]">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
             <span className="w-8 h-[2px] bg-[var(--accent-primary)] rounded-full" />
             <p className="font-mono text-[9px] md:text-[10px] font-bold text-[var(--accent-primary)] uppercase tracking-[0.3em]">Compliance Node // Delhi_LTS</p>
          </div>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tighter text-[var(--text-primary)] leading-none">
            Verification Registry
          </h1>
          <p className="text-sm text-[var(--text-secondary)] font-medium opacity-70">
            System Overseer: <span className="text-[var(--text-primary)] font-bold">{stats.total} identity lifecycle events</span> indexed.
          </p>
        </div>
        
        <div className="hidden md:flex items-center gap-4 bg-[var(--bg-surface-raised)] px-5 py-3 rounded-2xl border border-[var(--border)] shadow-sm">
           <div className="relative flex items-center justify-center">
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-success)] animate-ping absolute" />
              <div className="w-2.5 h-2.5 rounded-full bg-[var(--accent-success)] relative z-10" />
           </div>
           <span className="font-mono text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em]">Node Status: Secure Handshake</span>
        </div>
      </header>

      {/* ── Bento Metric Grid ── */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6">
        <StatsCard label="Vault Total" value={stats.total} variant="neutral" trend="System Base" />
        <StatsCard label="Verified" value={stats.approved} variant="success" trend="+2.4%" />
        <StatsCard label="In Queue" value={stats.under_review} variant="warning" trend="High Priority" />
        <StatsCard label="Risk Flags" value={stats.rejected} variant="danger" trend="Review Needed" />
        <StatsCard label="Stale Data" value={stats.pending} variant="neutral" trend="Idle" />
      </div>

      {/* ── Control Center ── */}
      <div className="bg-[var(--bg-surface)] p-2 rounded-3xl shadow-xl border border-[var(--border)] flex flex-col xl:flex-row items-center gap-2">
        <div className="relative w-full xl:flex-1">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none opacity-40">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="text-[var(--accent-primary)]"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
          </div>
          <input
            type="text"
            placeholder="Search Identity Hash, Name or Node ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-transparent border-none rounded-xl py-4 pl-14 pr-6 text-sm font-medium focus:ring-0 outline-none placeholder:text-[var(--text-tertiary)]"
          />
        </div>

        <div className="flex w-full xl:w-auto gap-1 p-1 bg-[var(--bg-muted)] rounded-2xl overflow-x-auto no-scrollbar scroll-smooth">
          {FILTER_OPTIONS.map((opt) => (
            <button
              key={opt.value}
              onClick={() => setFilter(opt.value)}
              className={`whitespace-nowrap px-6 py-2.5 text-[9px] md:text-[10px] font-bold uppercase tracking-widest rounded-xl transition-all duration-300 ${filter === opt.value ? 'bg-white text-[var(--accent-primary)] shadow-md border border-[var(--border)]' : 'text-[var(--text-tertiary)] hover:text-[var(--text-secondary)]'}`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ── Registry Surface ── */}
      <div className="bg-white rounded-[2rem] shadow-2xl overflow-hidden border border-[var(--border)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[var(--bg-surface-raised)]/30 border-b border-[var(--border)]">
                {['Entity Identifier', 'Node Hash', 'Status Indicator', ''].map((th) => (
                  <th key={th} className="px-8 py-6 font-mono text-[9px] font-bold text-[var(--text-tertiary)] uppercase tracking-[0.25em]">{th}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]/50">
              {applications.map((app) => (
                <tr 
                  key={app._id} 
                  onClick={() => setSelectedApp(app)}
                  className="group hover:bg-[var(--bg-muted)]/30 transition-all duration-300 cursor-pointer"
                >
                  <td className="px-8 py-5">
                    <div className="flex items-center gap-5">
                      <div className="w-12 h-12 rounded-2xl bg-white border border-[var(--border)] flex items-center justify-center text-[var(--accent-primary)] font-bold text-lg shadow-sm group-hover:shadow-md group-hover:-translate-y-0.5 transition-all">
                        {app.userId?.name?.[0]}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[14px] font-bold text-[var(--text-primary)] group-hover:text-[var(--accent-primary)] transition-colors">{app.userId?.name}</span>
                        <span className="font-mono text-[10px] text-[var(--text-tertiary)] opacity-60">{app.userId?.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="font-mono text-[11px] font-bold text-[var(--text-secondary)] bg-[var(--bg-muted)] px-2 py-1 rounded-md border border-[var(--border)]">
                      {app.referenceNumber}
                    </span>
                  </td>
                  <td className="px-8 py-5">
                    <StatusPill status={app.status} />
                  </td>
                  <td className="px-8 py-5 text-right">
                    <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-transparent border border-transparent group-hover:border-[var(--accent-primary)] group-hover:bg-[var(--accent-primary-light)]/20 transition-all">
                       <span className="text-[9px] font-bold text-[var(--text-tertiary)] group-hover:text-[var(--accent-primary)] uppercase tracking-widest">Open Case</span>
                       <svg className="w-3.5 h-3.5 text-[var(--text-tertiary)] group-hover:text-[var(--accent-primary)] group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="3"><path d="M5 12h14m-7-7 7 7-7 7"/></svg>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {applications.length === 0 && (
            <div className="py-32 flex flex-col items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-[var(--bg-muted)] flex items-center justify-center mb-6 border border-dashed border-[var(--border)]">
                 <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="opacity-20"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
              </div>
              <p className="font-mono text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--text-tertiary)]">Zero Node Records Matches Search</p>
            </div>
          )}
        </div>
      </div>

      {selectedApp && (
        <AdminDetailPanel
          application={selectedApp}
          onClose={() => setSelectedApp(null)}
          onRefresh={() => { fetchApplications(); fetchStats(); }}
        />
      )}
    </div>
  );
}

function StatusPill({ status }) {
  const map = {
    approved: { label: 'Validated', class: 'bg-emerald-50 text-emerald-600 border-emerald-100 shadow-[0_2px_10px_rgba(16,185,129,0.05)]' },
    rejected: { label: 'Flagged', class: 'bg-rose-50 text-rose-600 border-rose-100' },
    under_review: { label: 'In Queue', class: 'bg-amber-50 text-amber-600 border-amber-100' },
  };
  const theme = map[status] || { label: status, class: 'bg-slate-50 text-slate-600 border-slate-200' };

  return (
    <span className={`px-4 py-1.5 rounded-full text-[9px] font-bold uppercase tracking-[0.1em] border ${theme.class}`}>
      {theme.label}
    </span>
  );
}

function AdminSkeleton() {
  return (
    <div className="space-y-12 animate-pulse max-w-[1600px] mx-auto py-16 px-8">
      <div className="space-y-4">
         <div className="h-2 w-32 bg-[var(--bg-muted)] rounded-full" />
         <div className="h-12 w-96 bg-[var(--bg-muted)] rounded-2xl" />
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-6">
        {[...Array(5)].map((_, i) => <div key={i} className="h-32 bg-[var(--bg-muted)] rounded-3xl" />)}
      </div>
      <div className="h-[500px] bg-[var(--bg-muted)] rounded-[2rem]" />
    </div>
  );
}