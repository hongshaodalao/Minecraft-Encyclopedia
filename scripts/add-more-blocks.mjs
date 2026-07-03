import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const API = 'https://minecraft.wiki/api.php';

// 新增方块词条
const NEW_BLOCKS = [
  {
    id: 'glass', name: '玻璃', category: 'blocks',
    image: 'glass', audio: 'sand', sound: 'glass',
    displayText: '玻璃是透明的方块，可以做窗户，让阳光照进来。',
    audioText: '玻璃亮晶晶的，用沙子烧一烧就变出来啦，可以做窗户看外面～',
    fact: '玻璃只能用精准采集的镐子才能挖下来',
    parentTip: '你家的窗户是什么做的？透过窗户能看到什么？',
    audioDuration: 16
  },
  {
    id: 'bookshelf', name: '书架', category: 'blocks',
    image: 'bookshelf', audio: 'wood', sound: 'wood',
    displayText: '书架可以放书，放在附魔台旁边能增强附魔效果。',
    audioText: '书架方方正正的，里面放了好多书，放在附魔台旁边特别有用～',
    fact: '一个书架需要6个木板和3本书',
    parentTip: '你喜欢看书吗？你最喜欢什么书？',
    audioDuration: 16
  },
  {
    id: 'brick', name: '砖块', category: 'blocks',
    image: 'brick', audio: 'stone', sound: 'stone',
    displayText: '砖块很结实，可以用来建造漂亮的房子。',
    audioText: '砖块红红的，一块一块的，用黏土烧出来，造房子特别好看～',
    fact: '4个黏土球可以烧成4个砖，再合成砖块',
    parentTip: '你见过用砖头盖的房子吗？是什么颜色的？',
    audioDuration: 16
  },
  {
    id: 'pumpkin', name: '南瓜', category: 'blocks',
    image: 'pumpkin', audio: 'grass', sound: 'grass',
    displayText: '南瓜可以戴在头上，还能做南瓜灯和铁傀儡。',
    audioText: '南瓜橙橙的，圆圆的，可以戴在头上吓走末影人哦～',
    fact: '南瓜加上火把可以做成南瓜灯',
    parentTip: '你见过南瓜吗？万圣节会用南瓜做什么？',
    audioDuration: 16
  },
  {
    id: 'cactus', name: '仙人掌', category: 'blocks',
    image: 'cactus', audio: 'grass', sound: 'grass',
    displayText: '仙人掌长在沙漠里，碰到会受伤，但可以用来做绿色染料。',
    audioText: '仙人掌绿绿的，长在沙漠里，碰一下会扎手，要小心哦～',
    fact: '仙人掌放在熔炉里可以烧成绿色染料',
    parentTip: '你见过仙人掌吗？它长在什么地方？',
    audioDuration: 16
  },
  {
    id: 'glass_pane', name: '玻璃板', category: 'blocks',
    image: 'glass_pane', audio: 'glass', sound: 'glass',
    displayText: '玻璃板比玻璃更薄，可以做漂亮的窗户和围栏。',
    audioText: '玻璃板薄薄的，比玻璃省材料，做窗户特别好看～',
    fact: '6个玻璃可以做16个玻璃板',
    parentTip: '你见过玻璃做的围栏吗？',
    audioDuration: 16
  },
  {
    id: 'iron_bars', name: '铁栏杆', category: 'blocks',
    image: 'iron_bars', audio: 'iron', sound: 'iron',
    displayText: '铁栏杆可以做监狱窗户，怪物过不去但你能看到外面。',
    audioText: '铁栏杆一根一根的，怪物过不去，但你能看到外面～',
    fact: '铁栏杆和栅栏门可以连接在一起',
    parentTip: '你见过铁栏杆做的窗户吗？',
    audioDuration: 16
  },
  {
    id: 'hay_bale', name: '干草块', category: 'blocks',
    image: 'hay_bale', audio: 'grass', sound: 'grass',
    displayText: '干草块可以喂马，还能用来做装饰，从高处掉下来能减少伤害。',
    audioText: '干草块黄黄的，可以喂马，从高处掉在上面不会那么疼～',
    fact: '9个小麦可以合成1个干草块',
    parentTip: '你见过干草堆吗？它是什么颜色的？',
    audioDuration: 16
  },
  {
    id: 'melon', name: '西瓜', category: 'blocks',
    image: 'melon', audio: 'grass', sound: 'grass',
    displayText: '西瓜可以吃，还能做西瓜种子继续种。',
    audioText: '西瓜绿绿的，里面红红的，甜甜的特别好吃～',
    fact: '西瓜片可以合成西瓜种子',
    parentTip: '你吃过西瓜吗？它是什么味道的？',
    audioDuration: 16
  },
  {
    id: 'mushroom', name: '蘑菇', category: 'blocks',
    image: 'mushroom', audio: 'grass', sound: 'grass',
    displayText: '蘑菇有红色和棕色两种，可以做蘑菇煲。',
    audioText: '蘑菇圆圆的，有红色和棕色，可以做蘑菇煲特别香～',
    fact: '两个蘑菇加一个碗可以做蘑菇煲',
    parentTip: '你吃过蘑菇吗？蘑菇长在什么地方？',
    audioDuration: 16
  }
];

// 候选文件名映射
const candidateMap = {
  glass: ['Glass_JE2.png', 'Glass.png'],
  bookshelf: ['Bookshelf_JE4.png', 'Bookshelf.png'],
  brick: ['Bricks_JE5.png', 'Bricks.png', 'Brick.png'],
  pumpkin: ['Pumpkin_JE7.png', 'Pumpkin.png'],
  cactus: ['Cactus_JE4.png', 'Cactus.png'],
  glass_pane: ['Glass_Pane_JE2.png', 'Glass_Pane.png'],
  iron_bars: ['Iron_Bars_JE2.png', 'Iron_Bars.png'],
  hay_bale: ['Hay_Block_JE2.png', 'Hay_Block.png', 'Hay_Bale.png'],
  melon: ['Melon_JE3.png', 'Melon.png'],
  mushroom: ['Red_Mushroom_JE4.png', 'Red_Mushroom.png', 'Mushroom.png'],
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

const newEntries = NEW_BLOCKS.filter(e => !existingIds.has(e.id));
console.log(`准备添加 ${newEntries.length} 个新方块词条\n`);

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
