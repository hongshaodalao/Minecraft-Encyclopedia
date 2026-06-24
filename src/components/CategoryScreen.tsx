import { allCategories } from '../data/utils';

interface CategoryScreenProps {
  onSelectCategory: (categoryId: string) => void;
  onBack: () => void;
}

export function CategoryScreen({ onSelectCategory, onBack }: CategoryScreenProps) {
  return (
    <div className="flex flex-col min-h-screen bg-sky p-6">
      <button
        className="self-start touch-target text-3xl p-2 mb-4"
        onClick={onBack}
        aria-label="返回首页"
      >
        ←
      </button>

      <h2 className="text-3xl font-bold text-brown-dark text-center mb-8">
        选一个看看
      </h2>

      <div className="flex flex-col gap-6 flex-1 justify-center max-w-md mx-auto w-full">
        {allCategories.map((cat, i) => (
          <button
            key={cat.id}
            className="animate-bounce-in touch-target flex items-center gap-5 p-6 rounded-3xl shadow-lg active:scale-95 active:shadow-md transition-all text-left"
            style={{
              backgroundColor: cat.color,
              animationDelay: `${i * 100}ms`,
              animationFillMode: 'backwards',
            }}
            onClick={() => onSelectCategory(cat.id)}
          >
            <span className="text-6xl">{cat.icon}</span>
            <span className="text-2xl font-bold text-white drop-shadow-md">
              {cat.name}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
