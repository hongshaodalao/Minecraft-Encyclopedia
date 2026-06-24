import { useRef, useCallback } from 'react';

interface InteractionLayerProps {
  soundId: string;
  isNarrating: boolean;
  children: React.ReactNode;
  className?: string;
}

export function InteractionLayer({ soundId, isNarrating, children, className = '' }: InteractionLayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const handleClick = useCallback(() => {
    // 朗读播放中只播放动画，不播放音效
    if (isNarrating) return;

    try {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      audioRef.current = new Audio(`/sounds/${soundId}.ogg`);
      audioRef.current.play().catch(() => {
        // 音效加载失败静默处理
      });
    } catch {
      // 静默处理
    }
  }, [soundId, isNarrating]);

  return (
    <div
      className={`cursor-pointer ${className}`}
      onClick={handleClick}
      role="button"
      tabIndex={0}
      aria-label="点击播放音效"
    >
      {children}
    </div>
  );
}
