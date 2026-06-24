import { useState, useCallback } from 'react';

const STORAGE_KEY = 'mc-encyclopedia-progress';

function getExploredIds(): Set<string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return new Set();
    const parsed = JSON.parse(stored);
    if (Array.isArray(parsed)) return new Set(parsed);
    return new Set();
  } catch {
    return new Set();
  }
}

function saveExploredIds(ids: Set<string>): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...ids]));
  } catch {
    // Safari 无痕模式等场景下 localStorage 可能不可用，静默降级
  }
}

export function useProgress() {
  const [exploredIds, setExploredIds] = useState<Set<string>>(getExploredIds);

  const markExplored = useCallback((id: string) => {
    setExploredIds((prev) => {
      if (prev.has(id)) return prev;
      const next = new Set(prev);
      next.add(id);
      saveExploredIds(next);
      return next;
    });
  }, []);

  const resetProgress = useCallback(() => {
    setExploredIds(new Set());
    saveExploredIds(new Set());
  }, []);

  const isExplored = useCallback(
    (id: string) => exploredIds.has(id),
    [exploredIds]
  );

  const exploredCount = exploredIds.size;

  return { exploredCount, markExplored, resetProgress, isExplored };
}
