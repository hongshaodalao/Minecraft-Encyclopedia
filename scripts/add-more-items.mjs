import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const API = 'https://minecraft.wiki/api.php';

const NEW_ITEMS = [
  // 物品
  {
    id: 'bucket', name: '铁桶', category: 'items',
    image: 'bucket', audio: 'iron', sound: 'iron',
    displayText: '铁桶可以装水、装牛奶、装岩浆，非常实用。',
    audioText: '铁桶可以装好多东西，水、牛奶、岩浆都能装，特别方便～',
    fact: '空桶可以右键哞菇获得蘑菇煲',
    parentTip: '你用桶装过什么东西？',
    audioDuration: 16
  },
  {
    id: 'compass', name: '指南针', category: 'items',
    image: 'compass', audio: 'compass', sound: 'compass',
    displayText: '指南针会指向你的出生点，迷路时可以找到回家的路。',
    audioText: '指南针的红针永远指向你出生的地方，迷路了就看它～',
    fact: '指南针在下界和末地会乱转',
    parentTip: '你迷过路吗？指南针是怎么指方向的？',
    audioDuration: 16
  },
  {
    id: 'clock', name: '时钟', category: 'items',
    image: 'clock', audio: 'clock', sound: 'clock',
    displayText: '时钟可以告诉你现在是白天还是黑夜，在地下特别有用。',
    audioText: '时钟能告诉你现在几点了，在地下也能知道外面是白天还是黑夜～',
    fact: '时钟在下界和末地会乱转',
    parentTip: '你会看时间吗？现在几点了？',
    audioDuration: 16
  },
  {
    id: 'map', name: '地图', category: 'items',
    image: 'map', audio: 'map', sound: 'map',
    displayText: '地图可以记录你走过的地方，帮你找到回家的路。',
    audioText: '地图会记录你去过的地方，走过的路都会画在上面～',
    fact: '地图可以用指南针和纸合成',
    parentTip: '你看过地图吗？地图上有什么？',
    audioDuration: 16
  },
  {
    id: 'lead', name: '拴绳', category: 'items',
    image: 'lead', audio: 'lead', sound: 'lead',
    displayText: '拴绳可以牵着动物走，防止它们跑丢。',
    audioText: '拴绳可以牵着动物走，拉着它们一起去冒险～',
    fact: '拴绳可以拴在栅栏上',
    parentTip: '你牵过小动物吗？是什么感觉？',
    audioDuration: 16
  },
  {
    id: 'name_tag', name: '命名牌', category: 'items',
    image: 'name_tag', audio: 'name_tag', sound: 'name_tag',
    displayText: '命名牌可以给动物取名字，让它们不会消失。',
    audioText: '命名牌可以给动物取名字，取了名字就不会消失啦～',
    fact: '命名牌要放在铁砧上才能改名',
    parentTip: '如果给宠物取名字，你会取什么？',
    audioDuration: 16
  },
  {
    id: 'saddle', name: '鞍', category: 'items',
    image: 'saddle', audio: 'saddle', sound: 'saddle',
    displayText: '鞍可以放在马、猪身上，骑着它们到处跑。',
    audioText: '鞍放在马背上就能骑马啦，放在猪身上也能骑哦～',
    fact: '鞍不能合成，只能在宝箱里找到',
    parentTip: '你骑过马吗？骑马是什么感觉？',
    audioDuration: 16
  },
  {
    id: 'bone', name: '骨头', category: 'items',
    image: 'bone', audio: 'bone', sound: 'bone',
    displayText: '骨头可以喂狼，让狼变成你的好朋友。',
    audioText: '骨头可以喂狼，给它骨头它就会保护你～',
    fact: '骨头可以做成骨粉，让植物快快长大',
    parentTip: '你有养过小狗吗？小狗喜欢吃什么？',
    audioDuration: 16
  },
  {
    id: 'string', name: '线', category: 'items',
    image: 'string', audio: 'string', sound: 'string',
    displayText: '线可以做弓、钓鱼竿，还能做绊线钩。',
    audioText: '线细细的，可以做弓和钓鱼竿，用处可多啦～',
    fact: '打蜘蛛会掉落线',
    parentTip: '你用线做过什么东西？',
    audioDuration: 16
  },
  {
    id: 'feather', name: '羽毛', category: 'items',
    image: 'feather', audio: 'feather', sound: 'feather',
    displayText: '羽毛可以做箭，还能做书和笔。',
    audioText: '羽毛轻飘飘的，可以做箭，还能做书和笔写字～',
    fact: '鸡会掉落羽毛',
    parentTip: '你见过羽毛吗？它是什么颜色的？',
    audioDuration: 16
  }
];

const candidateMap = {
  bucket: ['Bucket_JE2.png', 'Bucket.png'],
  compass: ['Compass_JE3.png', 'Compass.png'],
  clock: ['Clock_JE3.png', 'Clock.png'],
  map: ['Map_JE2.png', 'Empty_Map_JE2.png', 'Map.png'],
  lead: ['Lead_JE2.png', 'Lead.png'],
  name_tag: ['Name_Tag_JE2.png', 'Name_Tag.png'],
  saddle: ['Saddle_JE2.png', 'Saddle.png'],
  bone: ['Bone_JE3.png', 'Bone.png'],
  string: ['String_JE3.png', 'String.png'],
  feather: ['Feather_JE3.png', 'Feather.png'],
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

const newEntries = NEW_ITEMS.filter(e => !existingIds.has(e.id));
console.log(`准备添加 ${newEntries.length} 个新物品词条\n`);

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
