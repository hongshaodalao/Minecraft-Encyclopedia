import { PixelButton } from '../ui/PixelButton'
import { PixelText } from '../ui/PixelText'

interface CoverScreenProps {
  onExplore: () => void
}

export function CoverScreen({ onExplore }: CoverScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#87CEEB] to-[#5BA3D9] flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* 背景装饰 */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 text-6xl opacity-20 animate-bounce">🌳</div>
        <div className="absolute top-20 right-16 text-5xl opacity-20 animate-bounce" style={{animationDelay: '0.5s'}}>🐮</div>
        <div className="absolute bottom-20 left-16 text-5xl opacity-20 animate-bounce" style={{animationDelay: '1s'}}>🍎</div>
        <div className="absolute bottom-10 right-10 text-6xl opacity-20 animate-bounce" style={{animationDelay: '1.5s'}}>💎</div>
      </div>

      {/* 主内容 */}
      <div className="relative z-10 flex flex-col items-center">
        {/* Logo图标 */}
        <div className="mb-6 bg-[#4CAF50] p-6 border-4 border-[#2E7D32] shadow-[8px_8px_0px_0px_rgba(0,0,0,0.3)]">
          <span className="text-8xl">🌲</span>
        </div>

        {/* 标题 */}
        <div className="bg-[#FFD700] px-8 py-4 border-4 border-[#F9A825] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] mb-4">
          <PixelText size="xl" className="text-[#3E2723] drop-shadow-md">
            我的世界
          </PixelText>
        </div>
        <div className="bg-[#FF6B9D] px-8 py-4 border-4 border-[#E91E63] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] mb-8">
          <PixelText size="xl" className="text-white drop-shadow-md">
            百科全书
          </PixelText>
        </div>

        {/* 副标题 */}
        <div className="bg-white/90 px-6 py-3 border-4 border-[#3E2723] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)] mb-10">
          <PixelText size="md" className="text-[#3E2723]">
            听一听，看一看，认识方块世界！
          </PixelText>
        </div>

        {/* 开始按钮 */}
        <div className="transform hover:scale-105 transition-transform duration-200">
          <PixelButton onClick={onExplore} className="px-12 py-6 text-xl">
            🎮 开始探索
          </PixelButton>
        </div>

        {/* 特性标签 */}
        <div className="flex gap-4 mt-8">
          <div className="bg-[#4CAF50] px-4 py-2 border-2 border-[#2E7D32]">
            <PixelText size="sm" className="text-white">33条词条</PixelText>
          </div>
          <div className="bg-[#FF9800] px-4 py-2 border-2 border-[#F57C00]">
            <PixelText size="sm" className="text-white">语音朗读</PixelText>
          </div>
          <div className="bg-[#9C27B0] px-4 py-2 border-2 border-[#7B1FA2]">
            <PixelText size="sm" className="text-white">互动音效</PixelText>
          </div>
        </div>
      </div>
    </div>
  )
}
