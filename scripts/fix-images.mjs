import { writeFileSync, existsSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');

const API = 'https://minecraft.wiki/api.php';

// 需要重新下载的图片（小尺寸或模糊的）
const IMAGE_MAP = {
  // 16x16 需要重新下载
  carrot: ['Carrot_(item)_JE4.png', 'Carrot_JE4.png', 'Carrot_(item).png'],
  cat: ['Cat_JE2.png', 'Cat_(orange)_JE2.png', 'Cat.png'],
  chicken: ['Chicken_JE5.png', 'Chicken_JE4.png', 'Chicken.png'],
  creeper: ['Creeper_JE5.png', 'Creeper_JE4.png', 'Creeper.png'],
  llama: ['Llama_JE2.png', 'Llama_(creamy)_JE2.png', 'Llama.png'],
  sheep: ['Sheep_JE5.png', 'Sheep_(white)_JE5.png', 'Sheep.png'],
  wheat: ['Wheat_JE3.png', 'Wheat_JE2.png', 'Wheat.png'],
  wolf: ['Wolf_JE4.png', 'Wolf_(tamed)_JE4.png', 'Wolf.png'],
  // 160x160 也重新下载
  apple: ['Apple_JE3.png', 'Apple_JE2.png', 'Apple.png'],
  berries: ['Sweet_Berries_JE2.png', 'Sweet_Berries_JE1.png', 'Sweet_Berries.png'],
  bread: ['Bread_JE3.png', 'Bread_JE2.png', 'Bread.png'],
  horse: ['Horse_JE5.png', 'Horse_(brown)_JE5.png', 'Horse.png'],
  milk: ['Milk_Bucket_JE2.png', 'Milk_Bucket_JE1.png', 'Milk_Bucket.png'],
  potato: ['Potato_JE3.png', 'Potato_JE2.png', 'Potato.png'],
};

// 搜索图片URL
async function getImageUrl(filename) {
  const params = new URLSearchParams({
    action: 'query',
    titles: `File:${filename}`,
    prop: 'imageinfo',
    iiprop: 'url|size',
    format: 'json',
  });

  const res = await fetch(`${API}?${params}`);
  const data = await res.json();
  const pages = data.query?.pages;
  if (!pages) return null;

  const page = Object.values(pages)[0];
  return page?.imageinfo?.[0] || null;
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

// 下载图片
async function downloadImage(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buffer = await res.arrayBuffer();
  writeFileSync(destPath, Buffer.from(buffer));
}

// 处理单个图片
async function processImage(id, candidates) {
  const destPath = resolve(root, 'public/svg', `${id}.png`);

  for (const filename of candidates) {
    try {
      const info = await getImageUrl(filename);
      if (!info) continue;

      // 跳过小图片（小于100x100）
      if (info.width < 100 || info.height < 100) {
        console.log(`  ⏭️  ${filename}: 太小 (${info.width}x${info.height})，跳过`);
        continue;
      }

      await downloadImage(info.url, destPath);
      console.log(`  ✅ ${id}: 下载成功 (${info.width}x${info.height})`);
      return true;
    } catch (err) {
      console.log(`  ⚠️  ${filename}: ${err.message}`);
    }
  }

  // 如果所有候选都失败，尝试搜索
  console.log(`  🔍 ${id}: 候选失败，搜索中...`);
  const searchTerm = candidates[0].replace(/_JE\d+\.png$/, '').replace(/\.png$/, '');
  const results = await searchFilename(searchTerm);

  for (const result of results.slice(0, 5)) {
    try {
      const info = await getImageUrl(result);
      if (!info || info.width < 100 || info.height < 100) continue;

      await downloadImage(info.url, destPath);
      console.log(`  ✅ ${id}: 搜索下载成功 (${info.width}x${info.height})`);
      return true;
    } catch (err) {
      // 继续尝试下一个
    }
  }

  console.log(`  ❌ ${id}: 下载失败`);
  return false;
}

// 主函数
async function main() {
  console.log('开始修复小尺寸图片...\n');

  let success = 0;
  let failed = 0;

  for (const [id, candidates] of Object.entries(IMAGE_MAP)) {
    console.log(`\n处理 ${id}:`);
    const result = await processImage(id, candidates);
    if (result) success++;
    else failed++;
    await new Promise(r => setTimeout(r, 500));
  }

  console.log(`\n完成: ${success} 成功, ${failed} 失败`);
}

main().catch(console.error);
