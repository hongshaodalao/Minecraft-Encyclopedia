import { existsSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

// 缺失的音效映射
const SOUND_MAP = {
  breeze: 'hiss',
  creaking: 'hiss',
  ender_dragon: 'hiss',
  wither: 'hiss',
  armadillo: 'hiss',
  wolf: 'howl',
  squid: 'hiss',
  glow_squid: 'hiss',
  sniffer: 'hiss',
  camel: 'hiss',
  allay: 'hiss',
  amethyst: 'glass',
  copper: 'iron',
  spyglass: 'glass',
  brush: 'grass',
  wind_charge: 'hiss',
  trial_key: 'iron',
  ominous_trial_key: 'iron',
  mace: 'iron',
  wind_charge_launcher: 'iron',
};

// 缺失的音频映射
const AUDIO_MAP = {
  breeze: 17,
  creaking: 17,
  ender_dragon: 17,
  wither: 17,
  armadillo: 16,
  glow_squid: 16,
  sniffer: 16,
  camel: 16,
  allay: 16,
  amethyst: 16,
  copper: 16,
  spyglass: 16,
  brush: 16,
  wind_charge: 16,
  trial_key: 16,
  ominous_trial_key: 16,
  mace: 16,
  wind_charge_launcher: 16,
};

// 生成音效文件
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
