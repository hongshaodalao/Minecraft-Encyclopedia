import { useState, useCallback } from 'react';
import { CoverScreen } from './components/CoverScreen';
import { CategoryScreen } from './components/CategoryScreen';
import { EntryDetail } from './components/EntryDetail';
import { ErrorBoundary } from './components/ErrorBoundary';
import { useProgress } from './hooks/useProgress';
import { getEntriesByCategory } from './data/utils';
import type { Entry } from './schemas/entry.schema';

type Screen =
  | { type: 'cover' }
  | { type: 'category' }
  | { type: 'detail'; category: string; index: number };

function AppContent() {
  const [screen, setScreen] = useState<Screen>({ type: 'cover' });
  const { markExplored } = useProgress();

  const handleExplore = useCallback(() => {
    setScreen({ type: 'category' });
  }, []);

  const handleSelectCategory = useCallback((categoryId: string) => {
    setScreen({ type: 'detail', category: categoryId, index: 0 });
  }, []);

  const handleBackToCategories = useCallback(() => {
    setScreen({ type: 'category' });
  }, []);

  const handleBackToCover = useCallback(() => {
    setScreen({ type: 'cover' });
  }, []);

  if (screen.type === 'cover') {
    return <CoverScreen onExplore={handleExplore} />;
  }

  if (screen.type === 'category') {
    return (
      <CategoryScreen
        onSelectCategory={handleSelectCategory}
        onBack={handleBackToCover}
      />
    );
  }

  // detail
  const entries = getEntriesByCategory(screen.category);
  const entry: Entry | undefined = entries[screen.index];

  if (!entry) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-sky">
        <p className="text-xl text-brown-dark">找不到这个词条</p>
      </div>
    );
  }

  const handlePrev = () => {
    setScreen((s) => {
      if (s.type !== 'detail') return s;
      const newIndex = s.index > 0 ? s.index - 1 : entries.length - 1;
      return { ...s, index: newIndex };
    });
  };

  const handleNext = () => {
    setScreen((s) => {
      if (s.type !== 'detail') return s;
      const newIndex = s.index < entries.length - 1 ? s.index + 1 : 0;
      return { ...s, index: newIndex };
    });
  };

  return (
    <EntryDetail
      key={entry.id}
      entry={entry}
      onPrev={handlePrev}
      onNext={handleNext}
      onBackToCategories={handleBackToCategories}
      onBackToCover={handleBackToCover}
      markExplored={markExplored}
    />
  );
}

export default function App() {
  return (
    <ErrorBoundary>
      <AppContent />
    </ErrorBoundary>
  );
}
