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
    <div className="min-h-screen bg-gradient-to-b from-[#87CEEB] to-[#5BA3D9] p-4">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-4">
        <PixelButton onClick={onBack} className="w-auto px-4 py-3">
          ← 返回
        </PixelButton>
        <div className="bg-[#FFD700] px-6 py-3 border-4 border-[#F9A825] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
          <PixelText size="md" className="text-[#3E2723]">
            {entry.name}
          </PixelText>
        </div>
        <div className="w-20"></div>
      </div>

      {/* 主内容区域 */}
      <div className="max-w-md mx-auto">
        {/* 图片区域 */}
        <div className="mb-6 transform hover:scale-[1.02] transition-transform duration-200">
          <PixelImage
            imageId={entry.image}
            alt={entry.name}
            onClick={onImageClick}
          />
        </div>

        {/* 音频播放器 */}
        <div className="mb-6">
          <AudioPlayer entryId={entry.audio} />
        </div>

        {/* 描述文字 */}
        <div className="bg-white border-4 border-[#3E2723] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] p-5 mb-6">
          <PixelText size="md" className="text-[#3E2723] leading-relaxed">
            {entry.displayText}
          </PixelText>
        </div>

        {/* 趣味知识 */}
        <div className="bg-[#FFD700] border-4 border-[#F9A825] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] p-5 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-3xl">💡</span>
            <PixelText size="md" className="text-[#3E2723]">
              {entry.fact}
            </PixelText>
          </div>
        </div>

        {/* 家长提示 */}
        <div className="bg-[#E8F5E9] border-4 border-[#4CAF50] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] p-5 mb-6">
          <div className="flex items-start gap-3">
            <span className="text-3xl">👨‍👩‍👧</span>
            <div>
              <PixelText size="sm" className="text-[#2E7D32] mb-2">
                亲子话题
              </PixelText>
              <PixelText size="md" className="text-[#3E2723]">
                {entry.parentTip}
              </PixelText>
            </div>
          </div>
        </div>

        {/* 导航按钮 */}
        <div className="flex gap-4 mt-8">
          <div className="flex-1 transform hover:scale-105 active:scale-95 transition-transform duration-200">
            <PixelButton onClick={onPrev} className="w-full py-4">
              ← 上一个
            </PixelButton>
          </div>
          <div className="flex-1 transform hover:scale-105 active:scale-95 transition-transform duration-200">
            <PixelButton onClick={onNext} className="w-full py-4">
              下一个 →
            </PixelButton>
          </div>
        </div>
      </div>
    </div>
  )
}
