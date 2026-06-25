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
    <div className="min-h-screen min-h-[100dvh] paper-bg flex flex-col items-center justify-start">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 bg-[#FFF8E1]/90 backdrop-blur-sm border-b-2 border-[#D7CCC8] p-4 w-full">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="sketch-btn px-5 py-3 text-sm font-bold text-[#5D4037]"
          >
            ← 返回
          </button>
          <div className="bg-gradient-to-r from-[#FFE082] to-[#FFD54F] px-5 py-3 rounded-xl border-2 border-[#F9A825] shadow-sm">
            <h2 className="text-lg font-bold text-[#5D4037]">{entry.name}</h2>
          </div>
          <div className="w-16"></div>
        </div>
      </div>

      {/* 主内容区域 */}
      <div className="flex-1 flex items-center justify-center w-full p-4">
        <div className="w-full max-w-lg">
          <div className="space-y-5">
            {/* 图片区域 */}
            <div className="animate-pop">
              <div className="bg-white rounded-2xl border-3 border-[#D7CCC8] shadow-lg p-4 sm:p-5">
                <div className="bg-gradient-to-b from-[#E8F5E9] to-[#C8E6C9] rounded-xl p-4 sm:p-5">
                  <PixelImage
                    imageId={entry.image}
                    category={entry.category}
                    alt={entry.name}
                    onClick={onImageClick}
                  />
                </div>
                <p className="text-center text-sm text-[#8D6E63] mt-3 font-semibold">
                  👆 点击图片播放音效
                </p>
              </div>
            </div>

            {/* 音频播放器 */}
            <div>
              <AudioPlayer entryId={entry.audio} />
            </div>

            {/* 朗读文字（口语版） */}
            <div className="bg-gradient-to-r from-[#E3F2FD] to-[#BBDEFB] rounded-2xl border-3 border-[#64B5F6] shadow-md p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="text-2xl flex-shrink-0">🗣️</span>
                <div>
                  <p className="text-xs font-bold text-[#1565C0] mb-2">语音内容</p>
                  <p className="text-base text-[#5D4037] leading-relaxed font-medium italic">
                    "{entry.audioText}"
                  </p>
                </div>
              </div>
            </div>

            {/* 描述文字 */}
            <div className="bg-white rounded-2xl border-3 border-[#D7CCC8] shadow-md p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="text-2xl flex-shrink-0">📖</span>
                <p className="text-base text-[#5D4037] leading-relaxed font-medium">
                  {entry.displayText}
                </p>
              </div>
            </div>

            {/* 趣味知识 */}
            <div className="bg-gradient-to-r from-[#FFF9C4] to-[#FFF59D] rounded-2xl border-3 border-[#F9A825] shadow-md p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="text-2xl flex-shrink-0">💡</span>
                <div>
                  <p className="text-sm font-bold text-[#F57F17] mb-3">小知识</p>
                  <p className="text-base text-[#5D4037] font-medium">
                    {entry.fact}
                  </p>
                </div>
              </div>
            </div>

            {/* 家长提示 */}
            <div className="bg-gradient-to-r from-[#E8F5E9] to-[#C8E6C9] rounded-2xl border-3 border-[#81C784] shadow-md p-5 sm:p-6">
              <div className="flex items-start gap-4">
                <span className="text-2xl flex-shrink-0">👨‍👩‍👧</span>
                <div>
                  <p className="text-sm font-bold text-[#2E7D32] mb-3">亲子话题</p>
                  <p className="text-base text-[#5D4037] font-medium">
                    {entry.parentTip}
                  </p>
                </div>
              </div>
            </div>

            {/* 导航按钮 */}
            <div className="flex gap-4 justify-center pt-2">
              <button
                onClick={onPrev}
                className="w-44 sketch-btn py-4 text-base font-bold text-[#5D4037] touch-target"
              >
                ← 上一个
              </button>
              <button
                onClick={onNext}
                className="w-44 sketch-btn py-4 text-base font-bold text-[#5D4037] touch-target"
              >
                下一个 →
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
