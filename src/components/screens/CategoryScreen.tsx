import { allCategories } from '../../data/utils'

interface CategoryScreenProps {
  onSelectCategory: (categoryId: string) => void
  onBack: () => void
}

const categoryIcons: Record<string, string> = {
  blocks: '🧱',
  animals: '🐮',
  foods: '🍎',
}

const categoryDescs: Record<string, string> = {
  blocks: '认识MC世界的基础方块，草方块、石头、钻石...',
  animals: '可爱的动物朋友们，牛、羊、苦力怕...',
  foods: '好吃的食物，苹果、面包、蛋糕...',
}

export function CategoryScreen({ onSelectCategory, onBack }: CategoryScreenProps) {
  return (
    <div className="min-h-screen min-h-[100dvh] paper-bg flex flex-col">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 bg-[#FFF8E1]/90 backdrop-blur-sm border-b-2 border-[#D7CCC8] p-4">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="sketch-btn px-4 py-2 text-sm font-bold text-[#5D4037]"
          >
            ← 返回
          </button>
          <h2 className="text-lg sm:text-xl font-bold text-[#5D4037]">选一个看看</h2>
          <div className="w-16"></div>
        </div>
      </div>

      {/* 分类卡片 */}
      <div className="flex-1 p-4 flex items-center justify-center">
        <div className="w-full max-w-md mx-auto flex flex-col gap-5">
          {allCategories.map((cat, index) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="animate-pop"
              style={{animationDelay: `${index * 0.15}s`}}
            >
              <div className="bg-white rounded-2xl border-3 border-[#D7CCC8] shadow-md overflow-hidden transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer">
                {/* 分类头部 */}
                <div className="p-4 sm:p-5 flex items-center gap-4" style={{backgroundColor: cat.color + '20'}}>
                  <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-3 border-[#8D6E63] shadow-sm flex items-center justify-center bg-white/50 flex-shrink-0">
                    <span className="text-3xl sm:text-4xl">{categoryIcons[cat.id] || cat.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base sm:text-lg font-bold text-[#5D4037]">{cat.name}</h3>
                    <p className="text-xs sm:text-sm text-[#8D6E63] mt-1">
                      {cat.id === 'blocks' && '13个方块'}
                      {cat.id === 'animals' && '12种动物'}
                      {cat.id === 'foods' && '8种食物'}
                    </p>
                  </div>
                </div>

                {/* 分类描述 */}
                <div className="p-3 sm:p-4 bg-gradient-to-b from-white to-[#FFF8E1]">
                  <p className="text-xs sm:text-sm text-[#8D6E63] leading-relaxed">
                    {categoryDescs[cat.id]}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 底部提示 */}
      <div className="p-4 text-center">
        <div className="inline-block bg-[#FFE082] px-5 py-2 rounded-xl border-2 border-[#F9A825] shadow-sm">
          <p className="text-xs sm:text-sm font-semibold text-[#5D4037]">
            👆 点击分类开始探索
          </p>
        </div>
      </div>
    </div>
  )
}
