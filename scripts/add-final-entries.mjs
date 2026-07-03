import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const API = 'https://minecraft.wiki/api.php';

const FINAL_ENTRIES = [
  // 方块
  { id: 'deepslate', name: '深板岩', category: 'blocks', image: 'deepslate', audio: 'stone', sound: 'stone', displayText: '深板岩在地下深处，比石头更硬。', audioText: '深板岩在地下深处，比石头更硬～', fact: '深板岩矿石掉落的矿物更多', parentTip: '你挖到过很深的地方吗？', audioDuration: 16 },
  { id: 'tuff', name: '凝灰岩', category: 'blocks', image: 'tuff', audio: 'stone', sound: 'stone', displayText: '凝灰岩是灰色的石头，在地下很常见。', audioText: '凝灰岩灰灰的，在地下到处都是～', fact: '凝灰岩可以做成很多装饰方块', parentTip: '你见过灰色的石头吗？', audioDuration: 16 },
  { id: 'calcite', name: '方解石', category: 'blocks', image: 'calcite', audio: 'stone', sound: 'stone', displayText: '方解石是白色的石头，很光滑。', audioText: '方解石白白的，摸起来很光滑～', fact: '方解石是紫水晶洞的一部分', parentTip: '你见过白色的石头吗？', audioDuration: 16 },
  { id: 'amethyst', name: '紫水晶', category: 'blocks', image: 'amethyst', audio: 'amethyst', sound: 'amethyst', displayText: '紫水晶很漂亮，可以做望远镜。', audioText: '紫水晶紫紫的，亮闪闪的特别好看～', fact: '紫水晶可以做遮光玻璃', parentTip: '你见过紫色的水晶吗？', audioDuration: 16 },
  { id: 'copper', name: '铜块', category: 'blocks', image: 'copper', audio: 'copper', sound: 'copper', displayText: '铜块会慢慢变成绿色，可以做避雷针。', audioText: '铜块橙橙的，放久了会变成绿色～', fact: '铜块可以用蜜脾涂蜡防止氧化', parentTip: '你见过铜做的东西吗？', audioDuration: 16 },

  // 物品
  { id: 'spyglass', name: '望远镜', category: 'items', image: 'spyglass', audio: 'spyglass', sound: 'spyglass', displayText: '望远镜可以看远处的东西。', audioText: '望远镜可以看远处的东西，看得好远好远～', fact: '望远镜用铜锭和紫水晶做', parentTip: '你用过望远镜吗？', audioDuration: 16 },
  { id: 'brush', name: '刷子', category: 'items', image: 'brush', audio: 'brush', sound: 'brush', displayText: '刷子可以刷考古遗迹，挖出古代宝物。', audioText: '刷子可以刷出古代宝物，像考古学家一样～', fact: '刷子可以刷出陶片', parentTip: '你见过考古学家吗？', audioDuration: 16 },
  { id: 'wind_charge', name: '风弹', category: 'items', image: 'wind_charge', audio: 'wind_charge', sound: 'wind_charge', displayText: '风弹可以把你弹到空中。', audioText: '风弹可以把你弹到空中，飞得好高～', fact: '风弹可以用来做跳跃增强', parentTip: '你想飞起来吗？', audioDuration: 16 },
  { id: 'trial_key', name: '试炼钥匙', category: 'items', image: 'trial_key', audio: 'trial_key', sound: 'trial_key', displayText: '试炼钥匙可以打开试炼密室的宝箱。', audioText: '试炼钥匙可以打开宝箱，里面有好多好东西～', fact: '试炼钥匙在试炼密室获得', parentTip: '你有打开过宝箱吗？', audioDuration: 16 },
  { id: 'ominous_trial_key', name: '不祥试炼钥匙', category: 'items', image: 'ominous_trial_key', audio: 'ominous_trial_key', sound: 'ominous_trial_key', displayText: '不祥试炼钥匙可以打开更好的宝箱。', audioText: '不祥试炼钥匙可以打开更好的宝箱～', fact: '不祥试炼钥匙在不祥试炼中获得', parentTip: '你想要更好的宝物吗？', audioDuration: 16 },

  // 装备
  { id: 'mace', name: '锤', category: 'equipment', image: 'mace', audio: 'mace', sound: 'mace', displayText: '锤是新武器，从高处跳下来攻击伤害更高。', audioText: '锤从高处跳下来打怪物伤害特别高～', fact: '锤在试炼密室获得', parentTip: '你用过锤子吗？', audioDuration: 16 },
  { id: 'wind_charge_launcher', name: '风弹发射器', category: 'equipment', image: 'wind_charge_launcher', audio: 'wind_charge_launcher', sound: 'wind_charge_launcher', displayText: '风弹发射器可以发射风弹。', audioText: '风弹发射器可以发射风弹，把你弹飞～', fact: '风弹发射器是新装备', parentTip: '你玩过发射器玩具吗？', audioDuration: 16 },
];

const candidateMap = {
  deepslate: ['Deepslate_JE2.png', 'Deepslate.png'],
  tuff: ['Tuff_JE1.png', 'Tuff.png'],
  calcite: ['Calcite_JE1.png', 'Calcite.png'],
  amethyst: ['Amethyst_Block_JE1.png', 'Amethyst_Block.png'],
  copper: ['Block_of_Copper_JE2.png', 'Block_of_Copper.png'],
  spyglass: ['Spyglass_JE1.png', 'Spyglass.png'],
  brush: ['Brush_JE1.png', 'Brush.png'],
  wind_charge: ['Wind_Charge_JE1.png', 'Wind_Charge.png'],
  trial_key: ['Trial_Key_JE1.png', 'Trial_Key.png'],
  ominous_trial_key: ['Ominous_Trial_Key_JE1.png', 'Ominous_Trial_Key.png'],
  mace: ['Mace_JE1.png', 'Mace.png'],
  wind_charge_launcher: ['Wind_Charge_Launcher_JE1.png', 'Wind_Charge_Launcher.png'],
};

async function getImageUrl(filename) {
  const params = new URLSearchParams({
    action: 'query', titles: `File:${filename}`,
    prop: 'imageinfo', iiprop: 'url|size', format: 'json',
  });
  const res = await fetch(`${API}?${params}`);
  const data = await res.json();
  const pages = data.query?.pages;
  if (!pages) return null;
  const page = Object.values(pages)[0];
  return page?.imageinfo?.[0] || null;
}

async function searchFilename(term) {
  const params = new URLSearchParams({
    action: 'query', list: 'search', srsearch: term,
    srnamespace: '6', srlimit: '10', format: 'json',
  });
  const res = await fetch(`${API}?${params}`);
  const data = await res.json();
  return (data.query?.search || []).map(r => r.title.replace('File:', ''));
}

async function downloadImage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function processEntry(entry) {
  const sharp = (await import('sharp')).default;
  const imgDir = resolve(root, 'public/images', entry.category);
  mkdirSync(imgDir, { recursive: true });
  const dstPath = resolve(imgDir, `${entry.image}.webp`);

  if (existsSync(dstPath)) {
    return 'skip';
  }

  const candidates = candidateMap[entry.image] || [`${entry.image}.png`];

  for (const filename of candidates) {
    try {
      const info = await getImageUrl(filename);
      if (!info || !info.url) continue;
      if (info.width < 32 || info.height < 32) continue;

      const buf = await downloadImage(info.url);
      await sharp(buf).resize(300, 300, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .webp({ quality: 90 }).toFile(dstPath);
      return 'ok';
    } catch { }
  }

  const searchTerm = candidates[0].replace(/_JE\d+\.png$/, '').replace(/\.png$/, '');
  try {
    const results = await searchFilename(searchTerm);
    for (const name of results.slice(0, 3)) {
      try {
        const info = await getImageUrl(name);
        if (!info || !info.url || info.width < 32) continue;
        const buf = await downloadImage(info.url);
        await sharp(buf).resize(300, 300, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .webp({ quality: 90 }).toFile(dstPath);
        return 'ok';
      } catch { }
    }
  } catch { }

  return 'fail';
}

const entriesPath = resolve(root, 'src/data/entries.json');
const existingEntries = JSON.parse(readFileSync(entriesPath, 'utf-8'));
const existingIds = new Set(existingEntries.map(e => e.id));

const newEntries = FINAL_ENTRIES.filter(e => !existingIds.has(e.id));
console.log(`准备添加 ${newEntries.length} 个新词条\n`);

let ok = 0, skip = 0, fail = 0;

for (let i = 0; i < newEntries.length; i++) {
  const entry = newEntries[i];
  process.stdout.write(`[${i + 1}/${newEntries.length}] ${entry.name} (${entry.id}) ... `);

  const result = await processEntry(entry);
  if (result === 'ok') { console.log('✅'); ok++; }
  else if (result === 'skip') { console.log('⏭️ 已有'); skip++; }
  else { console.log('❌'); fail++; }

  await new Promise(r => setTimeout(r, 300));
}

const allEntries = [...existingEntries, ...newEntries];
writeFileSync(entriesPath, JSON.stringify(allEntries, null, 2), 'utf-8');

console.log(`\n完成: ${ok} 图片下载成功, ${skip} 跳过, ${fail} 失败`);
console.log(`词条总数: ${existingEntries.length} → ${allEntries.length}`);
