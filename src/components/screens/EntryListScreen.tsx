import { getEntriesByCategory, getCategoryById } from '../../data/utils'
import type { Entry } from '../../types'

interface EntryListScreenProps {
  categoryId: string
  onSelectEntry: (index: number) => void
  onBack: () => void
}

export function EntryListScreen({ categoryId, onSelectEntry, onBack }: EntryListScreenProps) {
  const entries = getEntriesByCategory(categoryId)
  const category = getCategoryById(categoryId)

  if (!category) {
    return (
      <div className="min-h-screen paper-bg flex items-center justify-center">
        <p className="text-lg text-[#5D4037]">找不到分类</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen min-h-[100dvh] paper-bg flex flex-col">
      {/* 顶部导航 */}
      <div className="sticky top-0 z-10 bg-[#FFF8E1]/90 backdrop-blur-sm border-b-2 border-[#D7CCC8] p-4 w-full">
        <div className="max-w-lg mx-auto flex items-center justify-between">
          <button
            onClick={onBack}
            className="sketch-btn px-5 py-3 text-sm font-bold text-[#5D4037]"
          >
            ← 返回
          </button>
          <div
            className="px-5 py-3 rounded-xl border-2 shadow-sm"
            style={{
              backgroundColor: category.color + '30',
              borderColor: category.color,
            }}
          >
            <h2 className="text-lg font-bold text-[#5D4037]">
              {category.icon} {category.name}
            </h2>
          </div>
          <div className="w-16"></div>
        </div>
      </div>

      {/* 列表内容 */}
      <div className="flex-1 overflow-y-auto p-4">
        <div className="max-w-lg mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {entries.map((entry, index) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                index={index}
                onClick={() => onSelectEntry(index)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

interface EntryCardProps {
  entry: Entry
  index: number
  onClick: () => void
}

function EntryCard({ entry, index, onClick }: EntryCardProps) {
  return (
    <div
      onClick={onClick}
      className="animate-pop cursor-pointer"
      style={{ animationDelay: `${index * 0.05}s` }}
    >
      <div className="bg-white rounded-2xl border-3 border-[#D7CCC8] shadow-md overflow-hidden transform hover:scale-[1.03] active:scale-[0.97] transition-all duration-200">
        {/* 图片 */}
        <div className="aspect-square bg-gradient-to-b from-[#E8F5E9] to-[#C8E6C9] p-3 flex items-center justify-center">
          <img
            src={`/images/${entry.category}/${entry.image}.webp`}
            alt={entry.name}
            className="w-full h-full object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>
        {/* 名称 */}
        <div className="p-3 text-center">
          <p className="text-sm font-bold text-[#5D4037] truncate">{entry.name}</p>
        </div>
      </div>
    </div>
  )
}
