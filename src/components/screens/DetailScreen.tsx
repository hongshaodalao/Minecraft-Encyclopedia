import type { Entry } from '../../types'
import { PixelButton } from '../ui/PixelButton'
import { PixelText } from '../ui/PixelText'
import { PixelImage } from '../features/PixelImage'
import { AudioPlayer } from '../features/AudioPlayer'

interface DetailScreenProps {
  entry: Entry
  onBack: () => void
  onPrev: () => void
  onNext: () => void
  onImageClick: () => void
}

export function DetailScreen({ entry, onBack, onPrev, onNext, onImageClick }: DetailScreenProps) {
  return (
    <div className="min-h-screen bg-[#87CEEB] p-4">
      <div className="flex justify-between items-center mb-4">
        <PixelButton onClick={onBack} className="w-auto px-4">
          ← 返回
        </PixelButton>
        <PixelText size="md">{entry.name}</PixelText>
        <div className="w-20"></div>
      </div>

      <div className="max-w-md mx-auto">
        <PixelImage
          imageId={entry.image}
          alt={entry.name}
          onClick={onImageClick}
          className="mb-6"
        />

        <AudioPlayer entryId={entry.audio} className="mb-6" />

        <div className="bg-white border-4 border-[#3E2723] p-4 mb-6">
          <PixelText size="md">{entry.displayText}</PixelText>
        </div>

        <div className="bg-[#FFD700] border-4 border-[#3E2723] p-4 mb-6">
          <PixelText size="sm">💡 {entry.fact}</PixelText>
        </div>

        <div className="flex gap-4">
          <PixelButton onClick={onPrev} className="flex-1">
            ← 上一个
          </PixelButton>
          <PixelButton onClick={onNext} className="flex-1">
            下一个 →
          </PixelButton>
        </div>
      </div>
    </div>
  )
}
