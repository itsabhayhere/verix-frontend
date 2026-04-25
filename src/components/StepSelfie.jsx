'use client';

import { useState, useRef, useCallback, useEffect, useMemo } from 'react';

export default function StepSelfie({ files, setFiles, onNext, onBack }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const [stream, setStream] = useState(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [preview, setPreview] = useState(null);

  const startCamera = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user' },
        audio: false,
      });
      setStream(mediaStream);
      setIsCameraActive(true);
    } catch (err) {
      alert('Camera access is required for biometric verification.');
      console.error(err);
    }
  };

  useEffect(() => {
    if (isCameraActive && videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [isCameraActive, stream]);

  const stopCamera = useCallback(() => {
    stream?.getTracks().forEach(track => track.stop());
    setIsCameraActive(false);
  }, [stream]);

  const capturePhoto = useCallback(() => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d');
    
    // Mirroring the context to match the mirrored video feed
    ctx.translate(canvas.width, 0);
    ctx.scale(-1, 1);
    ctx.drawImage(video, 0, 0);

    canvas.toBlob(blob => {
      if (!blob) return;
      const file = new File([blob], 'selfie.jpg', { type: 'image/jpeg' });
      setFiles(prev => ({ ...prev, selfie: file }));
      setPreview(URL.createObjectURL(blob));
      stopCamera();
    }, 'image/jpeg', 0.95);
  }, [stream, setFiles, stopCamera]);

  useEffect(() => {
    return () => stream?.getTracks().forEach(track => track.stop());
  }, [stream]);

  return (
    <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-1000">

      {/* ── Architectural Header ── */}
      <header className="flex items-start gap-4 pb-2">
        <div className="w-1 h-12 bg-[var(--accent-primary)] rounded-full hidden md:block" />
        <div className="space-y-1">
          <h2 className="text-2xl font-extrabold tracking-tight text-[var(--text-primary)]">
            Biometric Session
          </h2>
          <p className="text-sm text-[var(--text-secondary)] font-medium opacity-80">
            Initialize liveness check. Ensure your face is clearly illuminated.
          </p>
        </div>
      </header>

      {/* ── Viewport Canvas ── */}
      <div className="relative aspect-square md:aspect-[4/3] bg-[var(--bg-muted)] rounded-[var(--radius-lg)] overflow-hidden shadow-[var(--shadow-premium)] border border-[var(--border)]">
        
        {preview ? (
          <img src={preview} alt="Identity Artifact" className="w-full h-full object-cover animate-in zoom-in-95 duration-500" />
        ) : isCameraActive ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full object-cover scale-x-[-1]" // Mirrored for natural user feel
            />

            {/* Organic Biometric Guide */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[200px] h-[260px] border-[3px] border-[var(--accent-primary)] rounded-[100px/130px] opacity-40 animate-cyber-pulse shadow-[0_0_0_1000px_rgba(0,109,119,0.3)]" />
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full text-center mt-40">
                <span className="font-mono text-[9px] font-bold text-white uppercase tracking-[0.3em] bg-[var(--accent-primary)]/40 px-3 py-1 rounded-full backdrop-blur-md">
                  Align Center
                </span>
              </div>
            </div>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-4 text-[var(--text-tertiary)]">
            <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-sm text-[var(--accent-primary)]">
               <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            </div>
            <p className="font-mono text-[10px] font-bold uppercase tracking-widest">Device_Camera_Idle</p>
          </div>
        )}

        <canvas ref={canvasRef} className="hidden" />
      </div>

      {/* ── Command Controls ── */}
      <div className="flex flex-col sm:flex-row gap-4">

        {!preview && !isCameraActive && (
          <button
            onClick={startCamera}
            className="flex-1 px-10 py-4 bg-[var(--accent-primary)] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:scale-[1.02] transition-all shadow-lg"
          >
            Initialize Device Camera
          </button>
        )}

        {isCameraActive && !preview && (
          <>
            <button
              onClick={capturePhoto}
              className="flex-1 px-10 py-4 bg-[var(--accent-vibrant)] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full hover:shadow-[0_10px_20px_rgba(226,149,120,0.3)] transition-all animate-fade-in"
            >
              Capture Artifact
            </button>

            <button
              onClick={stopCamera}
              className="px-8 py-4 border border-[var(--border-strong)] text-[var(--text-tertiary)] text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[var(--bg-muted)] transition-all"
            >
              Terminate
            </button>
          </>
        )}

        {preview && (
          <>
            <button
              onClick={onNext}
              className="flex-1 px-10 py-4 bg-[var(--accent-primary)] text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-full shadow-lg hover:-translate-y-1 transition-all"
            >
              Accept & Continue →
            </button>

            <button
              onClick={() => { setPreview(null); startCamera(); }}
              className="px-8 py-4 border border-[var(--border-strong)] text-[var(--text-tertiary)] text-[10px] font-bold uppercase tracking-widest rounded-full hover:bg-[var(--bg-muted)] transition-all"
            >
              Retry
            </button>
          </>
        )}

      </div>

      {/* ── Navigation ── */}
      <button
        onClick={onBack}
        className="flex items-center gap-2 font-mono text-[9px] font-bold uppercase tracking-[0.2em] text-[var(--text-tertiary)] hover:text-[var(--accent-primary)] transition-colors"
      >
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
        Back to Documents
      </button>

    </div>
  );
}