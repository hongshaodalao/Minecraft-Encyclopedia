import { useProgress } from '../hooks/useProgress';
import { TOTAL_ENTRIES } from '../data/utils';

interface CoverScreenProps {
  onExplore: () => void;
}

export function CoverScreen({ onExplore }: CoverScreenProps) {
  const { exploredCount, resetProgress } = useProgress();
  const allExplored = exploredCount >= TOTAL_ENTRIES;

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-sky p-6">
      <div className="text-8xl mb-6 animate-bounce-in">🌳</div>
      <h1 className="text-4xl font-bold text-brown-dark mb-2">
        我的世界百科全书
      </h1>
      <p className="text-lg text-brown-dark/70 mb-10">
        听一听，看一看，认识方块世界！
      </p>

      {!allExplored ? (
        <button
          className="touch-target px-12 py-6 bg-yellow-bright text-brown-dark rounded-3xl font-bold text-2xl shadow-xl active:scale-95 active:shadow-lg transition-all animate-pulse-breath"
          onClick={onExplore}
        >
          开始探索
        </button>
      ) : (
        <div className="flex flex-col items-center gap-4">
          <div className="text-6xl mb-2">🎉</div>
          <p className="text-xl font-bold text-brown-dark">
            你都看完了！
          </p>
          <button
            className="touch-target px-10 py-5 bg-yellow-bright text-brown-dark rounded-2xl font-bold text-xl shadow-lg active:scale-95"
            onClick={() => {
              resetProgress();
              onExplore();
            }}
          >
            再看一遍
          </button>
        </div>
      )}

      <p className="mt-8 text-base text-brown-dark/60">
        已探索 {exploredCount}/{TOTAL_ENTRIES} 个
      </p>
    </div>
  );
}
