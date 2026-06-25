import { execSync } from 'node:child_process';
import { writeFileSync, mkdirSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const imagesDir = resolve(root, 'public/images');
const soundsDir = resolve(root, 'public/sounds');

mkdirSync(imagesDir, { recursive: true });
mkdirSync(soundsDir, { recursive: true });

const API = 'https://minecraft.wiki/api.php';

// 资源映射: id -> [wiki文件名, 分类]
const IMAGE_MAP = {
  // 方块世界
  grass: ['Grass_Block_JE2.png', 'blocks'],
  dirt: ['Dirt_JE3.png', 'blocks'],
  wood: ['Oak_Log_JE3.png', 'blocks'],
  stone: ['Stone_JE2.png', 'blocks'],
  sand: ['Sand_JE3.png', 'blocks'],
  water: ['Water_JE3.png', 'blocks'],
  lava: ['Lava_JE3.png', 'blocks'],
  coal: ['Coal_Ore_JE3.png', 'blocks'],
  iron: ['Iron_Ore_JE4.png', 'blocks'],
  gold: ['Gold_Ore_JE4.png', 'blocks'],
  diamond: ['Diamond_Ore_JE3.png', 'blocks'],
  redstone: ['Redstone_Ore_JE4.png', 'blocks'],
  glass: ['Glass_JE2.png', 'blocks'],
  // 可爱动物
  cow: ['Cow_JE9.png', 'animals'],
  sheep: ['Sheep_JE5.png', 'animals'],
  pig: ['Pig_JE5.png', 'animals'],
  chicken: ['Chicken_JE5.png', 'animals'],
  horse: ['Horse_JE5.png', 'animals'],
  wolf: ['Wolf_JE4.png', 'animals'],
  cat: ['Cat_JE2.png', 'animals'],
  rabbit: ['Rabbit_JE4.png', 'animals'],
  llama: ['Llama_JE2.png', 'animals'],
  bee: ['Bee_JE2.png', 'animals'],
  turtle: ['Turtle_JE2.png', 'animals'],
  creeper: ['Creeper_JE5.png', 'animals'],
  // 好吃食物
  apple: ['Apple_JE3.png', 'foods'],
  bread: ['Bread_JE3.png', 'foods'],
  carrot: ['Carrot_JE3.png', 'foods'],
  potato: ['Potato_JE3.png', 'foods'],
  wheat: ['Wheat_JE3.png', 'foods'],
  berries: ['Sweet_Berries_JE2.png', 'foods'],
  cake: ['Cake_JE2.png', 'foods'],
  milk: ['Milk_Bucket_JE2.png', 'foods'],
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
async function processAsset(id, wikiFilename, category) {
  const catDir = resolve(imagesDir, category);
  mkdirSync(catDir, { recursive: true });
  const destPath = resolve(catDir, `${id}.png`);

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

  for (const [id, [filename, category]] of entries) {
    const result = await processAsset(id, filename, category);
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
