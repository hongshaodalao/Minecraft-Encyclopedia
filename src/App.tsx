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
      <div className="min-h-screen bg-[#87CEEB] flex items-center justify-center">
        <p className="font-['Press_Start_2P'] text-[#3E2723]">找不到词条</p>
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
