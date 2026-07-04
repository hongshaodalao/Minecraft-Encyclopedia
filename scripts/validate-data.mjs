import { readFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const entries = JSON.parse(readFileSync(resolve(root, 'src/data/entries.json'), 'utf-8'));
const categories = JSON.parse(readFileSync(resolve(root, 'src/data/categories.json'), 'utf-8'));

const VALID_CATEGORIES = categories.map((c) => c.id);
let errors = [];

// 检查 id 唯一性
const ids = new Set();
for (const entry of entries) {
  if (ids.has(entry.id)) {
    errors.push(`重复的 id: ${entry.id}`);
  }
  ids.add(entry.id);
}

// 检查每个条目
for (const entry of entries) {
  const prefix = `[${entry.id}]`;

  // category 值合法
  if (!VALID_CATEGORIES.includes(entry.category)) {
    errors.push(`${prefix} category "${entry.category}" 不在有效范围内`);
  }

  // 音频文件存在（检查 .wav、.m4a 和 .opus）
  const audioPathWav = resolve(root, 'public/audio', `${entry.audio}.wav`);
  const audioPathOpus = resolve(root, 'public/audio', `${entry.audio}.opus`);
  const audioPathM4a = resolve(root, 'public/audio', `${entry.audio}.m4a`);
  if (!existsSync(audioPathWav) && !existsSync(audioPathOpus) && !existsSync(audioPathM4a)) {
    errors.push(`${prefix} 音频文件不存在: public/audio/${entry.audio}.wav、.opus 或 .m4a`);
  }

  // 图片文件存在（WebP格式，按分类存放）
  const imgPath = resolve(root, 'public/images', entry.category, `${entry.image}.webp`);
  if (!existsSync(imgPath)) {
    errors.push(`${prefix} 图片文件不存在: public/images/${entry.category}/${entry.image}.webp`);
  }

  // 音效文件存在（OGG格式）
  const soundPath = resolve(root, 'public/sounds', `${entry.sound}.ogg`);
  if (!existsSync(soundPath)) {
    errors.push(`${prefix} 音效文件不存在: public/sounds/${entry.sound}.ogg`);
  }

  // audioDuration 合理范围
  if (entry.audioDuration < 10 || entry.audioDuration > 40) {
    errors.push(`${prefix} audioDuration ${entry.audioDuration} 不在 10-40 秒范围内`);
  }
}

if (errors.length > 0) {
  console.error('❌ 数据校验失败:');
  for (const err of errors) {
    console.error(`  - ${err}`);
  }
  process.exit(1);
} else {
  console.log(`✅ 数据校验通过: ${entries.length} 条词条, ${categories.length} 个分类`);
}
