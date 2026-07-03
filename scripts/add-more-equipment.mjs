import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const API = 'https://minecraft.wiki/api.php';

const NEW_EQUIPMENT = [
  {
    id: 'wooden_sword', name: '木剑', category: 'equipment',
    image: 'wooden_sword', audio: 'wood', sound: 'wood',
    displayText: '木剑是最基础的武器，用木头就能做。',
    audioText: '木剑是最容易做的武器，用木头就能做，新手必备～',
    fact: '木剑是最弱的剑，但比空手强',
    parentTip: '你玩过玩具剑吗？',
    audioDuration: 16
  },
  {
    id: 'stone_sword', name: '石剑', category: 'equipment',
    image: 'stone_sword', audio: 'stone', sound: 'stone',
    displayText: '石剑比木剑更强，用圆石就能做。',
    audioText: '石剑比木剑厉害一点，用圆石就能做～',
    fact: '石剑的伤害是木剑的两倍',
    parentTip: '石头做的东西和木头做的有什么不同？',
    audioDuration: 16
  },
  {
    id: 'golden_sword', name: '金剑', category: 'equipment',
    image: 'golden_sword', audio: 'gold', sound: 'gold',
    displayText: '金剑很漂亮但不耐用，不过附魔效果特别好。',
    audioText: '金剑金灿灿的，虽然不耐用，但附魔效果特别好～',
    fact: '金剑的附魔概率是最高的',
    parentTip: '金色的东西好看吗？',
    audioDuration: 16
  },
  {
    id: 'wooden_pickaxe', name: '木镐', category: 'equipment',
    image: 'wooden_pickaxe', audio: 'wood', sound: 'wood',
    displayText: '木镐是最基础的挖矿工具，能挖石头和煤炭。',
    audioText: '木镐是新手的第一个工具，能挖石头和煤炭～',
    fact: '木镐只能挖石头、煤炭和圆石',
    parentTip: '你用过工具吗？工具是做什么用的？',
    audioDuration: 16
  },
  {
    id: 'stone_pickaxe', name: '石镐', category: 'equipment',
    image: 'stone_pickaxe', audio: 'stone', sound: 'stone',
    displayText: '石镐比木镐更强，能挖铁矿和金矿。',
    audioText: '石镐比木镐厉害，能挖铁矿和金矿啦～',
    fact: '石镐可以挖铁矿、金矿和红石',
    parentTip: '铁和石头哪个更硬？',
    audioDuration: 16
  },
  {
    id: 'golden_pickaxe', name: '金镐', category: 'equipment',
    image: 'golden_pickaxe', audio: 'gold', sound: 'gold',
    displayText: '金镐挖得特别快，但很不耐用。',
    audioText: '金镐挖得特别快，但是很容易坏，要省着用～',
    fact: '金镐的挖掘速度是钻石镐的两倍',
    parentTip: '你觉得工具是耐用重要还是快重要？',
    audioDuration: 16
  },
  {
    id: 'wooden_axe', name: '木斧', category: 'equipment',
    image: 'wooden_axe', audio: 'wood', sound: 'wood',
    displayText: '木斧可以砍树，砍得比空手快多了。',
    audioText: '木斧砍树特别快，比空手快好多倍～',
    fact: '斧头还能用来攻击，伤害比剑高',
    parentTip: '你见过斧头吗？它是做什么用的？',
    audioDuration: 16
  },
  {
    id: 'stone_axe', name: '石斧', category: 'equipment',
    image: 'stone_axe', audio: 'stone', sound: 'stone',
    displayText: '石斧比木斧更强，砍树更快。',
    audioText: '石斧比木斧厉害，砍树嗖嗖的～',
    fact: '石斧的攻击力和铁剑一样',
    parentTip: '你觉得斧头和剑有什么不同？',
    audioDuration: 16
  },
  {
    id: 'wooden_shovel', name: '木铲', category: 'equipment',
    image: 'wooden_shovel', audio: 'wood', sound: 'wood',
    displayText: '木铲可以挖土、挖沙子，比空手快。',
    audioText: '木铲挖土特别快，比空手快好多～',
    fact: '铲子还能把草方块变成土径',
    parentTip: '你用铲子挖过沙子吗？',
    audioDuration: 16
  },
  {
    id: 'stone_shovel', name: '石铲', category: 'equipment',
    image: 'stone_shovel', audio: 'stone', sound: 'stone',
    displayText: '石铲比木铲更强，挖土更快。',
    audioText: '石铲比木铲厉害，挖土嗖嗖的～',
    fact: '铲子是挖砂砾最快的工具',
    parentTip: '你玩过铲子吗？',
    audioDuration: 16
  }
];

const candidateMap = {
  wooden_sword: ['Wooden_Sword_JE3.png', 'Wooden_Sword.png'],
  stone_sword: ['Stone_Sword_JE3.png', 'Stone_Sword.png'],
  golden_sword: ['Golden_Sword_JE3.png', 'Golden_Sword.png'],
  wooden_pickaxe: ['Wooden_Pickaxe_JE3.png', 'Wooden_Pickaxe.png'],
  stone_pickaxe: ['Stone_Pickaxe_JE3.png', 'Stone_Pickaxe.png'],
  golden_pickaxe: ['Golden_Pickaxe_JE3.png', 'Golden_Pickaxe.png'],
  wooden_axe: ['Wooden_Axe_JE3.png', 'Wooden_Axe.png'],
  stone_axe: ['Stone_Axe_JE3.png', 'Stone_Axe.png'],
  wooden_shovel: ['Wooden_Shovel_JE3.png', 'Wooden_Shovel.png'],
  stone_shovel: ['Stone_Shovel_JE3.png', 'Stone_Shovel.png'],
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

const newEntries = NEW_EQUIPMENT.filter(e => !existingIds.has(e.id));
console.log(`准备添加 ${newEntries.length} 个新装备词条\n`);

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
