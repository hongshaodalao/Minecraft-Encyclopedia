interface CoverScreenProps {
  onExplore: () => void
}

export function CoverScreen({ onExplore }: CoverScreenProps) {
  return (
    <div className="min-h-screen min-h-[100dvh] paper-bg flex items-center justify-center p-4">
      <div className="w-full max-w-sm mx-auto flex flex-col items-center">
        {/* 手绘风格Logo */}
        <div className="relative mb-10">
          <div className="w-28 h-28 sm:w-32 sm:h-32 bg-gradient-to-br from-[#A5D6A7] to-[#66BB6A] rounded-[20px] border-4 border-[#4CAF50] shadow-lg flex items-center justify-center transform rotate-3">
            <span className="text-5xl sm:text-6xl">🌲</span>
          </div>
          <div className="absolute -top-2 -right-2 text-2xl animate-wiggle">✨</div>
        </div>

        {/* 标题 - 增大内边距 */}
        <div className="text-center mb-10">
          <div className="inline-block bg-gradient-to-r from-[#FFE082] to-[#FFD54F] px-10 py-5 rounded-2xl border-3 border-[#F9A825] shadow-md transform -rotate-2 mb-4">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#5D4037]">
              我的世界
            </h1>
          </div>
          <div className="inline-block bg-gradient-to-r from-[#FFAB91] to-[#FF8A65] px-10 py-5 rounded-2xl border-3 border-[#FF7043] shadow-md transform rotate-1">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              百科全书
            </h1>
          </div>
        </div>

        {/* 副标题 */}
        <div className="bg-white/80 px-8 py-4 rounded-xl border-2 border-[#D7CCC8] shadow-sm mb-12 text-center">
          <p className="text-base sm:text-lg text-[#8D6E63] font-semibold">
            🎵 听一听，看一看，认识方块世界！
          </p>
        </div>

        {/* 开始按钮 */}
        <button
          onClick={onExplore}
          className="sketch-btn px-14 py-6 text-lg sm:text-xl font-bold text-[#5D4037] touch-target"
        >
          🎮 开始探索
        </button>

        {/* 特性标签 */}
        <div className="flex flex-wrap justify-center gap-3 mt-10">
          <div className="bg-[#C8E6C9] px-5 py-3 rounded-full border-2 border-[#81C784]">
            <span className="text-xs sm:text-sm font-semibold text-[#2E7D32]">📚 53条词条</span>
          </div>
          <div className="bg-[#FFE0B2] px-5 py-3 rounded-full border-2 border-[#FFB74D]">
            <span className="text-xs sm:text-sm font-semibold text-[#E65100]">🎵 语音朗读</span>
          </div>
          <div className="bg-[#E1BEE7] px-5 py-3 rounded-full border-2 border-[#CE93D8]">
            <span className="text-xs sm:text-sm font-semibold text-[#7B1FA2]">🎮 互动音效</span>
          </div>
        </div>
      </div>
    </div>
  )
}
