import { allCategories, getEntriesByCategory } from '../../data/utils'

interface CategoryScreenProps {
  onSelectCategory: (categoryId: string) => void
  onBack: () => void
}

const categoryDescs: Record<string, string> = {
  blocks: '认识MC世界的基础方块，草方块、石头、钻石...',
  items: '好吃的食物和实用的道具，苹果、面包、铁桶...',
  equipment: '武器、工具和盔甲，剑、镐子、钻石甲...',
  monsters: '可怕的怪物们，僵尸、骷髅、苦力怕...',
  animals: '可爱的动物朋友们，牛、羊、熊猫...',
}

export function CategoryScreen({ onSelectCategory, onBack }: CategoryScreenProps) {
  return (
    <div className="min-h-screen min-h-[100dvh] paper-bg flex flex-col">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 bg-[#FFF8E1]/90 backdrop-blur-sm border-b-2 border-[#D7CCC8] p-4 w-full">
        <div className="max-w-md mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="sketch-btn px-5 py-3 text-sm font-bold text-[#5D4037]"
          >
            ← 返回
          </button>
          <h2 className="text-lg sm:text-xl font-bold text-[#5D4037]">选一个看看</h2>
          <div className="w-16"></div>
        </div>
      </div>

      {/* 分类卡片 */}
      <div className="flex-1 flex items-center justify-center p-4">
        <div className="w-full max-w-md mx-auto flex flex-col gap-5">
          {allCategories.map((cat, index) => (
            <div
              key={cat.id}
              onClick={() => onSelectCategory(cat.id)}
              className="animate-pop cursor-pointer"
              style={{animationDelay: `${index * 0.15}s`}}
            >
              <div className="bg-white rounded-2xl border-3 border-[#D7CCC8] shadow-md overflow-hidden transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200">
                {/* 分类头部 */}
                <div className="p-5 sm:p-6 flex items-center gap-4" style={{backgroundColor: cat.color + '20'}}>
                  <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl border-3 border-[#8D6E63] shadow-sm flex items-center justify-center bg-white/50 flex-shrink-0">
                    <span className="text-4xl sm:text-5xl">{cat.icon}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg sm:text-xl font-bold text-[#5D4037]">{cat.name}</h3>
                    <p className="text-sm text-[#8D6E63] mt-2">
                      {getEntriesByCategory(cat.id).length} 个词条
                    </p>
                  </div>
                </div>

                {/* 分类描述 */}
                <div className="p-4 sm:p-5 bg-gradient-to-b from-white to-[#FFF8E1]">
                  <p className="text-sm text-[#8D6E63] leading-relaxed">
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
        <div className="inline-block bg-[#FFE082] px-6 py-3 rounded-xl border-2 border-[#F9A825] shadow-sm">
          <p className="text-sm font-semibold text-[#5D4037]">
            👆 点击分类开始探索
          </p>
        </div>
      </div>
    </div>
  )
}
