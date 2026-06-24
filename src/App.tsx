import { useRouter } from './hooks/useRouter'
import { useAudio } from './hooks/useAudio'
import { CoverScreen } from './components/screens/CoverScreen'
import { CategoryScreen } from './components/screens/CategoryScreen'
import { DetailScreen } from './components/screens/DetailScreen'
import { getEntriesByCategory } from './data/utils'

function App() {
  const { screen, goToCover, goToCategory, goToDetail, goNext, goPrev } = useRouter()
  const { play } = useAudio()

  if (screen.type === 'cover') {
    return <CoverScreen onExplore={goToCategory} />
  }

  if (screen.type === 'category') {
    return (
      <CategoryScreen
        onSelectCategory={(categoryId) => goToDetail(categoryId, 0)}
        onBack={goToCover}
      />
    )
  }

  // detail
  const entries = getEntriesByCategory(screen.category!)
  const entry = entries[screen.index ?? 0]

  if (!entry) {
    return (
      <div className="min-h-screen paper-bg flex items-center justify-center">
        <div className="bg-white rounded-2xl border-3 border-[#D7CCC8] shadow-md p-8 text-center">
          <span className="text-5xl mb-4 block">😕</span>
          <p className="text-lg font-bold text-[#5D4037]">找不到词条</p>
        </div>
      </div>
    )
  }

  return (
    <DetailScreen
      entry={entry}
      onBack={goToCategory}
      onPrev={goPrev}
      onNext={goNext}
      onImageClick={() => play(entry.audio)}
    />
  )
}

export default App
