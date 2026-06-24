import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useProgress } from '../useProgress';

const STORAGE_KEY = 'mc-encyclopedia-progress';

describe('useProgress', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('初始状态应为0条已探索', () => {
    const { result } = renderHook(() => useProgress());
    expect(result.current.exploredCount).toBe(0);
  });

  it('markExplored 应增加探索计数', () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.markExplored('cow');
    });

    expect(result.current.exploredCount).toBe(1);
    expect(result.current.isExplored('cow')).toBe(true);
  });

  it('重复标记同一条目不应重复计数', () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.markExplored('cow');
      result.current.markExplored('cow');
    });

    expect(result.current.exploredCount).toBe(1);
  });

  it('resetProgress 应清零进度', () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.markExplored('cow');
      result.current.markExplored('sheep');
    });
    expect(result.current.exploredCount).toBe(2);

    act(() => {
      result.current.resetProgress();
    });
    expect(result.current.exploredCount).toBe(0);
  });

  it('应持久化到 localStorage', () => {
    const { result } = renderHook(() => useProgress());

    act(() => {
      result.current.markExplored('cow');
    });

    const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    expect(stored).toContain('cow');
  });
});
