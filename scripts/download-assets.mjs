import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const svgDir = resolve(root, 'public/svg');
const soundsDir = resolve(root, 'public/sounds');

mkdirSync(svgDir, { recursive: true });
mkdirSync(soundsDir, { recursive: true });

const API = 'https://minecraft.wiki/api.php';

// 资源映射: id -> wiki文件名
const IMAGE_MAP = {
  // 方块世界
  grass: 'Grass_Block_JE2.png',
  dirt: 'Dirt_JE3.png',
  wood: 'Oak_Log_JE3.png',
  stone: 'Stone_JE2.png',
  sand: 'Sand_JE3.png',
  water: 'Water_JE3.png',
  lava: 'Lava_JE3.png',
  coal: 'Coal_Ore_JE3.png',
  iron: 'Iron_Ore_JE4.png',
  gold: 'Gold_Ore_JE4.png',
  diamond: 'Diamond_Ore_JE3.png',
  redstone: 'Redstone_Ore_JE4.png',
  glass: 'Glass_JE2.png',
  // 可爱动物
  cow: 'Cow_JE9.png',
  sheep: 'Sheep_JE5.png',
  pig: 'Pig_JE5.png',
  chicken: 'Chicken_JE5.png',
  horse: 'Horse_JE5.png',
  wolf: 'Wolf_JE4.png',
  cat: 'Cat_JE2.png',
  rabbit: 'Rabbit_JE4.png',
  llama: 'Llama_JE2.png',
  bee: 'Bee_JE2.png',
  turtle: 'Turtle_JE2.png',
  creeper: 'Creeper_JE5.png',
  // 好吃食物
  apple: 'Apple_JE3.png',
  bread: 'Bread_JE3.png',
  carrot: 'Carrot_JE3.png',
  potato: 'Potato_JE3.png',
  wheat: 'Wheat_JE3.png',
  berries: 'Sweet_Berries_JE2.png',
  cake: 'Cake_JE2.png',
  milk: 'Milk_Bucket_JE2.png',
};

// 搜索并获取图片URL
async function getImageUrl(filename) {
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

// 搜索文件名（如果精确匹配失败）
async function searchFilename(searchTerm) {
  const params = new URLSearchParams({
    action: 'query',
    list: 'search',
    srsearch: searchTerm,
    srnamespace: '6',
    srlimit: '5',
    format: 'json',
  });

  const res = await fetch(`${API}?${params}`);
  const data = await res.json();
  const results = data.query?.search || [];
  return results.map(r => r.title.replace('File:', ''));
}

// 下载图片
async function downloadImage(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = await res.arrayBuffer();
  writeFileSync(destPath, Buffer.from(buffer));
}

// 处理单个资源
async function processAsset(id, wikiFilename) {
  const destPath = resolve(svgDir, `${id}.png`);

  // 如果已有真正的PNG文件，跳过
  if (existsSync(destPath)) {
    const stat = (await import('node:fs')).statSync(destPath);
    if (stat.size > 1000) {
      console.log(`⏭️  ${id}: 已存在，跳过`);
      return { id, status: 'skipped' };
    }
  }

  try {
    // 先尝试精确匹配
    let url = await getImageUrl(wikiFilename);

    // 如果失败，搜索
    if (!url) {
      console.log(`🔍  ${id}: 精确匹配失败，搜索中...`);
      const searchName = wikiFilename.replace(/_JE\d+\.png$/, '');
      const results = await searchFilename(searchName);
      if (results.length > 0) {
        url = await getImageUrl(results[0]);
      }
    }

    if (!url) {
      console.log(`❌  ${id}: 未找到图片`);
      return { id, status: 'not_found' };
    }

    await downloadImage(url, destPath);
    console.log(`✅  ${id}: 下载成功`);
    return { id, status: 'success' };
  } catch (err) {
    console.log(`❌  ${id}: ${err.message}`);
    return { id, status: 'error', error: err.message };
  }
}

// 主函数
async function main() {
  console.log('开始下载 Minecraft 美术素材...\n');

  const entries = Object.entries(IMAGE_MAP);
  const results = [];

  for (const [id, filename] of entries) {
    const result = await processAsset(id, filename);
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
