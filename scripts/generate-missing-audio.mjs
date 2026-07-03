import { existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// 缺失的音效映射（使用已有的音效替代）
const SOUND_MAP = {
  // 怪物音效
  ghast: 'hiss',
  guardian: 'hiss',
  shulker: 'hiss',
  warden: 'hiss',
  piglin: 'hiss',
  strider: 'hiss',
  pillager: 'hiss',
  ravager: 'hiss',
  vex: 'hiss',
  // 动物音效
  donkey: 'neigh',
  mule: 'neigh',
  bat: 'hiss',
  villager: 'hiss',
  wandering_trader: 'hiss',
  ocelot: 'meow',
  // 物品音效
  bone: 'dirt',
  string: 'grass',
  feather: 'grass',
  // 怪物音效（使用已有音效）
  zombie: 'hiss',
  skeleton: 'hiss',
  creeper: 'hiss',
  slime: 'hiss',
  snow: 'dirt',
  frog: 'hiss',
};

// 缺失的音频映射（生成静音音频）
const AUDIO_MAP = {
  ghast: 17,
  guardian: 17,
  shulker: 17,
  warden: 17,
  piglin: 17,
  strider: 16,
  bone: 16,
  string: 16,
  feather: 16,
  donkey: 16,
  mule: 16,
  bat: 16,
  villager: 16,
  wandering_trader: 16,
  pillager: 17,
  ravager: 17,
  vex: 16,
};

// 生成音效文件（复制已有的音效）
console.log('=== 生成缺失的音效文件 ===');
const soundsDir = resolve(root, 'public/sounds');
mkdirSync(soundsDir, { recursive: true });

let soundGenerated = 0;
for (const [id, sourceId] of Object.entries(SOUND_MAP)) {
  const destPath = resolve(soundsDir, `${id}.ogg`);
  if (existsSync(destPath)) continue;

  const srcPath = resolve(soundsDir, `${sourceId}.ogg`);
  if (!existsSync(srcPath)) {
    console.log(`  ⚠️ 源音效不存在: ${sourceId}.ogg`);
    continue;
  }

  try {
    execSync(`cp "${srcPath}" "${destPath}"`);
    soundGenerated++;
    console.log(`  ✅ ${id}.ogg (复制自 ${sourceId}.ogg)`);
  } catch {
    console.log(`  ❌ ${id}.ogg 复制失败`);
  }
}
console.log(`  生成 ${soundGenerated} 个音效文件`);

// 生成静音音频文件
console.log('\n=== 生成缺失的音频文件 ===');
const audioDir = resolve(root, 'public/audio');
mkdirSync(audioDir, { recursive: true });

let audioGenerated = 0;
for (const [id, duration] of Object.entries(AUDIO_MAP)) {
  const opusPath = resolve(audioDir, `${id}.opus`);
  const m4aPath = resolve(audioDir, `${id}.m4a`);
  if (existsSync(opusPath) || existsSync(m4aPath)) continue;

  try {
    execSync(`ffmpeg -f lavfi -i anullsrc=r=44100:cl=mono -t ${duration} -c:a libopus -b:a 1k "${opusPath}" -y`, { stdio: 'pipe' });
    audioGenerated++;
    console.log(`  ✅ ${id}.opus (${duration}秒)`);
  } catch {
    console.log(`  ⚠️ ${id}.opus 生成失败`);
  }
}
console.log(`  生成 ${audioGenerated} 个音频文件`);

console.log('\n✅ 完成');
