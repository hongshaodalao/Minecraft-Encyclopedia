import { useState, useRef, useCallback } from 'react';

interface ProgressBarProps {
  onComplete: () => void;
  duration?: number;
}

export function ProgressBar({ onComplete, duration = 1500 }: ProgressBarProps) {
  const [pressing, setPressing] = useState(false);
  const [progress, setProgress] = useState(0);
  const timerRef = useRef<number | null>(null);
  const startTimeRef = useRef<number>(0);
  const frameRef = useRef<number>(0);

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    if (frameRef.current) {
      cancelAnimationFrame(frameRef.current);
      frameRef.current = 0;
    }
  }, []);

  const updateProgress = useCallback(() => {
    const elapsed = Date.now() - startTimeRef.current;
    const pct = Math.min(elapsed / duration, 1);
    setProgress(pct);

    if (pct < 1) {
      frameRef.current = requestAnimationFrame(updateProgress);
    }
  }, [duration]);

  const handleStart = useCallback(() => {
    setPressing(true);
    setProgress(0);
    startTimeRef.current = Date.now();
    frameRef.current = requestAnimationFrame(updateProgress);

    timerRef.current = window.setTimeout(() => {
      cleanup();
      setPressing(false);
      setProgress(0);
      onComplete();
    }, duration);
  }, [duration, onComplete, cleanup, updateProgress]);

  const handleEnd = useCallback(() => {
    cleanup();
    setPressing(false);
    setProgress(0);
  }, [cleanup]);

  const radius = 36;
  const circumference = 2 * Math.PI * radius;

  return (
    <div
      className="touch-target relative inline-flex items-center justify-center"
      onPointerDown={handleStart}
      onPointerUp={handleEnd}
      onPointerLeave={handleEnd}
      onPointerCancel={handleEnd}
      role="button"
      tabIndex={0}
      aria-label="长按返回首页"
    >
      <svg
        className="absolute w-20 h-20 -rotate-90"
        viewBox="0 0 80 80"
      >
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="rgba(255,255,255,0.3)"
          strokeWidth="4"
        />
        <circle
          cx="40"
          cy="40"
          r={radius}
          fill="none"
          stroke="#FFD93D"
          strokeWidth="4"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - progress)}
          style={{ transition: pressing ? 'none' : 'stroke-dashoffset 0.15s' }}
        />
      </svg>
      <span className="text-2xl z-10">🏠</span>
    </div>
  );
}
