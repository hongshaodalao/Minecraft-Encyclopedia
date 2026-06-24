import { useAudio } from '../hooks/useAudio';
import type { AudioState } from '../hooks/useAudio';

interface AudioButtonProps {
  entryId: string;
  className?: string;
}

const stateLabels: Record<AudioState, string> = {
  idle: '点我听故事',
  loading: '加载中...',
  playing: '暂停',
  paused: '继续听',
  error: '声音找不到了',
};

const stateIcons: Record<AudioState, string> = {
  idle: '▶',
  loading: '⏳',
  playing: '⏸',
  paused: '▶',
  error: '🔇',
};

export function AudioButton({ entryId, className = '' }: AudioButtonProps) {
  const { state, toggle } = useAudio();

  const isDisabled = state === 'loading';

  return (
    <button
      className={`touch-target inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-brown-dark text-xl
        bg-yellow-bright shadow-lg active:shadow-md transition-all
        ${isDisabled ? 'opacity-60 cursor-wait' : 'active:scale-95'}
        animate-pulse-breath
        ${className}`}
      onClick={() => toggle(entryId)}
      disabled={isDisabled}
      aria-label={stateLabels[state]}
    >
      <span className="text-3xl">{stateIcons[state]}</span>
      <span>{stateLabels[state]}</span>
    </button>
  );
}
