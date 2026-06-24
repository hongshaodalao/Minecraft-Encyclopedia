interface CoverScreenProps {
  onExplore: () => void
}

export function CoverScreen({ onExplore }: CoverScreenProps) {
  return (
    <div className="min-h-screen paper-bg flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* 手绘装饰元素 */}
      <div className="absolute inset-0 pointer-events-none">
        {/* 云朵 */}
        <div className="absolute top-8 left-8 text-4xl opacity-30 animate-float">☁️</div>
        <div className="absolute top-16 right-12 text-3xl opacity-25 animate-float" style={{animationDelay: '1s'}}>☁️</div>

        {/* 装饰图案 */}
        <div className="absolute bottom-12 left-8 text-3xl opacity-20 animate-wiggle">🌻</div>
        <div className="absolute bottom-20 right-12 text-4xl opacity-20 animate-wiggle" style={{animationDelay: '0.5s'}}>🌳</div>
        <div className="absolute top-1/3 left-4 text-2xl opacity-15 animate-wiggle" style={{animationDelay: '1.5s'}}>🦋</div>
      </div>

      {/* 主内容 */}
      <div className="relative z-10 flex flex-col items-center animate-pop">
        {/* 手绘风格Logo */}
        <div className="relative mb-6">
          <div className="w-32 h-32 bg-gradient-to-br from-[#A5D6A7] to-[#66BB6A] rounded-[20px] border-4 border-[#4CAF50] shadow-lg flex items-center justify-center transform rotate-3">
            <span className="text-6xl">🌲</span>
          </div>
          {/* 装饰小元素 */}
          <div className="absolute -top-2 -right-2 text-2xl animate-wiggle">✨</div>
        </div>

        {/* 手绘风格标题 */}
        <div className="relative mb-2">
          <div className="bg-gradient-to-r from-[#FFE082] to-[#FFD54F] px-8 py-4 rounded-2xl border-3 border-[#F9A825] shadow-md transform -rotate-2">
            <h1 className="text-3xl font-extrabold text-[#5D4037] tracking-wide">
              我的世界
            </h1>
          </div>
        </div>

        <div className="relative mb-8">
          <div className="bg-gradient-to-r from-[#FFAB91] to-[#FF8A65] px-8 py-4 rounded-2xl border-3 border-[#FF7043] shadow-md transform rotate-1">
            <h1 className="text-3xl font-extrabold text-white tracking-wide">
              百科全书
            </h1>
          </div>
        </div>

        {/* 手绘风格副标题 */}
        <div className="bg-white/80 px-6 py-3 rounded-xl border-2 border-[#D7CCC8] shadow-sm mb-10 transform rotate-1">
          <p className="text-lg text-[#8D6E63] font-semibold">
            🎵 听一听，看一看，认识方块世界！
          </p>
        </div>

        {/* 手绘风格按钮 */}
        <button
          onClick={onExplore}
          className="sketch-btn px-10 py-5 text-xl font-bold text-[#5D4037] touch-target"
        >
          🎮 开始探索
        </button>

        {/* 手绘风格标签 */}
        <div className="flex gap-3 mt-8 flex-wrap justify-center">
          <div className="bg-[#C8E6C9] px-4 py-2 rounded-full border-2 border-[#81C784]">
            <span className="text-sm font-semibold text-[#2E7D32]">📚 33条词条</span>
          </div>
          <div className="bg-[#FFE0B2] px-4 py-2 rounded-full border-2 border-[#FFB74D]">
            <span className="text-sm font-semibold text-[#E65100]">🎵 语音朗读</span>
          </div>
          <div className="bg-[#E1BEE7] px-4 py-2 rounded-full border-2 border-[#CE93D8]">
            <span className="text-sm font-semibold text-[#7B1FA2]">🎮 互动音效</span>
          </div>
        </div>
      </div>

      {/* 底部装饰线 */}
      <div className="absolute bottom-0 left-0 right-0 h-8 bg-gradient-to-t from-[#D7CCC8] to-transparent opacity-30"></div>
    </div>
  )
}
