import { useState } from 'react';
import type { Entry } from '../schemas/entry.schema';
import { EntryImage } from './EntryImage';
import { AudioButton } from './AudioButton';
import { InteractionLayer } from './InteractionLayer';
import { ProgressBar } from './ProgressBar';
import { useAudio } from '../hooks/useAudio';

interface EntryDetailProps {
  entry: Entry;
  onPrev: () => void;
  onNext: () => void;
  onBackToCategories: () => void;
  onBackToCover: () => void;
  markExplored: (id: string) => void;
}

export function EntryDetail({
  entry,
  onPrev,
  onNext,
  onBackToCategories,
  onBackToCover,
  markExplored,
}: EntryDetailProps) {
  const { state } = useAudio();
  const isNarrating = state === 'playing';
  const [showParentTip, setShowParentTip] = useState(false);

  // 进入详情页时标记为已探索
  useState(() => {
    markExplored(entry.id);
  });

  return (
    <div className="flex flex-col min-h-screen bg-cream">
      {/* 顶部栏 */}
      <div className="flex items-center justify-between p-4">
        <button
          className="touch-target text-3xl p-2 text-brown-dark"
          onClick={onBackToCategories}
          aria-label="返回分类页"
        >
          ←
        </button>
        <span className="text-lg font-bold text-brown-dark">{entry.name}</span>
        <ProgressBar onComplete={onBackToCover} />
      </div>

      {/* 插画区域 */}
      <div className="flex-1 flex items-center justify-center px-6 py-2">
        <InteractionLayer soundId={entry.sound} isNarrating={isNarrating}>
          <EntryImage
            imageId={entry.image}
            alt={entry.name}
            className="w-full max-w-[300px] aspect-square"
          />
        </InteractionLayer>
      </div>

      {/* 内容区域 */}
      <div className="px-6 pb-4 flex flex-col items-center gap-4">
        {/* 语音按钮 */}
        <AudioButton entryId={entry.audio} />

        {/* 显示文字 */}
        <p
          className={`text-lg leading-relaxed text-center text-brown-dark transition-colors duration-300 ${
            isNarrating ? 'bg-yellow-bright/30 rounded-xl px-4 py-2' : ''
          }`}
        >
          {entry.displayText}
        </p>

        {/* 趣味知识 */}
        <div className="w-full bg-white/60 rounded-2xl p-4 text-center">
          <p className="text-base text-brown-dark">
            💡 {entry.fact}
          </p>
        </div>

        {/* 亲子话题 - 朗读结束后显示 */}
        {isNarrating ? null : (
          <div
            className="w-full bg-pink/10 rounded-2xl p-4 text-center cursor-pointer"
            onClick={() => setShowParentTip(!showParentTip)}
          >
            <p className="text-sm text-brown-dark/70">
              💡 和爸爸妈妈聊聊
            </p>
            {showParentTip && (
              <p className="text-base text-brown-dark mt-2 animate-bounce-in">
                🗣️ {entry.parentTip}
              </p>
            )}
          </div>
        )}

        {/* 底部导航 */}
        <div className="flex items-center justify-between w-full max-w-sm mt-2">
          <button
            className="touch-target px-6 py-3 bg-brown-dark/10 rounded-2xl font-bold text-brown-dark text-lg active:scale-95"
            onClick={onPrev}
          >
            〈 上一个
          </button>
          <button
            className="touch-target px-6 py-3 bg-brown-dark/10 rounded-2xl font-bold text-brown-dark text-lg active:scale-95"
            onClick={onNext}
          >
            下一个 〉
          </button>
        </div>
      </div>
    </div>
  );
}
