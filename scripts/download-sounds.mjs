import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const soundsDir = resolve(root, 'public/sounds');

mkdirSync(soundsDir, { recursive: true });

const API = 'https://minecraft.wiki/api.php';

// 音效映射: id -> wiki文件名
const SOUND_MAP = {
  moo: 'Cow idle2.ogg',
  baa: 'Sheep idle1.ogg',
  oink: 'Pig idle1.ogg',
  cluck: 'Chicken idle1.ogg',
  neigh: 'Horse idle1.ogg',
  howl: 'Wolf howl1.ogg',
  meow: 'Cat meow1.ogg',
  rabbit: 'Rabbit idle1.ogg',
  llama: 'Llama idle1.ogg',
  buzz: 'Bee loop1.ogg',
  turtle: 'Turtle idle1.ogg',
  hiss: 'Creeper hiss1.ogg',
};

// 搜索并获取音频URL
async function getAudioUrl(filename) {
  const params = new URLSearchParams({
    action: 'query',
    titles: `File:${filename}`,
    prop: 'imageinfo',
    iiprop: 'url',
    format: 'json',
  });

  const res = await fetch(`${API}?${params}`);
  const data = await res.json();
  const pages = data.query?.pages;
  if (!pages) return null;

  const page = Object.values(pages)[0];
  return page?.imageinfo?.[0]?.url || null;
}

// 搜索文件名
async function searchFilename(searchTerm) {
  const params = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: searchTerm,
    srnamespace: '6',
    srlimit: '10',
    format: 'json',
  });

  const res = await fetch(`${API}?${params}`);
  const data = await res.json();
  const results = data.query?.search || [];
  return results.map(r => r.title.replace('File:', ''));
}

// 下载音频
async function downloadAudio(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = await res.arrayBuffer();
  writeFileSync(destPath, Buffer.from(buffer));
}

// 处理单个音效
async function processSound(id, wikiFilename) {
  const destPath = resolve(soundsDir, `${id}.ogg`);

  // 如果已有文件，跳过
  if (existsSync(destPath)) {
    const stat = (await import('node:fs')).statSync(destPath);
    if (stat.size > 1000) {
      console.log(`⏭️  ${id}: 已存在，跳过`);
      return { id, status: 'skipped' };
    }
  }

  try {
    // 先尝试精确匹配
    let url = await getAudioUrl(wikiFilename);

    // 如果失败，搜索
    if (!url) {
      console.log(`🔍  ${id}: 精确匹配失败，搜索中...`);
      const searchName = wikiFilename.replace(/\d+\.ogg$/, '');
      const results = await searchFilename(searchName);
      if (results.length > 0) {
        url = await getAudioUrl(results[0]);
      }
    }

    if (!url) {
      console.log(`❌  ${id}: 未找到音效`);
      return { id, status: 'not_found' };
    }

    await downloadAudio(url, destPath);
    console.log(`✅  ${id}: 下载成功`);
    return { id, status: 'success' };
  } catch (err) {
    console.log(`❌  ${id}: ${err.message}`);
    return { id, status: 'error', error: err.message };
  }
}

// 主函数
async function main() {
  console.log('开始下载 Minecraft 音效素材...\n');

  const entries = Object.entries(SOUND_MAP);
  const results = [];

  for (const [id, filename] of entries) {
    const result = await processSound(id, filename);
    results.push(result);
    // 避免请求过快
    await new Promise(r => setTimeout(r, 500));
  }

  const success = results.filter(r => r.status === 'success').length;
  const skipped = results.filter(r => r.status === 'skipped').length;
  const failed = results.filter(r => r.status === 'error' || r.status === 'not_found').length;

  console.log(`\n下载完成: ${success} 成功, ${skipped} 跳过, ${failed} 失败`);
}

main().catch(console.error);
