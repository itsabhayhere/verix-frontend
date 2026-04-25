'use client';

import { useState, useCallback } from 'react';
import api from '@/lib/api';

// Step Components
import StepPersonalInfo from '@/components/StepPersonalInfo';
import StepAadhaar from '@/components/StepAadhaar';
import StepPan from '@/components/StepPan';
import StepSelfie from '@/components/StepSelfie';
import StepOTP from '@/components/StepOTP';
import SuccessState from '@/components/SuccessState';

const STEPS = [
  { id: 1, label: 'Profile', key: 'personal' },
  { id: 2, label: 'Identity', key: 'aadhaar' },
  { id: 3, label: 'Tax ID', key: 'pan' },
  { id: 4, label: 'Biometrics', key: 'selfie' },
  { id: 5, label: 'Verification', key: 'otp' },
];

export default function KYCUploadPage() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({});
  const [files, setFiles] = useState({});
  const [loading, setLoading] = useState(false);
  const [referenceNumber, setReferenceNumber] = useState('');

  const nextStep = useCallback(
    () => setStep((s) => Math.min(s + 1, STEPS.length + 1)),
    []
  );

  const prevStep = useCallback(
    () => setStep((s) => Math.max(s - 1, 1)),
    []
  );

  const handleFinalSubmit = async () => {
    setLoading(true);

    try {
      const payload = new FormData();

      Object.entries(formData).forEach(([key, value]) =>
        payload.append(key, value)
      );

      ['aadhaarFront', 'aadhaarBack', 'panCard', 'selfie'].forEach((fileKey) => {
        if (files[fileKey]) payload.append(fileKey, files[fileKey]);
      });

      const { data } = await api.post('/kyc/submit', payload);

      setReferenceNumber(data.data.referenceNumber);

      nextStep();
    } catch (err) {
      console.error('Submission Error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (step > STEPS.length) {
    return <SuccessState referenceNumber={referenceNumber} />;
  }

  return (
    <div className="max-w-[720px] mx-auto py-12 px-4 space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <div className="text-center space-y-2 mb-10">
        <h2 className="text-2xl font-bold tracking-tight text-[var(--text-primary)]">
          Complete Identity Verification
        </h2>
        <p className="text-sm text-[var(--text-secondary)]">
          Please provide valid government-issued documents to proceed.
        </p>
      </div>

      {/* Progress Tracker */}
      <nav aria-label="Progress" className="relative">
        <div className="absolute top-[14px] left-0 w-full h-[2px] bg-[var(--border)] -z-10" />

        <div
          className="absolute top-[14px] left-0 h-[2px] bg-[var(--accent-primary)] -z-10 transition-all duration-500"
          style={{
            width: `${((step - 1) / (STEPS.length - 1)) * 100}%`,
          }}
        />

        <ul className="flex justify-between list-none p-0">
          {STEPS.map((s) => {
            const isCompleted = step > s.id;
            const isActive = step === s.id;

            return (
              <li key={s.id} className="flex flex-col items-center group">
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-[11px] font-mono font-bold transition-all duration-300 border-2
                  ${
                    isCompleted
                      ? 'bg-[var(--accent-success)] border-[var(--accent-success)] text-white'
                      : isActive
                      ? 'bg-[var(--bg-surface)] border-[var(--accent-primary)] text-[var(--accent-primary)] shadow-[0_0_0_4px_var(--accent-primary-light)]'
                      : 'bg-[var(--bg-surface)] border-[var(--border-strong)] text-[var(--text-tertiary)]'
                  }`}
                >
                  {isCompleted ? '✓' : s.id}
                </div>

                <span
                  className={`mt-3 text-[10px] uppercase tracking-widest font-bold hidden md:block
                  ${
                    isActive
                      ? 'text-[var(--accent-primary)]'
                      : 'text-[var(--text-tertiary)]'
                  }`}
                >
                  {s.label}
                </span>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Form Container */}
      <main className="bg-[var(--bg-surface)] border border-[var(--border)] rounded-[var(--radius-lg)] shadow-[var(--shadow-lg)] overflow-hidden">

        {/* Status Bar */}
        <div className="px-8 py-4 bg-[var(--bg-surface-raised)] border-b border-[var(--border)] flex justify-between items-center">
          <span className="font-mono text-[10px] text-[var(--text-tertiary)] uppercase font-bold">
            System Status: Secure Session
          </span>

          <span className="font-mono text-[10px] text-[var(--accent-primary)] font-bold">
            PART_{step}.0{STEPS.length}
          </span>
        </div>

        <div className="p-8 md:p-12">

          {step === 1 && (
            <StepPersonalInfo
              data={formData}
              setData={setFormData}
              onNext={nextStep}
            />
          )}

          {step === 2 && (
            <StepAadhaar
              files={files}
              setFiles={setFiles}
              formData={formData}          // ✅ add this

              setFormData={setFormData}   // ✅ FIXED
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {step === 3 && (
            <StepPan
              files={files}
              setFiles={setFiles}
              
              setFormData={setFormData}   // ✅ FIXED
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {step === 4 && (
            <StepSelfie
              files={files}
              setFiles={setFiles}
              onNext={nextStep}
              onBack={prevStep}
            />
          )}

          {step === 5 && (
            <StepOTP
              mobile={formData.mobile}
              onVerify={handleFinalSubmit}
              onBack={prevStep}
              loading={loading}
            />
          )}

        </div>
      </main>

      {/* Footer */}
      <footer className="text-center">
        <p className="text-[11px] text-[var(--text-tertiary)] flex items-center justify-center gap-2">
          🔒 Your data is encrypted with AES-256 standard.
        </p>
      </footer>
    </div>
  );
}