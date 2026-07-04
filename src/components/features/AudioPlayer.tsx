import { useAudio } from '../../hooks/useAudio'
import type { AudioState } from '../../hooks/useAudio'

interface AudioPlayerProps {
  entryId: string
  className?: string
}

const stateConfig: Record<AudioState, { icon: string; label: string; bg: string }> = {
  idle: { icon: '▶️', label: '点击播放语音', bg: 'from-[#A5D6A7] to-[#66BB6A]' },
  loading: { icon: '⏳', label: '加载中...', bg: 'from-[#FFE082] to-[#FFD54F]' },
  playing: { icon: '🔊', label: '播放中...', bg: 'from-[#90CAF9] to-[#42A5F5]' },
  paused: { icon: '▶️', label: '继续播放', bg: 'from-[#A5D6A7] to-[#66BB6A]' },
  error: { icon: '🔇', label: '语音文件缺失', bg: 'from-[#FFCC80] to-[#FFB74D]' },
}

export function AudioPlayer({ entryId, className = '' }: AudioPlayerProps) {
  const { state, toggle } = useAudio()
  const config = stateConfig[state]

  return (
    <div className={className}>
      <div
        onClick={() => toggle(entryId)}
        className={`
          w-full
          bg-gradient-to-b ${config.bg}
          border-3 border-[#8D6E63]
          rounded-2xl shadow-md
          flex items-center justify-center gap-4
          px-8 py-5 cursor-pointer
          transform hover:scale-[1.02] active:scale-[0.98]
          transition-all duration-200
          ${state === 'loading' ? 'opacity-70 cursor-wait' : ''}
        `}
      >
        <span className="text-3xl">{config.icon}</span>
        <span className="text-base font-bold text-[#5D4037] drop-shadow-sm">
          {config.label}
        </span>
      </div>
      {state === 'error' && (
        <p className="text-center text-xs text-[#8D6E63] mt-2">
          语音文件缺失
        </p>
      )}
    </div>
  )
}
