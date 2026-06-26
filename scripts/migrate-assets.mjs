import { readFileSync, existsSync, mkdirSync, copyFileSync, readdirSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const imagesDir = resolve(root, 'public/images');
const audioDir = resolve(root, 'public/audio');
const soundsDir = resolve(root, 'public/sounds');

const entries = JSON.parse(readFileSync(resolve(root, 'src/data/entries.json'), 'utf-8'));

// 新条目的颜色映射（用于生成占位图）
const COLOR_MAP = {
  // blocks
  cobblestone: '#808080', gravel: '#9E9E9E', clay_block: '#BCAAA4',
  sandstone: '#D7CCC8', copper_ore: '#E65100', planks: '#A1887F', wool: '#ECEFF1',
  // items
  bucket: '#78909C', compass: '#EF5350', clock: '#FFB300', map: '#8D6E63',
  lead: '#6D4C41', name_tag: '#90A4AE', saddle: '#795548',
  // equipment
  iron_sword: '#B0BEC5', diamond_sword: '#4FC3F7', bow: '#8D6E63',
  iron_pickaxe: '#B0BEC5', diamond_pickaxe: '#4FC3F7', iron_axe: '#B0BEC5',
  iron_shovel: '#B0BEC5', leather_armor: '#A1887F', iron_armor: '#B0BEC5',
  diamond_armor: '#4FC3F7', shield: '#8D6E63', fishing_rod: '#8D6E63',
  trident: '#26A69A', crossbow: '#8D6E63', elytra: '#7986CB', totem: '#FFB300',
  // monsters
  zombie: '#2E7D32', skeleton: '#ECEFF1', spider: '#424242', enderman: '#1A1A1A',
  slime: '#66BB6A', witch: '#7B1FA2', blaze: '#FF6F00', wither_skeleton: '#212121',
  phantom: '#5C6BC0', vindicator: '#455A64', evoker: '#4A148C',
  // animals
  squid: '#37474F', glow_squid: '#00E5FF', frog: '#4CAF50',
  allay: '#42A5F5', camel: '#D7CCC8', sniffer: '#6D4C41',
};

// 新条目的音效映射
const SOUND_MAP = {
  cobblestone: 'stone', gravel: 'dirt', clay_block: 'dirt', sandstone: 'stone',
  copper_ore: 'iron', planks: 'wood', wool: 'grass',
  bucket: 'iron', compass: 'redstone', clock: 'gold', map: 'grass',
  lead: 'grass', name_tag: 'grass', saddle: 'grass',
  iron_sword: 'iron', diamond_sword: 'diamond', bow: 'grass',
  iron_pickaxe: 'iron', diamond_pickaxe: 'diamond', iron_axe: 'iron',
  iron_shovel: 'iron', leather_armor: 'grass', iron_armor: 'iron',
  diamond_armor: 'diamond', shield: 'wood', fishing_rod: 'water',
  trident: 'water', crossbow: 'wood', elytra: 'grass', totem: 'gold',
  zombie: 'dirt', skeleton: 'stone', spider: 'stone', enderman: 'stone',
  slime: 'dirt', witch: 'glass', blaze: 'lava', wither_skeleton: 'stone',
  phantom: 'grass', vindicator: 'stone', evoker: 'stone',
  squid: 'water', glow_squid: 'water', frog: 'water',
  allay: 'grass', camel: 'llama', sniffer: 'grass',
};

// 新条目的语音时长（秒）
const DURATION_MAP = {
  cobblestone: 16, gravel: 16, clay_block: 16, sandstone: 16, copper_ore: 16,
  planks: 16, wool: 16, bucket: 16, compass: 16, clock: 16, map: 16,
  lead: 16, name_tag: 16, saddle: 16, iron_sword: 16, diamond_sword: 17,
  bow: 16, iron_pickaxe: 16, diamond_pickaxe: 17, iron_axe: 16, iron_shovel: 16,
  leather_armor: 16, iron_armor: 16, diamond_armor: 17, shield: 16,
  fishing_rod: 16, trident: 17, crossbow: 16, elytra: 17, totem: 16,
  zombie: 17, skeleton: 17, spider: 17, enderman: 17, slime: 16,
  witch: 17, blaze: 17, wither_skeleton: 17, phantom: 17, vindicator: 17,
  evoker: 17, squid: 16, glow_squid: 16, frog: 16, allay: 16, camel: 16,
  sniffer: 16,
};

// 1. 创建新目录结构
console.log('=== 创建目录 ===');
for (const cat of ['blocks', 'items', 'equipment', 'monsters', 'animals']) {
  mkdirSync(resolve(imagesDir, cat), { recursive: true });
}

// 2. 移动现有图片到新分类
console.log('\n=== 移动现有图片 ===');
const imageMoves = [
  // foods → items
  ['foods', 'items', ['apple', 'beef', 'berries', 'bread', 'cake', 'carrot', 'cooked_beef',
    'cookie', 'golden_apple', 'honey', 'milk', 'mushroom_stew', 'potato', 'pumpkin_pie', 'wheat']],
  // animals → monsters
  ['animals', 'monsters', ['creeper']],
];

for (const [from, to, names] of imageMoves) {
  for (const name of names) {
    const src = resolve(imagesDir, from, `${name}.webp`);
    const dst = resolve(imagesDir, to, `${name}.webp`);
    if (existsSync(src)) {
      copyFileSync(src, dst);
      console.log(`  ${from}/${name}.webp → ${to}/`);
    }
  }
}

// 3. 生成占位图片（使用 sharp）
console.log('\n=== 生成占位图片 ===');
const sharp = (await import('sharp')).default;

let generated = 0;
let skipped = 0;
for (const entry of entries) {
  const imgPath = resolve(imagesDir, entry.category, `${entry.image}.webp`);
  if (existsSync(imgPath)) { skipped++; continue; }

  const color = COLOR_MAP[entry.image] || '#BDBDBD';
  const [r, g, b] = hexToRgb(color);

  // 创建 64x64 带简单纹理的占位图
  const svg = `<svg width="64" height="64" xmlns="http://www.w3.org/2000/svg">
    <rect width="64" height="64" fill="${color}"/>
    <rect x="2" y="2" width="60" height="60" fill="none" stroke="rgba(255,255,255,0.3)" stroke-width="2" rx="4"/>
    <text x="32" y="36" text-anchor="middle" font-size="10" fill="rgba(255,255,255,0.8)" font-family="sans-serif">${entry.name.slice(0, 3)}</text>
  </svg>`;

  await sharp(Buffer.from(svg)).resize(64, 64).webp({ quality: 80 }).toFile(imgPath);
  generated++;
}
console.log(`  生成 ${generated} 个，跳过 ${skipped} 个已有图片`);

// 4. 生成静音音频文件
console.log('\n=== 生成音频文件 ===');
let audioGenerated = 0;
for (const entry of entries) {
  const opusPath = resolve(audioDir, `${entry.audio}.opus`);
  const m4aPath = resolve(audioDir, `${entry.audio}.m4a`);
  if (existsSync(opusPath) || existsSync(m4aPath)) continue;

  const dur = DURATION_MAP[entry.id] || 16;
  try {
    execSync(`ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t ${dur} -c:a libopus -b:a 1k "${opusPath}" -y`, { stdio: 'pipe' });
    audioGenerated++;
  } catch {
    console.log(`  ⚠ 无法生成 ${entry.audio}.opus`);
  }
}
console.log(`  生成 ${audioGenerated} 个静音音频`);

// 5. 清理旧目录（foods）
const foodsDir = resolve(imagesDir, 'foods');
if (existsSync(foodsDir)) {
  rmSync(foodsDir, { recursive: true });
  console.log('\n  已删除旧 public/images/foods/ 目录');
}

// 6. 清理旧的 other 目录
const otherDir = resolve(imagesDir, 'other');
if (existsSync(otherDir)) {
  rmSync(otherDir, { recursive: true });
  console.log('  已删除旧 public/images/other/ 目录');
}

console.log('\n✅ 迁移完成');

function hexToRgb(hex) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}
