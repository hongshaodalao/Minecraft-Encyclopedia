import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const API = 'https://minecraft.wiki/api.php';

const NEW_MONSTERS = [
  {
    id: 'husk', name: '尸壳', category: 'monsters',
    image: 'husk', audio: 'zombie', sound: 'zombie',
    displayText: '尸壳是沙漠里的僵尸，被它打到会饿得更快。',
    audioText: '尸壳是沙漠里的僵尸，被它打到会饿得更快，要小心～',
    fact: '尸壳在阳光下不会燃烧',
    parentTip: '你去过沙漠吗？沙漠是什么样子的？',
    audioDuration: 17
  },
  {
    id: 'stray', name: '流浪者', category: 'monsters',
    image: 'stray', audio: 'skeleton', sound: 'skeleton',
    displayText: '流浪者是雪地里的骷髅，射出的箭会让你变慢。',
    audioText: '流浪者是雪地里的骷髅，射出的箭会让你变慢，要躲开～',
    fact: '流浪者掉落的箭可以做迟缓药箭',
    parentTip: '你见过下雪的地方吗？',
    audioDuration: 17
  },
  {
    id: 'drowned', name: '溺尸', category: 'monsters',
    image: 'drowned', audio: 'zombie', sound: 'zombie',
    displayText: '溺尸住在水里，会游泳，有时会拿三叉戟攻击你。',
    audioText: '溺尸住在水里，会游泳，有时会拿三叉戟扔你～',
    fact: '溺尸是唯一能自然生成三叉戟的怪物',
    parentTip: '你会游泳吗？水里有什么？',
    audioDuration: 17
  },
  {
    id: 'pillager', name: '掠夺者', category: 'monsters',
    image: 'pillager', audio: 'pillager', sound: 'pillager',
    displayText: '掠夺者会拿着弩攻击村庄，还会放出袭击。',
    audioText: '掠夺者拿着弩，会攻击村庄，特别危险～',
    fact: '掠夺者会掉落弩和旗帜',
    parentTip: '你知道什么是掠夺吗？',
    audioDuration: 17
  },
  {
    id: 'ravager', name: '劫掠兽', category: 'monsters',
    image: 'ravager', audio: 'ravager', sound: 'ravager',
    displayText: '劫掠兽是巨大的怪物，会破坏庄稼，非常危险。',
    audioText: '劫掠兽很大很大，会破坏庄稼，特别危险～',
    fact: '劫掠兽是袭击中最强的怪物',
    parentTip: '你见过很大的动物吗？',
    audioDuration: 17
  },
  {
    id: 'vex', name: '恼鬼', category: 'monsters',
    image: 'vex', audio: 'vex', sound: 'vex',
    displayText: '恼鬼是小小的会飞的怪物，由唤魔者召唤出来。',
    audioText: '恼鬼小小的会飞，由唤魔者召唤出来，会穿过墙壁攻击你～',
    fact: '恼鬼可以穿过方块',
    parentTip: '你见过会飞的小怪物吗？',
    audioDuration: 16
  },
  {
    id: 'elder_guardian', name: '远古守卫者', category: 'monsters',
    image: 'elder_guardian', audio: 'guardian', sound: 'guardian',
    displayText: '远古守卫者是海底神殿的 boss，比普通守卫者更大更强。',
    audioText: '远古守卫者是海底神殿的 boss，比普通守卫者更大更强～',
    fact: '击败远古守卫者会获得海绵',
    parentTip: '你知道什么是 boss 吗？',
    audioDuration: 17
  },
  {
    id: 'zombie_villager', name: '僵尸村民', category: 'monsters',
    image: 'zombie_villager', audio: 'zombie', sound: 'zombie',
    displayText: '僵尸村民是被僵尸感染的村民，可以用药水救回来。',
    audioText: '僵尸村民是被僵尸感染的村民，用虚弱药水和金苹果能救回来～',
    fact: '治愈僵尸村民后交易会打折',
    parentTip: '如果你的朋友生病了，你会怎么帮助他？',
    audioDuration: 17
  }
];

const candidateMap = {
  husk: ['Husk_JE4.png', 'Husk.png'],
  stray: ['Stray_JE4.png', 'Stray.png'],
  drowned: ['Drowned_JE4.png', 'Drowned.png'],
  pillager: ['Pillager_JE3.png', 'Pillager.png'],
  ravager: ['Ravager_JE2.png', 'Ravager.png'],
  vex: ['Vex_JE3.png', 'Vex.png'],
  elder_guardian: ['Elder_Guardian_JE2.png', 'Elder_Guardian.png'],
  zombie_villager: ['Zombie_Villager_JE6.png', 'Zombie_Villager.png'],
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

const newEntries = NEW_MONSTERS.filter(e => !existingIds.has(e.id));
console.log(`准备添加 ${newEntries.length} 个新怪物词条\n`);

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
