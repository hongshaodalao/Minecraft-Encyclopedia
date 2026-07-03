import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const API = 'https://minecraft.wiki/api.php';

const NEW_ANIMALS = [
  {
    id: 'donkey', name: '驴', category: 'animals',
    image: 'donkey', audio: 'donkey', sound: 'donkey',
    displayText: '驴可以骑还能背东西，比马能装更多物品。',
    audioText: '驴可以骑还能背东西，比马能装更多物品，特别实用～',
    fact: '驴可以装备箱子，有15个格子',
    parentTip: '你见过驴吗？它和马有什么不同？',
    audioDuration: 16
  },
  {
    id: 'mule', name: '骡', category: 'animals',
    image: 'mule', audio: 'mule', sound: 'mule',
    displayText: '骡是马和驴生的宝宝，也能背东西。',
    audioText: '骡是马和驴的宝宝，也能背东西，跑得比驴快～',
    fact: '骡不能繁殖，只能用马和驴生',
    parentTip: '你知道骡是什么动物吗？',
    audioDuration: 16
  },
  {
    id: 'bat', name: '蝙蝠', category: 'animals',
    image: 'bat', audio: 'bat', sound: 'bat',
    displayText: '蝙蝠住在洞里，会飞来飞去，不会伤害你。',
    audioText: '蝙蝠黑黑的，住在洞里会飞来飞去，不会伤害你哦～',
    fact: '蝙蝠是游戏中唯一会飞的被动生物',
    parentTip: '你见过蝙蝠吗？它是什么样子的？',
    audioDuration: 16
  },
  {
    id: 'villager', name: '村民', category: 'animals',
    image: 'villager', audio: 'villager', sound: 'villager',
    displayText: '村民住在村庄里，会种地、交易，还能和你换东西。',
    audioText: '村民住在村庄里，会种地，还能和你换东西，特别友好～',
    fact: '村民有不同的职业，可以交易不同物品',
    parentTip: '你去过村庄吗？村民是什么样子的？',
    audioDuration: 16
  },
  {
    id: 'wandering_trader', name: '流浪商人', category: 'animals',
    image: 'wandering_trader', audio: 'wandering_trader', sound: 'wandering_trader',
    displayText: '流浪商人会带着羊驼到处走，卖稀有的东西。',
    audioText: '流浪商人带着羊驼到处走，卖稀有的东西，特别有趣～',
    fact: '流浪商人会随机出现在你附近',
    parentTip: '你见过卖东西的人吗？',
    audioDuration: 16
  },
  {
    id: 'ocelot', name: '豹猫', category: 'animals',
    image: 'ocelot', audio: 'cat', sound: 'cat',
    displayText: '豹猫住在丛林里，很胆小，可以用鱼驯服它。',
    audioText: '豹猫住在丛林里，很胆小，用鱼喂它就能变成你的猫咪～',
    fact: '豹猫驯服后会变成猫',
    parentTip: '你养过猫吗？猫喜欢吃什么？',
    audioDuration: 16
  },
  {
    id: 'polar_bear', name: '北极熊', category: 'animals',
    image: 'polar_bear', audio: 'polar_bear', sound: 'polar_bear',
    displayText: '北极熊住在雪地里，带着小北极熊时会保护宝宝。',
    audioText: '北极熊白白的，住在雪地里，带着宝宝时会保护小熊～',
    fact: '北极熊会主动攻击靠近小熊的玩家',
    parentTip: '你见过北极熊吗？它住在哪里？',
    audioDuration: 16
  },
  {
    id: 'panda', name: '熊猫', category: 'animals',
    image: 'panda', audio: 'panda', sound: 'panda',
    displayText: '熊猫住在竹林里，黑白相间，特别可爱。',
    audioText: '熊猫住在竹林里，黑白相间，圆滚滚的特别可爱～',
    fact: '熊猫有不同的性格，有的懒有的调皮',
    parentTip: '你喜欢熊猫吗？它是什么颜色的？',
    audioDuration: 16
  },
  {
    id: 'mooshroom', name: '哞菇', category: 'animals',
    image: 'mooshroom', audio: 'mooshroom', sound: 'mooshroom',
    displayText: '哞菇是长蘑菇的牛，可以采蘑菇做蘑菇煲。',
    audioText: '哞菇是长蘑菇的牛，采蘑菇做蘑菇煲，特别神奇～',
    fact: '用剪刀剪哞菇会变成普通牛',
    parentTip: '你见过长蘑菇的动物吗？',
    audioDuration: 16
  },
  {
    id: 'dolphin', name: '海豚', category: 'animals',
    image: 'dolphin', audio: 'dolphin', sound: 'dolphin',
    displayText: '海豚很聪明，会帮你找海底宝藏，还能和你一起游泳。',
    audioText: '海豚很聪明，会帮你找海底宝藏，还能和你一起游泳～',
    fact: '喂海豚鱼会带你找海底宝藏',
    parentTip: '你见过海豚吗？它是什么样子的？',
    audioDuration: 16
  }
];

const candidateMap = {
  donkey: ['Donkey_JE4.png', 'Donkey.png'],
  mule: ['Mule_JE3.png', 'Mule.png'],
  bat: ['Bat_JE3.png', 'Bat.png'],
  villager: ['Villager_JE5.png', 'Villager.png'],
  wandering_trader: ['Wandering_Trader_JE2.png', 'Wandering_Trader.png'],
  ocelot: ['Ocelot_JE3.png', 'Ocelot.png'],
  polar_bear: ['Polar_Bear_JE3.png', 'Polar_Bear.png'],
  panda: ['Panda_JE2.png', 'Panda.png'],
  mooshroom: ['Mooshroom_JE4.png', 'Mooshroom.png'],
  dolphin: ['Dolphin_JE2.png', 'Dolphin.png'],
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

const newEntries = NEW_ANIMALS.filter(e => !existingIds.has(e.id));
console.log(`准备添加 ${newEntries.length} 个新动物词条\n`);

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
