# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## 项目概述

"我的世界百科全书"——面向 5 岁儿童的手绘绘本风格语音图声音典。核心体验是"听"而非"读"：孩子点击即可听到语音朗读，配合手绘风格插画和互动音效。

**设计文档**：`docs/superpowers/specs/2026-06-24-mc-encyclopedia-redesign.md`

## 技术栈

| 层 | 选型 |
|---|---|
| 构建 | Vite |
| 框架 | React 19 |
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

- `src/data/entries.json`：108 条词条的核心数据源
- `src/data/categories.json`：三大分类（方块世界/可爱动物/好吃食物）
- `src/schemas/entry.schema.ts`：Zod schema 定义数据结构，`data/utils.ts` 加载时自动校验
- 图片（WebP）按分类存放：`public/images/{blocks|animals|foods}/{id}.webp`
- 音效（OGG）：`public/sounds/{id}.ogg`，语音（m4a/opus）：`public/audio/{id}`
- **加内容 = 改 JSON + 往 public 目录加文件**，代码无需改动
- 改完后运行 `npm run validate-data` 校验数据格式

### 文件结构

```
src/
├── App.tsx                    # 根组件，根据 screen 状态渲染对应页面
├── components/
│   ├── screens/               # 页面组件
│   │   ├── CoverScreen.tsx
│   │   ├── CategoryScreen.tsx
│   │   ├── EntryListScreen.tsx
│   │   └── DetailScreen.tsx
│   ├── features/              # 功能组件
│   │   ├── AudioPlayer.tsx
│   │   └── PixelImage.tsx
│   └── ui/                    # 基础 UI 组件（Pixel 风格）
│       ├── PixelBorder.tsx
│       ├── PixelButton.tsx
│       ├── PixelCard.tsx
│       └── PixelText.tsx
├── hooks/
│   ├── useAudio.ts            # 音频播放逻辑
│   ├── useRouter.ts           # 页面路由逻辑
│   └── useProgress.ts         # 学习进度追踪
├── data/
│   ├── entries.json           # 词条数据（53条）
│   ├── categories.json        # 分类数据
│   └── utils.ts               # 数据查询工具函数
├── schemas/
│   └── entry.schema.ts        # Zod schema，运行时数据校验
└── types/
    └── index.ts               # 手写 TS 类型定义
```

**类型系统注意**：项目同时存在两套类型——`types/index.ts`（手写接口）和 `schemas/entry.schema.ts`（Zod 推导类型）。`data/utils.ts` 使用 Zod schema 做运行时校验，组件中使用手写类型。新增字段时两边都要更新。

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
npm run dev            # 启动开发服务器（localhost:5173）
npm run build          # TypeScript 编译 + Vite 构建
npm test               # 运行测试（单次）
npm run test:watch     # 测试监听模式
npm run lint           # oxlint 静态检查
npm run validate-data  # 校验 entries.json / categories.json 数据完整性
npm run preview        # 预览生产构建
```

**测试**：使用 Vitest + Testing Library，测试文件放在 `__tests__/` 目录下。运行单个测试：`npx vitest run <文件路径>`

**Lint**：使用 oxlint（非 ESLint），配置文件 `.oxlintrc.json`，已启用 React/TypeScript 插件。

## 内容分类（5类，共108条）

### 方块（33个）
草方块、泥土、石头、圆石、沙子、砂砾、黏土块、水、岩浆、木头、砂岩、煤炭、铁矿、金矿、钻石、铜矿、红石、玻璃、火把、熔炉、箱子、床、门、TNT、书架、砖块、南瓜、仙人掌、黑曜石、雪块、冰、木板、羊毛

### 物品（24个）
苹果、面包、胡萝卜、马铃薯、小麦、甜浆果、蛋糕、牛奶、曲奇、南瓜派、金苹果、生牛肉、牛排、蜂蜜、蘑菇煲、铁桶、指南针、时钟、地图、拴绳、命名牌、鞍

### 装备（16个）
铁剑、钻石剑、弓、铁镐、钻石镐、铁斧、铁铲、皮革甲、铁甲、钻石甲、盾牌、钓鱼竿、三叉戟、弩、鞘翅、不死图腾

### 怪物（12个）
僵尸、骷髅、蜘蛛、苦力怕、末影人、史莱姆、女巫、烈焰人、凋灵骷髅、幻翼、卫道士、唤魔者

### 动物（25个）
牛、羊、猪、鸡、马、狼、猫、兔子、羊驼、蜜蜂、海龟、狐狸、熊猫、海豚、美西螈、山羊、哞菇、北极熊、鹦鹉、鱿鱼、发光鱿鱼、青蛙、悦灵、骆驼、嗅探兽

## 关键约束

- **简单直观**：大按钮、清晰图标、最少文字，5岁儿童能独立操作
- **手绘风格**：温暖色调、圆角、柔和阴影
- **即时反馈**：每次操作都有音效和动画响应
- **错误兜底**：图片加载失败显示占位图，音频播放失败显示错误提示
- **触摸优化**：按钮 ≥80px 热区，touch-action: manipulation
