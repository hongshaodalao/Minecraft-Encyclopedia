# CLAUDE.md

本文件为 Claude Code (claude.ai/code) 提供项目指导。

## 项目概述

"我的世界百科全书"——面向 5 岁儿童的手绘绘本风格语音图声音典。核心体验是"听"而非"读"：孩子点击即可听到语音朗读，配合手绘风格插画和互动音效。

**设计文档**：`docs/superpowers/specs/2026-06-24-mc-encyclopedia-redesign.md`

## 技术栈

| 层 | 选型 |
|---|---|
| 构建 | Vite |
| 框架 | React 18 |
| 样式 | Tailwind CSS v4 |
| 路由 | `useState` 状态机（无 react-router） |
| 数据 | JSON + import |
| 测试 | Vitest + Testing Library |

## 架构要点

### 状态机路由

```typescript
type Screen =
  | { type: 'cover' }
  | { type: 'category' }
  | { type: 'list'; category: string }
  | { type: 'detail'; category: string; index: number };
```

- 四屏结构：首页 → 分类 → 列表 → 详情
- 禁用浏览器历史，避免儿童误触后退
- 简单的返回按钮导航

### 数据驱动

- `src/data/entries.json`：53 条词条的核心数据源
- `src/data/categories.json`：三大分类（方块世界/可爱动物/好吃食物）
- 图片/音效/语音均通过 JSON 字段动态拼接路径加载
- **加内容 = 改 JSON + 往 public 目录加文件**，代码无需改动

### 文件结构

```
src/
├── components/
│   ├── screens/               # 页面组件
│   │   ├── CoverScreen.tsx   # 首页封面
│   │   ├── CategoryScreen.tsx # 分类选择
│   │   ├── EntryListScreen.tsx # 词条列表
│   │   └── DetailScreen.tsx  # 词条详情
│   └── features/              # 功能组件
│       ├── AudioPlayer.tsx   # 音频播放器
│       └── PixelImage.tsx    # 图片组件
├── hooks/
│   ├── useAudio.ts           # 音频播放逻辑
│   └── useRouter.ts          # 页面路由逻辑
├── data/
│   ├── entries.json          # 词条数据（53条）
│   └── categories.json       # 分类数据
└── types/
    └── index.ts              # 类型定义
```

### 视觉风格

- **手绘绘本风格**：温暖色调、圆角、柔和阴影
- **字体**：Nunito（圆润可爱）
- **配色**：米白背景 #FFF8E1、棕色文字 #5D4037、绿色强调 #4CAF50

### 音频策略

- 格式优先 Opus，iOS 兼容用 AAC/m4a 兜底
- 运行时通过 `Audio.canPlayType('audio/ogg; codecs=opus')` 检测
- 点击播放按钮开始朗读，再次点击暂停
- 播放中点击插画播放音效
- 语音文件缺失时显示友好提示

### 移动端优先

- 竖屏优先，横屏自适应
- 按钮可触发热区 ≥80px
- 禁用缩放、下拉刷新
- 内容居中显示

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

## 内容分类

### 方块世界（26个）
草方块、泥土、木头、石头、沙子、水、岩浆、煤炭、铁矿、金矿、钻石、红石、玻璃、火把、熔炉、箱子、床、门、TNT、书架、砖块、南瓜、仙人掌、黑曜石、雪块、冰

### 可爱动物（20种）
牛、羊、猪、鸡、马、狼、猫、兔子、羊驼、蜜蜂、海龟、苦力怕、狐狸、熊猫、海豚、美西螈、山羊、哞菇、北极熊、鹦鹉

### 好吃食物（13种）
苹果、面包、胡萝卜、马铃薯、小麦、甜浆果、蛋糕、牛奶、曲奇、南瓜派、金苹果、生牛肉、牛排、蜂蜜、蘑菇煲

## 关键约束

- **简单直观**：大按钮、清晰图标、最少文字，5岁儿童能独立操作
- **手绘风格**：温暖色调、圆角、柔和阴影
- **即时反馈**：每次操作都有音效和动画响应
- **错误兜底**：图片加载失败显示占位图，音频播放失败显示错误提示
- **触摸优化**：按钮 ≥80px 热区，touch-action: manipulation
