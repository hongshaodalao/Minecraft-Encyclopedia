# 我的世界百科全书 重新设计实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个面向5岁儿童的Minecraft像素风格语音图声音典Web应用

**Architecture:** 使用React + Tailwind CSS构建单页应用，采用useState状态机管理页面路由（cover → category → detail），通过JSON数据驱动内容展示，使用HTML5 Audio播放语音和音效。

**Tech Stack:** Vite, React 18, Tailwind CSS, TypeScript, Vitest, Testing Library

## Global Constraints

- 目标用户：5岁儿童，交互必须简单直观
- 视觉风格：像素风格，致敬Minecraft原版
- 配色方案：主色#4CAF50，背景#87CEEB，强调#FFD700，文字#3E2723
- 字体：Press Start 2P（像素字体）
- 音频格式：Opus优先，AAC/m4a兜底
- 图片格式：PNG（已从Minecraft Wiki下载）
- 音效格式：OGG（已从Minecraft Wiki下载）
- 按钮尺寸：≥80px热区
- 无进度记录、无收藏、无多语言

---

## 文件结构

```
src/
├── components/
│   ├── ui/
│   │   ├── PixelButton.tsx      # 像素风格按钮
│   │   ├── PixelCard.tsx        # 像素风格卡片
│   │   ├── PixelText.tsx        # 像素字体文字
│   │   └── PixelBorder.tsx      # 像素边框
│   ├── screens/
│   │   ├── CoverScreen.tsx      # 首页封面
│   │   ├── CategoryScreen.tsx   # 分类选择
│   │   └── DetailScreen.tsx     # 词条详情
│   └── features/
│       ├── AudioPlayer.tsx      # 音频播放器
│       └── PixelImage.tsx       # 像素风格图片
├── hooks/
│   ├── useAudio.ts              # 音频播放逻辑
│   └── useRouter.ts             # 页面路由逻辑
├── data/
│   ├── entries.json             # 词条数据
│   └── categories.json          # 分类数据
├── styles/
│   └── pixel.css                # 像素风格样式
└── utils/
    └── audio.ts                 # 音频工具函数
```

---

### Task 1: 项目初始化与配置

**Files:**
- Create: `package.json`
- Create: `vite.config.ts`
- Create: `tsconfig.json`
- Create: `tailwind.config.js`
- Create: `src/main.tsx`
- Create: `src/App.tsx`
- Create: `src/index.css`
- Create: `public/index.html`

**Interfaces:**
- Produces: 可运行的Vite + React + Tailwind项目

- [ ] **Step 1: 创建package.json**

```json
{
  "name": "mc-encyclopedia",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "test": "vitest run",
    "test:watch": "vitest"
  },
  "dependencies": {
    "react": "^18.2.0",
    "react-dom": "^18.2.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.0",
    "@types/react-dom": "^18.2.0",
    "@vitejs/plugin-react": "^4.0.0",
    "autoprefixer": "^10.4.0",
    "postcss": "^8.4.0",
    "tailwindcss": "^3.4.0",
    "typescript": "^5.0.0",
    "vite": "^5.0.0",
    "vitest": "^1.0.0",
    "@testing-library/react": "^14.0.0",
    "@testing-library/jest-dom": "^6.0.0",
    "jsdom": "^22.0.0"
  }
}
```

- [ ] **Step 2: 创建vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
})
```

- [ ] **Step 3: 创建tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

- [ ] **Step 4: 创建tsconfig.node.json**

```json
{
  "compilerOptions": {
    "composite": true,
    "skipLibCheck": true,
    "module": "ESNext",
    "moduleResolution": "bundler",
    "allowSyntheticDefaultImports": true
  },
  "include": ["vite.config.ts"]
}
```

- [ ] **Step 5: 创建tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pixel-green': '#4CAF50',
        'pixel-blue': '#87CEEB',
        'pixel-yellow': '#FFD700',
        'pixel-brown': '#3E2723',
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive'],
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 6: 创建postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

- [ ] **Step 7: 创建index.html**

```html
<!DOCTYPE html>
<html lang="zh-CN">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
    <link href="https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap" rel="stylesheet">
    <title>我的世界百科全书</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

- [ ] **Step 8: 创建src/index.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Press Start 2P', cursive;
  background-color: #87CEEB;
  color: #3E2723;
  -webkit-text-size-adjust: 100%;
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
}

#root {
  width: 100%;
  max-width: 100%;
  min-height: 100dvh;
}
```

- [ ] **Step 9: 创建src/main.tsx**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import './index.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
```

- [ ] **Step 10: 创建src/App.tsx**

```typescript
function App() {
  return (
    <div className="min-h-screen bg-pixel-blue flex items-center justify-center">
      <h1 className="text-2xl text-pixel-brown">我的世界百科全书</h1>
    </div>
  )
}

export default App
```

- [ ] **Step 11: 安装依赖并验证**

Run: `npm install && npm run dev`
Expected: 开发服务器启动成功，浏览器显示"我的世界百科全书"

- [ ] **Step 12: 提交**

```bash
git add -A
git commit -m "feat: 初始化项目 - Vite + React + Tailwind CSS"
```

---

### Task 2: 数据层与类型定义

**Files:**
- Create: `src/data/entries.json`
- Create: `src/data/categories.json`
- Create: `src/types/index.ts`

**Interfaces:**
- Produces: Entry, Category类型定义，数据加载函数

- [ ] **Step 1: 创建src/types/index.ts**

```typescript
export interface Entry {
  id: string
  name: string
  category: string
  image: string
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

export type ScreenType = 'cover' | 'category' | 'detail'

export interface ScreenState {
  type: ScreenType
  category?: string
  index?: number
}
```

- [ ] **Step 2: 创建src/data/categories.json**

```json
[
  { "id": "blocks", "name": "方块世界", "icon": "🟫", "color": "#8D6E63" },
  { "id": "animals", "name": "可爱动物", "icon": "🐮", "color": "#FF8A65" },
  { "id": "foods", "name": "好吃食物", "icon": "🍎", "color": "#EF5350" }
]
```

- [ ] **Step 3: 创建src/data/entries.json**

使用现有的entries.json数据，确保格式正确。

- [ ] **Step 4: 创建src/data/utils.ts**

```typescript
import { Entry, Category } from '../types'
import entriesData from './entries.json'
import categoriesData from './categories.json'

export const allEntries: Entry[] = entriesData as Entry[]
export const allCategories: Category[] = categoriesData as Category[]

export function getEntriesByCategory(categoryId: string): Entry[] {
  return allEntries.filter((e) => e.category === categoryId)
}

export function getCategoryById(categoryId: string): Category | undefined {
  return allCategories.find((c) => c.id === categoryId)
}
```

- [ ] **Step 5: 验证数据加载**

创建测试文件 `src/data/__tests__/utils.test.ts`:

```typescript
import { describe, it, expect } from 'vitest'
import { allEntries, allCategories, getEntriesByCategory } from '../utils'

describe('Data Utils', () => {
  it('should load all entries', () => {
    expect(allEntries.length).toBe(33)
  })

  it('should load all categories', () => {
    expect(allCategories.length).toBe(3)
  })

  it('should filter entries by category', () => {
    const animalEntries = getEntriesByCategory('animals')
    expect(animalEntries.length).toBe(12)
  })
})
```

Run: `npm test`
Expected: 所有测试通过

- [ ] **Step 6: 提交**

```bash
git add -A
git commit -m "feat: 添加数据层和类型定义"
```

---

### Task 3: 音频工具函数

**Files:**
- Create: `src/utils/audio.ts`

**Interfaces:**
- Produces: getAudioSrc, getSoundSrc函数

- [ ] **Step 1: 创建src/utils/audio.ts**

```typescript
const AUDIO_EXT = new Audio().canPlayType('audio/ogg; codecs=opus') ? '.opus' : '.m4a'
const SOUND_EXT = '.ogg'

export function getAudioSrc(entryId: string): string {
  return `/audio/${entryId}${AUDIO_EXT}`
}

export function getSoundSrc(soundId: string): string {
  return `/sounds/${soundId}${SOUND_EXT}`
}

export function preloadAudio(src: string): void {
  const audio = new Audio()
  audio.src = src
  audio.preload = 'auto'
}
```

- [ ] **Step 2: 创建测试 `src/utils/__tests__/audio.test.ts`**

```typescript
import { describe, it, expect } from 'vitest'
import { getAudioSrc, getSoundSrc } from '../audio'

describe('Audio Utils', () => {
  it('should return audio src with correct extension', () => {
    const src = getAudioSrc('cow')
    expect(src).toMatch(/\/audio\/cow\.(opus|m4a)$/)
  })

  it('should return sound src with ogg extension', () => {
    const src = getSoundSrc('moo')
    expect(src).toBe('/sounds/moo.ogg')
  })
})
```

Run: `npm test`
Expected: 所有测试通过

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "feat: 添加音频工具函数"
```

---

### Task 4: useAudio Hook

**Files:**
- Create: `src/hooks/useAudio.ts`

**Interfaces:**
- Produces: useAudio Hook，返回 { state, play, pause, toggle }

- [ ] **Step 1: 创建src/hooks/useAudio.ts**

```typescript
import { useState, useRef, useCallback, useEffect } from 'react'
import { getAudioSrc } from '../utils/audio'

export type AudioState = 'idle' | 'loading' | 'playing' | 'paused' | 'error'

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [state, setState] = useState<AudioState>('idle')

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio()
    }
    return audioRef.current
  }, [])

  const play = useCallback((entryId: string) => {
    const audio = getAudio()
    const src = getAudioSrc(entryId)

    if (audio.src !== src) {
      audio.src = src
      audio.load()
    }

    setState('loading')
    audio.play()
      .then(() => setState('playing'))
      .catch(() => setState('error'))
  }, [getAudio])

  const pause = useCallback(() => {
    const audio = getAudio()
    audio.pause()
    setState('paused')
  }, [getAudio])

  const toggle = useCallback((entryId: string) => {
    if (state === 'playing') {
      pause()
    } else {
      play(entryId)
    }
  }, [state, play, pause])

  useEffect(() => {
    const audio = getAudio()

    const onEnded = () => setState('idle')
    const onError = () => setState('error')

    audio.addEventListener('ended', onEnded)
    audio.addEventListener('error', onError)

    return () => {
      audio.removeEventListener('ended', onEnded)
      audio.removeEventListener('error', onError)
      audio.pause()
    }
  }, [getAudio])

  return { state, play, pause, toggle }
}
```

- [ ] **Step 2: 创建测试 `src/hooks/__tests__/useAudio.test.ts`**

```typescript
import { describe, it, expect, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useAudio } from '../useAudio'

describe('useAudio', () => {
  it('should initialize with idle state', () => {
    const { result } = renderHook(() => useAudio())
    expect(result.current.state).toBe('idle')
  })

  it('should have play, pause, toggle functions', () => {
    const { result } = renderHook(() => useAudio())
    expect(typeof result.current.play).toBe('function')
    expect(typeof result.current.pause).toBe('function')
    expect(typeof result.current.toggle).toBe('function')
  })
})
```

Run: `npm test`
Expected: 所有测试通过

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "feat: 添加useAudio Hook"
```

---

### Task 5: useRouter Hook

**Files:**
- Create: `src/hooks/useRouter.ts`

**Interfaces:**
- Produces: useRouter Hook，返回 { screen, goToCover, goToCategory, goToDetail, goNext, goPrev }

- [ ] **Step 1: 创建src/hooks/useRouter.ts**

```typescript
import { useState, useCallback } from 'react'
import { ScreenState } from '../types'
import { getEntriesByCategory } from '../data/utils'

export function useRouter() {
  const [screen, setScreen] = useState<ScreenState>({ type: 'cover' })

  const goToCover = useCallback(() => {
    setScreen({ type: 'cover' })
  }, [])

  const goToCategory = useCallback(() => {
    setScreen({ type: 'category' })
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

  return { screen, goToCover, goToCategory, goToDetail, goNext, goPrev }
}
```

- [ ] **Step 2: 创建测试 `src/hooks/__tests__/useRouter.test.ts`**

```typescript
import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useRouter } from '../useRouter'

describe('useRouter', () => {
  it('should initialize with cover screen', () => {
    const { result } = renderHook(() => useRouter())
    expect(result.current.screen.type).toBe('cover')
  })

  it('should navigate to category', () => {
    const { result } = renderHook(() => useRouter())
    act(() => result.current.goToCategory())
    expect(result.current.screen.type).toBe('category')
  })

  it('should navigate to detail', () => {
    const { result } = renderHook(() => useRouter())
    act(() => result.current.goToDetail('animals', 0))
    expect(result.current.screen.type).toBe('detail')
    expect(result.current.screen.category).toBe('animals')
    expect(result.current.screen.index).toBe(0)
  })
})
```

Run: `npm test`
Expected: 所有测试通过

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "feat: 添加useRouter Hook"
```

---

### Task 6: 基础UI组件

**Files:**
- Create: `src/components/ui/PixelButton.tsx`
- Create: `src/components/ui/PixelCard.tsx`
- Create: `src/components/ui/PixelText.tsx`
- Create: `src/components/ui/PixelBorder.tsx`

**Interfaces:**
- Produces: 像素风格UI组件库

- [ ] **Step 1: 创建src/components/ui/PixelBorder.tsx**

```typescript
import React from 'react'

interface PixelBorderProps {
  children: React.ReactNode
  className?: string
}

export function PixelBorder({ children, className = '' }: PixelBorderProps) {
  return (
    <div className={`border-4 border-pixel-brown shadow-[4px_4px_0px_0px_rgba(62,39,35,1)] ${className}`}>
      {children}
    </div>
  )
}
```

- [ ] **Step 2: 创建src/components/ui/PixelText.tsx**

```typescript
import React from 'react'

interface PixelTextProps {
  children: React.ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
  className?: string
}

const sizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
  xl: 'text-xl',
}

export function PixelText({ children, size = 'md', className = '' }: PixelTextProps) {
  return (
    <p className={`font-pixel ${sizeClasses[size]} ${className}`}>
      {children}
    </p>
  )
}
```

- [ ] **Step 3: 创建src/components/ui/PixelButton.tsx**

```typescript
import React from 'react'
import { PixelBorder } from './PixelBorder'

interface PixelButtonProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
  disabled?: boolean
}

export function PixelButton({ children, onClick, className = '', disabled = false }: PixelButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        touch-target min-w-[80px] min-h-[80px]
        bg-pixel-yellow hover:bg-yellow-400 active:bg-yellow-600
        transition-colors duration-100
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className}
      `}
    >
      <PixelBorder>
        <div className="px-4 py-3 font-pixel text-pixel-brown">
          {children}
        </div>
      </PixelBorder>
    </button>
  )
}
```

- [ ] **Step 4: 创建src/components/ui/PixelCard.tsx**

```typescript
import React from 'react'
import { PixelBorder } from './PixelBorder'

interface PixelCardProps {
  children: React.ReactNode
  onClick?: () => void
  className?: string
}

export function PixelCard({ children, onClick, className = '' }: PixelCardProps) {
  return (
    <div
      onClick={onClick}
      className={`cursor-pointer hover:translate-y-[-2px] transition-transform duration-100 ${className}`}
    >
      <PixelBorder>
        <div className="p-4 bg-white">
          {children}
        </div>
      </PixelBorder>
    </div>
  )
}
```

- [ ] **Step 5: 创建测试 `src/components/ui/__tests__/PixelButton.test.tsx`**

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { PixelButton } from '../PixelButton'

describe('PixelButton', () => {
  it('should render children', () => {
    render(<PixelButton>测试按钮</PixelButton>)
    expect(screen.getByText('测试按钮')).toBeInTheDocument()
  })

  it('should call onClick when clicked', () => {
    const handleClick = vi.fn()
    render(<PixelButton onClick={handleClick}>点击</PixelButton>)
    fireEvent.click(screen.getByText('点击'))
    expect(handleClick).toHaveBeenCalledOnce()
  })
})
```

Run: `npm test`
Expected: 所有测试通过

- [ ] **Step 6: 提交**

```bash
git add -A
git commit -m "feat: 添加基础UI组件"
```

---

### Task 7: PixelImage组件

**Files:**
- Create: `src/components/features/PixelImage.tsx`

**Interfaces:**
- Consumes: Entry类型
- Produces: 图片展示组件，支持加载失败处理

- [ ] **Step 1: 创建src/components/features/PixelImage.tsx**

```typescript
import React, { useState } from 'react'
import { PixelBorder } from '../ui/PixelBorder'

interface PixelImageProps {
  imageId: string
  alt: string
  onClick?: () => void
  className?: string
}

export function PixelImage({ imageId, alt, onClick, className = '' }: PixelImageProps) {
  const [failed, setFailed] = useState(false)

  return (
    <div
      onClick={onClick}
      className={`cursor-pointer ${className}`}
    >
      <PixelBorder>
        <div className="bg-white p-2">
          {!failed ? (
            <img
              src={`/svg/${imageId}.png`}
              alt={alt}
              className="w-full h-full object-contain pixelated"
              onError={() => setFailed(true)}
              style={{ imageRendering: 'pixelated' }}
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-gray-200 min-h-[200px]">
              <span className="text-6xl">❓</span>
            </div>
          )}
        </div>
      </PixelBorder>
    </div>
  )
}
```

- [ ] **Step 2: 创建测试 `src/components/features/__tests__/PixelImage.test.tsx`**

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { PixelImage } from '../PixelImage'

describe('PixelImage', () => {
  it('should render image', () => {
    render(<PixelImage imageId="cow" alt="牛" />)
    const img = screen.getByAlt('牛')
    expect(img).toBeInTheDocument()
    expect(img).toHaveAttribute('src', '/svg/cow.png')
  })
})
```

Run: `npm test`
Expected: 所有测试通过

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "feat: 添加PixelImage组件"
```

---

### Task 8: AudioPlayer组件

**Files:**
- Create: `src/components/features/AudioPlayer.tsx`

**Interfaces:**
- Consumes: useAudio Hook
- Produces: 音频播放器组件

- [ ] **Step 1: 创建src/components/features/AudioPlayer.tsx**

```typescript
import React from 'react'
import { useAudio, AudioState } from '../../hooks/useAudio'
import { PixelButton } from '../ui/PixelButton'

interface AudioPlayerProps {
  entryId: string
  className?: string
}

const stateLabels: Record<AudioState, string> = {
  idle: '▶ 播放',
  loading: '⏳ 加载中',
  playing: '⏸ 暂停',
  paused: '▶ 继续',
  error: '❌ 错误',
}

export function AudioPlayer({ entryId, className = '' }: AudioPlayerProps) {
  const { state, toggle } = useAudio()

  return (
    <div className={className}>
      <PixelButton
        onClick={() => toggle(entryId)}
        disabled={state === 'loading'}
        className="w-full"
      >
        {stateLabels[state]}
      </PixelButton>
    </div>
  )
}
```

- [ ] **Step 2: 创建测试 `src/components/features/__tests__/AudioPlayer.test.tsx`**

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { AudioPlayer } from '../AudioPlayer'

describe('AudioPlayer', () => {
  it('should render play button', () => {
    render(<AudioPlayer entryId="cow" />)
    expect(screen.getByText('▶ 播放')).toBeInTheDocument()
  })
})
```

Run: `npm test`
Expected: 所有测试通过

- [ ] **Step 3: 提交**

```bash
git add -A
git commit -m "feat: 添加AudioPlayer组件"
```

---

### Task 9: 页面组件

**Files:**
- Create: `src/components/screens/CoverScreen.tsx`
- Create: `src/components/screens/CategoryScreen.tsx`
- Create: `src/components/screens/DetailScreen.tsx`

**Interfaces:**
- Consumes: useRouter, useAudio, 数据工具函数
- Produces: 三个页面组件

- [ ] **Step 1: 创建src/components/screens/CoverScreen.tsx**

```typescript
import React from 'react'
import { PixelButton } from '../ui/PixelButton'
import { PixelText } from '../ui/PixelText'

interface CoverScreenProps {
  onExplore: () => void
}

export function CoverScreen({ onExplore }: CoverScreenProps) {
  return (
    <div className="min-h-screen bg-pixel-blue flex flex-col items-center justify-center p-6">
      <div className="text-8xl mb-8">🌳</div>
      <PixelText size="xl" className="mb-4 text-center">
        我的世界百科全书
      </PixelText>
      <PixelText size="md" className="mb-12 text-center text-gray-600">
        听一听，看一看，认识方块世界！
      </PixelText>
      <PixelButton onClick={onExplore}>
        开始探索
      </PixelButton>
    </div>
  )
}
```

- [ ] **Step 2: 创建src/components/screens/CategoryScreen.tsx**

```typescript
import React from 'react'
import { allCategories } from '../../data/utils'
import { PixelCard } from '../ui/PixelCard'
import { PixelText } from '../ui/PixelText'
import { PixelButton } from '../ui/PixelButton'

interface CategoryScreenProps {
  onSelectCategory: (categoryId: string) => void
  onBack: () => void
}

export function CategoryScreen({ onSelectCategory, onBack }: CategoryScreenProps) {
  return (
    <div className="min-h-screen bg-pixel-blue p-6">
      <div className="mb-6">
        <PixelButton onClick={onBack} className="w-auto px-4">
          ← 返回
        </PixelButton>
      </div>
      <PixelText size="lg" className="text-center mb-8">
        选一个看看
      </PixelText>
      <div className="flex flex-col gap-6 max-w-md mx-auto">
        {allCategories.map((cat) => (
          <PixelCard
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
          >
            <div className="flex items-center gap-4">
              <span className="text-5xl">{cat.icon}</span>
              <PixelText size="lg">{cat.name}</PixelText>
            </div>
          </PixelCard>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 创建src/components/screens/DetailScreen.tsx**

```typescript
import React from 'react'
import { Entry } from '../../types'
import { PixelButton } from '../ui/PixelButton'
import { PixelText } from '../ui/PixelText'
import { PixelImage } from '../features/PixelImage'
import { AudioPlayer } from '../features/AudioPlayer'

interface DetailScreenProps {
  entry: Entry
  onBack: () => void
  onPrev: () => void
  onNext: () => void
  onImageClick: () => void
}

export function DetailScreen({ entry, onBack, onPrev, onNext, onImageClick }: DetailScreenProps) {
  return (
    <div className="min-h-screen bg-pixel-blue p-4">
      <div className="flex justify-between items-center mb-4">
        <PixelButton onClick={onBack} className="w-auto px-4">
          ← 返回
        </PixelButton>
        <PixelText size="md">{entry.name}</PixelText>
        <div className="w-20"></div>
      </div>

      <div className="max-w-md mx-auto">
        <PixelImage
          imageId={entry.image}
          alt={entry.name}
          onClick={onImageClick}
          className="mb-6"
        />

        <AudioPlayer entryId={entry.audio} className="mb-6" />

        <div className="bg-white border-4 border-pixel-brown p-4 mb-6">
          <PixelText size="md">{entry.displayText}</PixelText>
        </div>

        <div className="bg-pixel-yellow border-4 border-pixel-brown p-4 mb-6">
          <PixelText size="sm">💡 {entry.fact}</PixelText>
        </div>

        <div className="flex gap-4">
          <PixelButton onClick={onPrev} className="flex-1">
            ← 上一个
          </PixelButton>
          <PixelButton onClick={onNext} className="flex-1">
            下一个 →
          </PixelButton>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 4: 创建测试 `src/components/screens/__tests__/CoverScreen.test.tsx`**

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { CoverScreen } from '../CoverScreen'

describe('CoverScreen', () => {
  it('should render title and button', () => {
    render(<CoverScreen onExplore={() => {}} />)
    expect(screen.getByText('我的世界百科全书')).toBeInTheDocument()
    expect(screen.getByText('开始探索')).toBeInTheDocument()
  })

  it('should call onExplore when button clicked', () => {
    const handleExplore = vi.fn()
    render(<CoverScreen onExplore={handleExplore} />)
    fireEvent.click(screen.getByText('开始探索'))
    expect(handleExplore).toHaveBeenCalledOnce()
  })
})
```

Run: `npm test`
Expected: 所有测试通过

- [ ] **Step 5: 提交**

```bash
git add -A
git commit -m "feat: 添加页面组件"
```

---

### Task 10: 应用集成与路由

**Files:**
- Modify: `src/App.tsx`

**Interfaces:**
- Consumes: useRouter, 所有页面组件
- Produces: 完整的应用路由

- [ ] **Step 1: 更新src/App.tsx**

```typescript
import React from 'react'
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
      <div className="min-h-screen bg-pixel-blue flex items-center justify-center">
        <p className="font-pixel text-pixel-brown">找不到词条</p>
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
```

- [ ] **Step 2: 创建集成测试 `src/__tests__/App.test.tsx`**

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import App from '../App'

describe('App Integration', () => {
  it('should render cover screen initially', () => {
    render(<App />)
    expect(screen.getByText('我的世界百科全书')).toBeInTheDocument()
  })

  it('should navigate to category screen', () => {
    render(<App />)
    fireEvent.click(screen.getByText('开始探索'))
    expect(screen.getByText('选一个看看')).toBeInTheDocument()
  })

  it('should navigate to detail screen', () => {
    render(<App />)
    fireEvent.click(screen.getByText('开始探索'))
    fireEvent.click(screen.getByText('方块世界'))
    expect(screen.getByText('草方块')).toBeInTheDocument()
  })
})
```

Run: `npm test`
Expected: 所有测试通过

- [ ] **Step 3: 验证完整流程**

Run: `npm run dev`
手动测试：
1. 首页显示正确
2. 点击"开始探索"进入分类
3. 点击分类进入详情
4. 点击播放按钮播放音频
5. 点击"上一个/下一个"切换词条
6. 点击返回回到分类

- [ ] **Step 4: 提交**

```bash
git add -A
git commit -m "feat: 完成应用集成"
```

---

### Task 11: 样式优化与像素效果

**Files:**
- Modify: `src/index.css`
- Modify: `tailwind.config.js`

**Interfaces:**
- Produces: 像素风格视觉效果

- [ ] **Step 1: 更新src/index.css添加像素效果**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  font-family: 'Press Start 2P', cursive;
  background-color: #87CEEB;
  color: #3E2723;
  -webkit-text-size-adjust: 100%;
  touch-action: manipulation;
  user-select: none;
  -webkit-user-select: none;
}

#root {
  width: 100%;
  max-width: 100%;
  min-height: 100dvh;
}

/* 像素风格图片渲染 */
.pixelated {
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
}

/* 像素风格动画 */
@keyframes pixel-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-4px); }
}

.animate-pixel-bounce {
  animation: pixel-bounce 0.3s ease-in-out;
}

/* 触摸目标大小 */
.touch-target {
  min-width: 80px;
  min-height: 80px;
}
```

- [ ] **Step 2: 更新tailwind.config.js添加像素动画**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'pixel-green': '#4CAF50',
        'pixel-blue': '#87CEEB',
        'pixel-yellow': '#FFD700',
        'pixel-brown': '#3E2723',
      },
      fontFamily: {
        'pixel': ['"Press Start 2P"', 'cursive'],
      },
      animation: {
        'pixel-bounce': 'pixel-bounce 0.3s ease-in-out',
      },
    },
  },
  plugins: [],
}
```

- [ ] **Step 3: 验证样式效果**

Run: `npm run dev`
检查：
1. 像素字体正确加载
2. 图片像素化渲染
3. 边框效果正确
4. 按钮交互效果

- [ ] **Step 4: 提交**

```bash
git add -A
git commit -m "feat: 添加像素风格样式效果"
```

---

### Task 12: 最终验证与构建

**Files:**
- Verify: 所有文件

**Interfaces:**
- Produces: 可部署的应用

- [ ] **Step 1: 运行所有测试**

Run: `npm test`
Expected: 所有测试通过

- [ ] **Step 2: 构建生产版本**

Run: `npm run build`
Expected: 构建成功，无错误

- [ ] **Step 3: 验证生产版本**

Run: `npm run preview`
手动验证所有功能正常

- [ ] **Step 4: 最终提交**

```bash
git add -A
git commit -m "feat: 完成重新设计 - 像素风格Minecraft百科全书"
```

---

## 执行选项

**Plan complete and saved to `docs/superpowers/plans/2026-06-24-mc-encyclopedia-redesign.md`. Two execution options:**

**1. Subagent-Driven (recommended)** - 每个任务分发一个新的子代理，任务间进行审查，快速迭代

**2. Inline Execution** - 在当前会话中使用executing-plans执行任务，批量执行并设置检查点

**选择哪种方式？**
