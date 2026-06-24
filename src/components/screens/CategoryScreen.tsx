import { allCategories } from '../../data/utils'
import { PixelCard } from '../ui/PixelCard'
import { PixelText } from '../ui/PixelText'
import { PixelButton } from '../ui/PixelButton'

interface CategoryScreenProps {
  onSelectCategory: (categoryId: string) => void
  onBack: () => void
}

export function CategoryScreen({ onSelectCategory, onBack }: CategoryScreenProps) {
  return (
    <div className="min-h-screen bg-[#87CEEB] p-6">
      <div className="mb-6">
        <PixelButton onClick={onBack} className="w-auto px-4">
          ← 返回
        </PixelButton>
      </div>
      <PixelText size="lg" className="text-center mb-8">
        选一个看看
      </PixelText>
      <div className="flex flex-col gap-6 max-w-md mx-auto">
        {allCategories.map((cat) => (
          <PixelCard
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
          >
            <div className="flex items-center gap-4">
              <span className="text-5xl">{cat.icon}</span>
              <PixelText size="lg">{cat.name}</PixelText>
            </div>
          </PixelCard>
        ))}
      </div>
    </div>
  )
}
