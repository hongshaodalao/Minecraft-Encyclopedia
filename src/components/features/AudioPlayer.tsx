import { useAudio } from '../../hooks/useAudio'
import type { AudioState } from '../../hooks/useAudio'
import { PixelButton } from '../ui/PixelButton'

interface AudioPlayerProps {
  entryId: string
  className?: string
}

const stateLabels: Record<AudioState, string> = {
  idle: '▶ 播放',
  loading: '⏳ 加载中',
  playing: '⏸ 暂停',
  paused: '▶ 继续',
  error: '❌ 错误',
}

export function AudioPlayer({ entryId, className = '' }: AudioPlayerProps) {
  const { state, toggle } = useAudio()

  return (
    <div className={className}>
      <PixelButton
        onClick={() => toggle(entryId)}
        disabled={state === 'loading'}
        className="w-full"
      >
        {stateLabels[state]}
      </PixelButton>
    </div>
  )
}
