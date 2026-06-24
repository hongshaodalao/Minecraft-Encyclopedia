import { PixelButton } from '../ui/PixelButton'
import { PixelText } from '../ui/PixelText'

interface CoverScreenProps {
  onExplore: () => void
}

export function CoverScreen({ onExplore }: CoverScreenProps) {
  return (
    <div className="min-h-screen bg-[#87CEEB] flex flex-col items-center justify-center p-6">
      <div className="text-8xl mb-8">🌳</div>
      <PixelText size="xl" className="mb-4 text-center">
        我的世界百科全书
      </PixelText>
      <PixelText size="md" className="mb-12 text-center text-gray-600">
        听一听，看一看，认识方块世界！
      </PixelText>
      <PixelButton onClick={onExplore}>
        开始探索
      </PixelButton>
    </div>
  )
}
