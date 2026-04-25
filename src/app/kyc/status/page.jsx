'use client';
import { useEffect, useState, useMemo } from 'react';
import api from '@/lib/api';
import Link from 'next/link';

// Semantic sub-components
import StatusBanner from '@/components/StatusBanner';
import VerificationTimeline from '@/components/VerificationTimeline';
import SubmittedDocuments from '@/components/SubmittedDocuments';

/**
 * Masking utility to maintain security and privacy on the UI
 */
const maskValue = (value, visibleChars = 4) => {
  if (!value) return '—';
  const str = String(value);
  if (str.length <= visibleChars) return str;
  return `•••• •••• ${str.slice(-visibleChars)}`;
};

export default function KYCStatusPage() {
  const [kycData, setKycData] = useState(null);
  const [loading, setLoading] = useState(true);

  // Memoized detail mapping for performance and clean masking
  const details = useMemo(() => {
    if (!kycData) return [];
    return [
      { label: 'Holder Name', value: kycData.personalInfo?.name },
      { label: 'Date of Birth', value: kycData.personalInfo?.dob },
      { label: 'Verified Mobile', value: kycData.personalInfo?.mobile ? `+91 ••••• •${kycData.personalInfo.mobile.slice(-4)}` : null },
      { label: 'Identity ID', value: maskValue(kycData.documents?.aadhaarNumber) },
      { label: 'Tax ID (PAN)', value: maskValue(kycData.documents?.panNumber) },
      { label: 'Filing Date', value: kycData.submittedAt ? new Date(kycData.submittedAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : null },
    ];
  }, [kycData]);

  const fetchData = async () => {
    try {
      const res = await api.get('/kyc/my');
      if (res.data?.data) setKycData(res.data.data);
    } catch (err) {
      console.error("Failed to sync KYC status");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 30000); // Polling for status updates
    return () => clearInterval(interval);
  }, []);

  if (loading) return <StatusSkeleton />;

  if (!kycData) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-6 text-center border-2 border-dashed border-[var(--border)] rounded-[var(--radius-lg)]">
        <p className="text-sm text-[var(--text-tertiary)] mb-4">No active verification record found.</p>
        <Link href="/kyc/upload" className="text-[var(--accent-primary)] font-bold text-sm hover:underline underline-offset-4">
          Initiate eKYC Process →
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-3 duration-700">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-1">
          <nav className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-widest text-[var(--text-tertiary)]">
            <span>Portal</span>
            <span className="opacity-40">/</span>
            <span className="text-[var(--text-secondary)]">Verification Status</span>
          </nav>
          <h1 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
            Application Overview
          </h1>
        </div>
        
        <div className="flex items-center gap-3 bg-[var(--bg-surface)] px-4 py-2 rounded-[var(--radius-md)] border border-[var(--border)] shadow-[var(--shadow-sm)]">
          <span className="text-[10px] font-bold text-[var(--text-tertiary)] uppercase tracking-tighter">Ref ID:</span>
          <span className="font-mono text-xs font-bold text-[var(--accent-primary)]">{kycData.referenceNumber}</span>
        </div>
      </div>

      <StatusBanner kycData={kycData} />

      {/* Modern Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Col: The Journey */}
        <div className="lg:col-span-7 space-y-8">
          <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] p-6">
             <VerificationTimeline timeline={kycData.timeline} status={kycData.status} />
          </section>
          
          {/* Help/Support in context */}
          <div className="p-6 bg-[var(--bg-surface-raised)] border border-[var(--border)] rounded-[var(--radius-lg)] flex items-center justify-between gap-4">
             <div>
                <h4 className="text-sm font-bold text-[var(--text-primary)]">Experiencing delays?</h4>
                <p className="text-xs text-[var(--text-secondary)]">Typical review time is 2-4 business hours.</p>
             </div>
             <div className="flex gap-2">
                <button className="p-2 hover:bg-white rounded-lg transition-colors border border-transparent hover:border-[var(--border)]">
                   <svg className="w-5 h-5 text-[var(--text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.855-1.246L3 20l1.225-4.947A8.94 8.94 0 013 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"/></svg>
                </button>
             </div>
          </div>
        </div>

        {/* Right Col: Data & Artifacts */}
        <div className="lg:col-span-5 space-y-8">
          <section className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-md)] overflow-hidden">
            <div className="px-6 py-4 border-b border-[var(--border)] bg-[var(--bg-surface-raised)] flex justify-between items-center">
              <h3 className="font-mono text-[10px] font-bold uppercase tracking-widest text-[var(--text-tertiary)]">Record Details</h3>
              <div className="w-2 h-2 rounded-full bg-[var(--accent-success)] animate-pulse" title="Live Synced" />
            </div>
            
            <div className="p-6 space-y-1">
              {details.map((row, i) => (
                <div key={row.label} className={`flex justify-between py-3 ${i !== details.length - 1 ? 'border-b border-[var(--border)] border-dashed' : ''}`}>
                  <span className="text-xs text-[var(--text-secondary)]">{row.label}</span>
                  <span className="text-xs font-bold text-[var(--text-primary)] font-mono">{row.value || '—'}</span>
                </div>
              ))}
            </div>
          </section>

          <SubmittedDocuments kycData={kycData} />
        </div>
      </div>
    </div>
  );
}

function StatusSkeleton() {
   return (
      <div className="max-w-6xl mx-auto space-y-8 animate-pulse">
         <div className="h-12 w-1/3 bg-[var(--bg-muted)] rounded-lg" />
         <div className="h-32 w-full bg-[var(--bg-muted)] rounded-[var(--radius-lg)]" />
         <div className="grid grid-cols-2 gap-8">
            <div className="h-96 bg-[var(--bg-muted)] rounded-[var(--radius-lg)]" />
            <div className="h-96 bg-[var(--bg-muted)] rounded-[var(--radius-lg)]" />
         </div>
      </div>
   );
}