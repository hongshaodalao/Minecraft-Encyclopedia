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
    <div className="min-h-screen paper-bg p-4">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="sketch-btn px-4 py-3 text-sm font-bold text-[#5D4037] touch-target"
        >
          ← 返回
        </button>
        <h2 className="text-xl font-bold text-[#5D4037]">选一个看看</h2>
        <div className="w-20"></div>
      </div>

      {/* 手绘装饰线 */}
      <div className="doodle-line mb-6"></div>

      {/* 分类卡片 */}
      <div className="flex flex-col gap-6 max-w-md mx-auto">
        {allCategories.map((cat, index) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className="animate-pop cursor-pointer"
            style={{animationDelay: `${index * 0.15}s`}}
          >
            <div className="bg-white rounded-2xl border-3 border-[#D7CCC8] shadow-md overflow-hidden transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
              {/* 分类头部 - 手绘风格 */}
              <div className="p-5 flex items-center gap-4" style={{backgroundColor: cat.color + '20'}}>
                <div className="w-16 h-16 rounded-xl border-3 border-[#8D6E63] shadow-sm flex items-center justify-center bg-white/50 transform -rotate-3">
                  <span className="text-4xl">{categoryIcons[cat.id] || cat.icon}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#5D4037]">{cat.name}</h3>
                  <p className="text-sm text-[#8D6E63] mt-1">
                    {cat.id === 'blocks' && '13个方块'}
                    {cat.id === 'animals' && '12种动物'}
                    {cat.id === 'foods' && '8种食物'}
                  </p>
                </div>
              </div>

              {/* 分类描述 */}
              <div className="p-4 bg-gradient-to-b from-white to-[#FFF8E1]">
                <p className="text-sm text-[#8D6E63] leading-relaxed">
                  {categoryDescs[cat.id]}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部提示 */}
      <div className="mt-8 text-center">
        <div className="inline-block bg-[#FFE082] px-6 py-3 rounded-xl border-2 border-[#F9A825] shadow-sm">
          <p className="text-sm font-semibold text-[#5D4037]">
            👆 点击分类开始探索
          </p>
        </div>
      </div>
    </div>
  )
}
