import { allCategories } from '../../data/utils'
import { PixelText } from '../ui/PixelText'
import { PixelButton } from '../ui/PixelButton'

interface CategoryScreenProps {
  onSelectCategory: (categoryId: string) => void
  onBack: () => void
}

export function CategoryScreen({ onSelectCategory, onBack }: CategoryScreenProps) {
  return (
    <div className="min-h-screen bg-gradient-to-b from-[#87CEEB] to-[#5BA3D9] p-4">
      {/* 顶部导航 */}
      <div className="flex items-center justify-between mb-6">
        <PixelButton onClick={onBack} className="w-auto px-4 py-3">
          ← 返回
        </PixelButton>
        <PixelText size="lg" className="text-[#3E2723]">
          选一个看看
        </PixelText>
        <div className="w-20"></div>
      </div>

      {/* 分类卡片 */}
      <div className="flex flex-col gap-6 max-w-md mx-auto">
        {allCategories.map((cat, index) => (
          <div
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className="transform hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 cursor-pointer"
            style={{animationDelay: `${index * 0.1}s`}}
          >
            <div className="bg-white border-4 border-[#3E2723] shadow-[6px_6px_0px_0px_rgba(0,0,0,0.3)] overflow-hidden">
              {/* 分类头部 */}
              <div className="p-4 flex items-center gap-4" style={{backgroundColor: cat.color}}>
                <div className="bg-white/30 p-3 border-2 border-white/50">
                  <span className="text-5xl">{cat.icon}</span>
                </div>
                <div>
                  <PixelText size="lg" className="text-white drop-shadow-md">
                    {cat.name}
                  </PixelText>
                  <PixelText size="sm" className="text-white/80 mt-1">
                    {cat.id === 'blocks' && '13个方块'}
                    {cat.id === 'animals' && '12种动物'}
                    {cat.id === 'foods' && '8种食物'}
                  </PixelText>
                </div>
              </div>

              {/* 分类描述 */}
              <div className="p-4 bg-white">
                <PixelText size="sm" className="text-[#3E2723]">
                  {cat.id === 'blocks' && '认识MC世界的基础方块，草方块、石头、钻石...'}
                  {cat.id === 'animals' && '可爱的动物朋友们，牛、羊、苦力怕...'}
                  {cat.id === 'foods' && '好吃的食物，苹果、面包、蛋糕...'}
                </PixelText>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* 底部提示 */}
      <div className="mt-8 text-center">
        <div className="bg-[#FFD700] inline-block px-6 py-3 border-4 border-[#F9A825] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.3)]">
          <PixelText size="sm" className="text-[#3E2723]">
            👆 点击分类开始探索
          </PixelText>
        </div>
      </div>
    </div>
  )
}
