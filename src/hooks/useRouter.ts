import { useState, useCallback } from 'react'
import type { ScreenState } from '../types'
import { getEntriesByCategory } from '../data/utils'

export function useRouter() {
  const [screen, setScreen] = useState<ScreenState>({ type: 'cover' })

  const goToCover = useCallback(() => {
    setScreen({ type: 'cover' })
  }, [])

  const goToCategory = useCallback(() => {
    setScreen({ type: 'category' })
  }, [])

  const goToList = useCallback((categoryId: string) => {
    setScreen({ type: 'list', category: categoryId })
  }, [])

  const goToDetail = useCallback((categoryId: string, index: number = 0) => {
    setScreen({ type: 'detail', category: categoryId, index })
  }, [])

  const goNext = useCallback(() => {
    setScreen((prev) => {
      if (prev.type !== 'detail' || !prev.category) return prev
      const entries = getEntriesByCategory(prev.category)
      const nextIndex = (prev.index ?? 0) + 1
      if (nextIndex >= entries.length) {
        return { ...prev, index: 0 }
      }
      return { ...prev, index: nextIndex }
    })
  }, [])

  const goPrev = useCallback(() => {
    setScreen((prev) => {
      if (prev.type !== 'detail' || !prev.category) return prev
      const entries = getEntriesByCategory(prev.category)
      const prevIndex = (prev.index ?? 0) - 1
      if (prevIndex < 0) {
        return { ...prev, index: entries.length - 1 }
      }
      return { ...prev, index: prevIndex }
    })
  }, [])

  return { screen, goToCover, goToCategory, goToList, goToDetail, goNext, goPrev }
}
