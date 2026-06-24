# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

"我的世界百科全书"——面向 5 岁儿童的 Minecraft 像素风格语音图声音典。核心体验是"听"而非"读"：孩子点击即可听到语音朗读，配合像素风格插画和互动音效。

**设计文档**：`docs/superpowers/specs/2026-06-24-mc-encyclopedia-redesign.md`
**实现计划**：`docs/superpowers/plans/2026-06-24-mc-encyclopedia-redesign.md`

## 技术栈

| 层 | 选型 |
|---|---|
| 构建 | Vite |
| 框架 | React 18 |
| 样式 | Tailwind CSS |
| 路由 | `useState` 状态机（无 react-router） |
| 数据 | JSON + import |
| 测试 | Vitest + Testing Library |

## 架构要点

### 状态机路由（非 react-router）

```typescript
type Screen =
  | { type: 'cover' }
  | { type: 'category' }
  | { type: 'detail'; category: string; index: number };
```

- 禁用浏览器历史，避免儿童误触后退
- 简单的返回按钮导航

### 数据驱动 + 动态资源加载

- `src/data/entries.json`：33 条词条的核心数据源
- `src/data/categories.json`：三大分类（方块世界/可爱动物/好吃食物）元数据
- 图片/音效/语音均通过 JSON 字段动态拼接路径加载
- **加内容 = 改 JSON + 往 public 目录加文件**，代码无需改动
- 排序规则：同分类内按 JSON 数组顺序展示

### 文件结构

```
src/
├── components/
│   ├── ui/                    # 基础UI组件
│   │   ├── PixelButton.tsx   # 像素风格按钮
│   │   ├── PixelCard.tsx     # 像素风格卡片
│   │   ├── PixelText.tsx     # 像素字体文字
│   │   └── PixelBorder.tsx   # 像素边框
│   ├── screens/               # 页面组件
│   │   ├── CoverScreen.tsx   # 首页封面
│   │   ├── CategoryScreen.tsx # 分类选择
│   │   └── DetailScreen.tsx  # 词条详情
│   └── features/              # 功能组件
│       ├── AudioPlayer.tsx   # 音频播放器
│       └── PixelImage.tsx    # 像素风格图片
├── hooks/
│   ├── useAudio.ts           # 音频播放逻辑
│   └── useRouter.ts          # 页面路由逻辑
├── data/
│   ├── entries.json          # 词条数据
│   └── categories.json       # 分类数据
├── styles/
│   └── pixel.css             # 像素风格样式
└── utils/
    └── audio.ts              # 音频工具函数
```

### 视觉风格

- **像素风格**：致敬 Minecraft 原版，方块感强
- **字体**：Press Start 2P（像素字体）
- **配色**：主色 #4CAF50，背景 #87CEEB，强调 #FFD700，文字 #3E2723

### 音频策略

- 格式优先 Opus（体积小），iOS 兼容用 AAC/m4a 兜底
- 运行时通过 `Audio.canPlayType('audio/ogg; codecs=opus')` 检测
- 点击播放按钮开始朗读，再次点击暂停
- 播放中点击插画播放音效，朗读优先级高于音效

### 移动端优先

- 竖屏优先，横屏自适应
- 按钮可触发热区 ≥80px
- 禁用缩放、下拉刷新

## 常用命令

```bash
# 开发
npm run dev

# 构建
npm run build

# 测试
npm test

# 测试（监听模式）
npm run test:watch

# 预览生产版本
npm run preview
```

## 关键约束

- **简单直观**：大按钮、清晰图标、最少文字，5岁儿童能独立操作
- **像素风格**：无圆角边框、像素字体、8-bit配色
- **即时反馈**：每次操作都有音效和动画响应
- **错误兜底**：图片加载失败显示占位图，音频播放失败显示错误提示
- **触摸优化**：按钮 ≥80px 热区，touch-action: manipulation
