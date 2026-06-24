import { useAudio } from '../../hooks/useAudio'
import type { AudioState } from '../../hooks/useAudio'

interface AudioPlayerProps {
  entryId: string
  className?: string
}

const stateConfig: Record<AudioState, { icon: string; label: string; color: string }> = {
  idle: { icon: '▶', label: '点击播放', color: 'from-[#4CAF50] to-[#2E7D32]' },
  loading: { icon: '⏳', label: '加载中...', color: 'from-[#FF9800] to-[#F57C00]' },
  playing: { icon: '⏸', label: '播放中', color: 'from-[#2196F3] to-[#1565C0]' },
  paused: { icon: '▶', label: '继续播放', color: 'from-[#4CAF50] to-[#2E7D32]' },
  error: { icon: '❌', label: '播放失败', color: 'from-[#F44336] to-[#C62828]' },
}

export function AudioPlayer({ entryId, className = '' }: AudioPlayerProps) {
  const { state, toggle } = useAudio()
  const config = stateConfig[state]

  return (
    <div className={className}>
      <div
        onClick={() => toggle(entryId)}
        className={`
          min-w-[80px] min-h-[80px]
          bg-gradient-to-b ${config.color}
          border-4 border-[#3E2723] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.4)]
          flex items-center justify-center gap-3
          px-6 py-4 cursor-pointer
          transform hover:scale-105 active:scale-95
          transition-all duration-200
          ${state === 'loading' ? 'opacity-70 cursor-wait' : ''}
        `}
      >
        <span className="text-3xl">{config.icon}</span>
        <span className="font-['Press_Start_2P'] text-white text-sm drop-shadow-md">
          {config.label}
        </span>
      </div>
    </div>
  )
}
