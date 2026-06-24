import { useAudio } from '../../hooks/useAudio'
import type { AudioState } from '../../hooks/useAudio'

interface AudioPlayerProps {
  entryId: string
  className?: string
}

const stateConfig: Record<AudioState, { icon: string; label: string; bg: string; border: string }> = {
  idle: { icon: '▶️', label: '点击播放', bg: 'from-[#A5D6A7] to-[#66BB6A]', border: '#4CAF50' },
  loading: { icon: '⏳', label: '加载中...', bg: 'from-[#FFE082] to-[#FFD54F]', border: '#F9A825' },
  playing: { icon: '⏸️', label: '播放中', bg: 'from-[#90CAF9] to-[#42A5F5]', border: '#1E88E5' },
  paused: { icon: '▶️', label: '继续播放', bg: 'from-[#A5D6A7] to-[#66BB6A]', border: '#4CAF50' },
  error: { icon: '❌', label: '播放失败', bg: 'from-[#EF9A9A] to-[#EF5350]', border: '#E53935' },
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
          border-3 border-[${config.border}]
          rounded-2xl shadow-md
          flex items-center justify-center gap-4
          px-8 py-5 cursor-pointer
          transform hover:scale-[1.02] active:scale-[0.98]
          transition-all duration-200
          ${state === 'loading' ? 'opacity-70 cursor-wait' : ''}
        `}
      >
        <span className="text-3xl">{config.icon}</span>
        <span className="text-base font-bold text-white drop-shadow-sm">
          {config.label}
        </span>
      </div>
    </div>
  )
}
