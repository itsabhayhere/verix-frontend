'use client';

import { useState, useCallback } from 'react';

export default function StepAadhaar({
  files,
  setFiles,
  formData,
  setFormData,
  onNext,
  onBack
}) {
  const [error, setError] = useState('');

  const validateAadhaar = (num) => {
    if (num.length !== 12) return false;
    if (/^(\d)\1+$/.test(num)) return false; // reject repeating digits
    return true;
  };

  const handleFile = useCallback(
    (field, file) => {
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        setError('Only image uploads are allowed');
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setError('File must be under 5MB');
        return;
      }

      setError('');
      setFiles(prev => ({ ...prev, [field]: file }));
    },
    [setFiles]
  );

  const handleIdChange = (e) => {
    let val = e.target.value.replace(/\D/g, '');
    if (val.length > 12) val = val.slice(0, 12);

    setFormData(prev => ({
      ...prev,
      aadhaarNumber: val
    }));

    if (val.length === 12 && !validateAadhaar(val)) {
      setError('Invalid Aadhaar number format');
    } else {
      setError('');
    }
  };

  const canProceed =
    files.aadhaarFront &&
    files.aadhaarBack &&
    validateAadhaar(formData.aadhaarNumber || '');

  const displayId = (formData.aadhaarNumber || '')
    .replace(/(\d{4})(?=\d)/g, '$1 ')
    .trim();

  return (
    <div className="space-y-8 animate-in fade-in duration-500">

      {/* Header */}
      <header>
        <h2 className="text-xl font-bold">
          Identity Document Upload
        </h2>
        <p className="text-sm text-gray-500">
          Ensure all corners of the card are visible.
        </p>
      </header>

      {/* Upload Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <UploadCard
          label="Front View"
          file={files.aadhaarFront}
          onFile={(f) => handleFile('aadhaarFront', f)}
        />

        <UploadCard
          label="Back View"
          file={files.aadhaarBack}
          onFile={(f) => handleFile('aadhaarBack', f)}
        />
      </div>

      {/* Aadhaar Input */}
      <section>
        <label className="text-xs font-semibold">
          Aadhaar Number
        </label>

        <input
          value={displayId}
          onChange={handleIdChange}
          placeholder="0000 0000 0000"
          className="w-full border rounded p-4 font-mono tracking-widest"
        />

        {error && (
          <p className="text-xs text-red-500 mt-2">
            {error}
          </p>
        )}
      </section>

      {/* Footer */}
      <footer className="flex justify-between pt-6 border-t">

        <button
          onClick={onBack}
          className="text-sm text-gray-500"
        >
          ← Return
        </button>

        <button
          disabled={!canProceed}
          onClick={onNext}
          className={`px-6 py-3 rounded ${
            canProceed
              ? 'bg-black text-white'
              : 'bg-gray-200 text-gray-400'
          }`}
        >
          Continue Verification
        </button>

      </footer>
    </div>
  );
}


/* Upload Card */

function UploadCard({ label, file, onFile }) {
  const preview = file
    ? URL.createObjectURL(file)
    : null;

  return (
    <label className="border-2 border-dashed rounded p-6 text-center cursor-pointer">

      <input
        type="file"
        hidden
        accept="image/*"
        onChange={(e) => onFile(e.target.files[0])}
      />

      {preview ? (
        <img
          src={preview}
          alt="preview"
          className="mx-auto h-32 object-contain"
        />
      ) : (
        <p className="text-sm">
          Upload {label}
        </p>
      )}

    </label>
  );
}