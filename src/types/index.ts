export interface Entry {
  id: string
  name: string
  category: string
  image: string
  audio: string
  sound: string
  displayText: string
  audioText: string
  fact: string
  parentTip: string
}

export interface Category {
  id: string
  name: string
  icon: string
  color: string
}

export type ScreenType = 'cover' | 'category' | 'list' | 'detail'

export interface ScreenState {
  type: ScreenType
  category?: string
  index?: number
}
