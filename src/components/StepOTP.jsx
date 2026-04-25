'use client';

import { useState, useRef, useEffect } from 'react';
import api from '@/lib/api';

export default function StepOTP({
  mobile,
  onVerify,
  onBack,
  loading
}) {
  const [otp, setOtp] = useState(Array(6).fill(''));
  const [timer, setTimer] = useState(30);
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const inputsRef = useRef([]);

  /* AUTO SEND OTP */

  useEffect(() => {
    if (mobile) {
      api.post('/otp/send', { mobile });
    }
  }, [mobile]);

  /* COUNTDOWN */

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(
      () => setTimer(t => t - 1),
      1000
    );

    return () => clearInterval(interval);
  }, [timer]);

  const focusInput = index =>
    inputsRef.current[index]?.focus();

  /* INPUT CHANGE */

  const handleChange = (index, value) => {
    const char = value.slice(-1);

    if (isNaN(char)) return;

    const newOtp = [...otp];
    newOtp[index] = char;

    setOtp(newOtp);

    if (char && index < 5) {
      focusInput(index + 1);
    }
  };

  /* BACKSPACE NAVIGATION */

  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      focusInput(index - 1);
    }
  };

  /* PASTE SUPPORT */

  const handlePaste = e => {
    e.preventDefault();

    const data = e.clipboardData
      .getData('text')
      .slice(0, 6)
      .split('');

    if (data.some(c => isNaN(c))) return;

    setOtp(data);
    focusInput(Math.min(data.length, 5));
  };

  /* RESEND OTP */

  const handleResend = async () => {
    await api.post('/otp/send', { mobile });

    setTimer(30);
    setOtp(Array(6).fill(''));
    setError('');

    focusInput(0);
  };

  /* VERIFY OTP */

  const handleVerify = async () => {
    const code = otp.join('');

    if (code.length !== 6) return;

    setVerifying(true);
    setError('');

    try {
      await api.post('/otp/verify', {
        mobile,
        otp: code
      });

      onVerify(); // proceed only if valid

    } catch {
      setError('Invalid or expired OTP');
    }

    setVerifying(false);
  };

  const isComplete = otp.every(v => v !== '');

  const maskedMobile = mobile
    ? `+91 ••••• •${mobile.slice(-4)}`
    : 'your mobile';

  return (
    <div className="space-y-10">

      {/* HEADER */}

      <div className="text-center">
        <h2 className="text-xl font-bold">
          Secure Authentication
        </h2>

        <p className="text-sm text-gray-500">
          Code sent to {maskedMobile}
        </p>
      </div>

      {/* OTP INPUT */}

      <div
        className="flex justify-center gap-3"
        onPaste={handlePaste}
      >
        {otp.map((digit, i) => (
          <input
            key={i}
            ref={el => (inputsRef.current[i] = el)}
            value={digit}
            onChange={e =>
              handleChange(i, e.target.value)
            }
            onKeyDown={e =>
              handleKeyDown(e, i)
            }
            className="w-12 h-16 text-center text-2xl border rounded"
          />
        ))}
      </div>

      {/* ERROR */}

      {error && (
        <p className="text-center text-sm text-red-500">
          {error}
        </p>
      )}

      {/* RESEND */}

      <div className="text-center">
        {timer > 0 ? (
          <span className="text-xs text-gray-400">
            Resend in {timer}s
          </span>
        ) : (
          <button
            onClick={handleResend}
            className="text-xs text-indigo-600"
          >
            Request new code
          </button>
        )}
      </div>

      {/* FOOTER */}

      <footer className="flex justify-between pt-6 border-t">

        <button
          onClick={onBack}
          className="text-sm text-gray-400"
        >
          Cancel
        </button>

        <button
          disabled={!isComplete || verifying || loading}
          onClick={handleVerify}
          className="px-6 py-3 bg-black text-white rounded disabled:opacity-40"
        >
          {verifying
            ? 'Verifying...'
            : 'Complete Submission'}
        </button>

      </footer>

    </div>
  );
}