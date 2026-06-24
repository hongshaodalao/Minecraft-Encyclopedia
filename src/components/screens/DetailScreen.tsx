import type { Entry } from '../../types'
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
    <div className="min-h-screen paper-bg p-4">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={onBack}
          className="sketch-btn px-4 py-3 text-sm font-bold text-[#5D4037] touch-target"
        >
          ← 返回
        </button>
        <div className="bg-gradient-to-r from-[#FFE082] to-[#FFD54F] px-6 py-3 rounded-xl border-2 border-[#F9A825] shadow-sm">
          <h2 className="text-lg font-bold text-[#5D4037]">{entry.name}</h2>
        </div>
        <div className="w-20"></div>
      </div>

      {/* 手绘装饰线 */}
      <div className="doodle-line mb-4"></div>

      {/* 主内容区域 */}
      <div className="max-w-md mx-auto">
        {/* 图片区域 - 手绘风格 */}
        <div className="mb-6 animate-pop">
          <div className="bg-white rounded-2xl border-3 border-[#D7CCC8] shadow-lg p-4 transform rotate-1">
            <div className="bg-gradient-to-b from-[#E8F5E9] to-[#C8E6C9] rounded-xl p-4">
              <PixelImage
                imageId={entry.image}
                alt={entry.name}
                onClick={onImageClick}
              />
            </div>
            {/* 点击提示 */}
            <p className="text-center text-xs text-[#8D6E63] mt-3 font-semibold">
              👆 点击图片播放音效
            </p>
          </div>
        </div>

        {/* 音频播放器 - 手绘风格 */}
        <div className="mb-6">
          <AudioPlayer entryId={entry.audio} />
        </div>

        {/* 描述文字 - 手绘卡片 */}
        <div className="bg-white rounded-2xl border-3 border-[#D7CCC8] shadow-md p-5 mb-6 transform -rotate-1">
          <div className="flex items-start gap-3">
            <span className="text-2xl">📖</span>
            <p className="text-base text-[#5D4037] leading-relaxed font-medium">
              {entry.displayText}
            </p>
          </div>
        </div>

        {/* 趣味知识 - 手绘风格 */}
        <div className="bg-gradient-to-r from-[#FFF9C4] to-[#FFF59D] rounded-2xl border-3 border-[#F9A825] shadow-md p-5 mb-6 transform rotate-1">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <p className="text-sm font-bold text-[#F57F17] mb-2">小知识</p>
              <p className="text-base text-[#5D4037] font-medium">
                {entry.fact}
              </p>
            </div>
          </div>
        </div>

        {/* 家长提示 - 手绘风格 */}
        <div className="bg-gradient-to-r from-[#E8F5E9] to-[#C8E6C9] rounded-2xl border-3 border-[#81C784] shadow-md p-5 mb-6 transform -rotate-1">
          <div className="flex items-start gap-3">
            <span className="text-2xl">👨‍👩‍👧</span>
            <div>
              <p className="text-sm font-bold text-[#2E7D32] mb-2">亲子话题</p>
              <p className="text-base text-[#5D4037] font-medium">
                {entry.parentTip}
              </p>
            </div>
          </div>
        </div>

        {/* 手绘装饰线 */}
        <div className="doodle-line my-6"></div>

        {/* 导航按钮 - 手绘风格 */}
        <div className="flex gap-4">
          <button
            onClick={onPrev}
            className="flex-1 sketch-btn py-4 text-base font-bold text-[#5D4037] touch-target"
          >
            ← 上一个
          </button>
          <button
            onClick={onNext}
            className="flex-1 sketch-btn py-4 text-base font-bold text-[#5D4037] touch-target"
          >
            下一个 →
          </button>
        </div>
      </div>
    </div>
  )
}
