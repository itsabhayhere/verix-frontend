'use client';

import { useState, useMemo } from 'react';
import api from '@/lib/api';

const DOC_CONFIG = [
  { label: 'Aadhaar Front', key: 'aadhaarFront', category: 'Identity' },
  { label: 'Aadhaar Back', key: 'aadhaarBack', category: 'Identity' },
  { label: 'PAN Card', key: 'panCard', category: 'Tax' },
  { label: 'Selfie', key: 'selfie', category: 'Biometric' },
];

const FILE_BASE =
  process.env.NEXT_PUBLIC_FILE_URL ||
  "http://localhost:5001/uploads";

const StatusBadge = ({ status }) => {
  const themes = {
    under_review:
      'bg-[var(--accent-warning-light)] text-[var(--accent-warning)] border-amber-200',
    approved:
      'bg-[var(--accent-success-light)] text-[var(--accent-success)] border-emerald-200',
    rejected:
      'bg-[var(--accent-danger-light)] text-[var(--accent-danger)] border-red-200',
    pending:
      'bg-gray-100 text-gray-600 border-gray-200',
  };

  const labelMap = {
    pending: 'Pending',
    under_review: 'Under Review',
    approved: 'Verified',
    rejected: 'Rejected',
  };

  return (
    <span
      className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${
        themes[status] || 'bg-gray-100 text-gray-600'
      }`}
    >
      {labelMap[status] || status}
    </span>
  );
};

export default function AdminDetailPanel({
  application,
  onClose,
  onRefresh,
}) {
  const [notes, setNotes] = useState(application.adminNotes || '');
  const [loading, setLoading] = useState(false);
  const [previewDoc, setPreviewDoc] = useState(null);

  const updateStatus = async (status) => {
    setLoading(true);

    try {
      await api.put(
        `/admin/applications/${application._id}`,
        { status, notes }
      );

      onRefresh();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const docsUploadedCount = useMemo(
    () =>
      DOC_CONFIG.filter(
        (d) => !!application.documents?.[d.key]
      ).length,
    [application]
  );

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 animate-in fade-in duration-300"
        onClick={onClose}
      />

      {/* Side Panel */}
      <aside
        className="
        fixed right-0 top-0 h-full
        w-full sm:w-[420px]
        bg-[var(--bg-surface)]
        z-50 flex flex-col
        shadow-[var(--shadow-lg)]
        border-l border-[var(--border)]
        animate-in slide-in-from-right duration-500
      "
      >
        {/* Header */}
        <div className="p-6 border-b border-[var(--border)] bg-[var(--bg-surface-raised)]">
          <div className="flex items-start justify-between mb-4">

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[var(--accent-primary-light)] border border-[var(--accent-primary)] flex items-center justify-center text-[var(--accent-primary)] font-bold text-lg">
                {application.personalInfo?.name?.[0] || 'U'}
              </div>

              <div>
                <h2 className="text-lg font-bold">
                  {application.personalInfo?.name}
                </h2>

                <p className="font-mono text-[10px] uppercase tracking-tight text-[var(--text-tertiary)]">
                  ID: {application.referenceNumber}
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--bg-muted)] rounded-xl"
            >
              ✕
            </button>
          </div>

          <div className="flex items-center justify-between">
            <StatusBadge status={application.status} />

            <span className="text-[10px] font-mono text-[var(--text-tertiary)]">
              SUBMITTED:{' '}
              {new Date(
                application.submittedAt
              ).toLocaleDateString('en-GB')}
            </span>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-8 pb-32">
          
          {/* Contact Metadata */}
          <section className="space-y-3">
            <h3 className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-tertiary)] font-bold">
              Contact Metadata
            </h3>

            <DetailItem
              label="Primary Mobile"
              value={application.personalInfo?.mobile}
            />

            <DetailItem
              label="Email Address"
              value={application.personalInfo?.email}
            />
          </section>

          {/* Document Manifest */}
          <section className="space-y-4">
            <div className="flex justify-between">
              <h3 className="text-[10px] uppercase tracking-[0.2em] text-[var(--text-tertiary)] font-bold">
                Artifact Manifest
              </h3>

              <span className="text-[10px] font-mono font-bold text-[var(--accent-primary)]">
                {docsUploadedCount}/04 VALIDATED
              </span>
            </div>

            <div className="grid gap-2">
              {DOC_CONFIG.map((doc) => {
                const docPath =
                  application.documents?.[doc.key];

                const isPresent = !!docPath;

                return (
                  <button
                    key={doc.key}
                    disabled={!isPresent}
                    onClick={() =>
                      isPresent &&
                      setPreviewDoc(docPath)
                    }
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all text-left group
                      ${
                        isPresent
                          ? 'bg-[var(--bg-surface)] border-[var(--border)] hover:border-[var(--accent-primary)] cursor-pointer'
                          : 'bg-[var(--bg-muted)] opacity-60 cursor-not-allowed'
                      }
                    `}
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-2 h-2 rounded-full ${
                          isPresent
                            ? 'bg-[var(--accent-success)]'
                            : 'bg-gray-400'
                        }`}
                      />

                      <div>
                        <p className="text-xs font-bold">
                          {doc.label}
                        </p>

                        <p className="text-[9px] uppercase tracking-widest text-[var(--text-tertiary)]">
                          {doc.category}
                        </p>
                      </div>
                    </div>

                    {isPresent && (
                      <span className="text-xs opacity-60">
                        View
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          {/* Notes */}
          <section>
            <textarea
              value={notes}
              onChange={(e) =>
                setNotes(e.target.value)
              }
              placeholder="Add review notes..."
              className="w-full h-24 p-4 text-xs border rounded-xl"
            />
          </section>
        </div>

        {/* Footer Actions */}
        {['pending','under_review','approved','rejected'].includes(application.status) && (
          <div className="
          sticky bottom-0 left-0 right-0
          p-4 sm:p-6
          border-t border-[var(--border)]
          bg-[var(--bg-surface)]
          grid grid-cols-3 gap-3 sm:gap-4
          ">

            <button
              onClick={() => updateStatus('under_review')}
              disabled={loading}
              className="py-3 rounded-xl text-xs font-bold border text-amber-600"
            >
              Mark Under Review
            </button>

            <button
              onClick={() => updateStatus('rejected')}
              disabled={loading}
              className="py-3 rounded-xl text-xs font-bold border text-red-600"
            >
              Reject Case
            </button>

            <button
              onClick={() => updateStatus('approved')}
              disabled={loading}
              className="py-3 rounded-xl text-xs font-bold bg-black text-white"
            >
              {loading
                ? 'Processing...'
                : 'Confirm Approval'}
            </button>

          </div>
        )}
      </aside>

{/* Document Preview Modal */}
{previewDoc && (
  <>
    {console.log("Preview doc:", previewDoc)}

    <div
      className="fixed inset-0 bg-black/70 z-[60] flex items-center justify-center"
      onClick={() => setPreviewDoc(null)}
    >
      <img
        src={
          previewDoc.startsWith("http")
            ? previewDoc
            : `${FILE_BASE}/${previewDoc}`
        }
        className="max-h-[85vh] max-w-[95vw] sm:max-w-[80vw] rounded-xl shadow-2xl object-contain"
        alt="Document Preview"
      />
    </div>
  </>
)}
    </>
  );
}

/* Helper Component */

function DetailItem({ label, value }) {
  return (
    <div className="flex justify-between text-[11px]">
      <span className="text-gray-400">
        {label}
      </span>

      <span className="font-mono font-bold">
        {value || 'NOT_SET'}
      </span>
    </div>
  );
}