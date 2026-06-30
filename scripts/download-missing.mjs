import { writeFileSync, existsSync, statSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const API = 'https://minecraft.wiki/api.php';

// 需要下载的条目 → [候选wiki文件名, 分类]
const DOWNLOAD_MAP = {
  // blocks
  cobblestone: [['Cobblestone_JE4.png', 'Cobblestone_JE3.png', 'Cobblestone.png'], 'blocks'],
  gravel: [['Gravel_JE6.png', 'Gravel_JE5.png', 'Gravel.png'], 'blocks'],
  clay_block: [['Clay_JE1.png', 'Clay.png'], 'blocks'],
  sandstone: [['Sandstone_JE5.png', 'Sandstone_JE4.png', 'Sandstone.png'], 'blocks'],
  copper_ore: [['Copper_Ore_JE3.png', 'Copper_Ore_JE2.png', 'Copper_Ore.png'], 'blocks'],
  // items - 食物
  apple: [['Apple_JE3.png', 'Apple_JE2.png', 'Apple.png'], 'items'],
  bread: [['Bread_JE3.png', 'Bread_JE2.png', 'Bread.png'], 'items'],
  carrot: [['Carrot_JE3.png', 'Carrot_(item)_JE4.png', 'Carrot.png'], 'items'],
  potato: [['Potato_JE3.png', 'Potato_JE2.png', 'Potato.png'], 'items'],
  wheat: [['Wheat_JE3.png', 'Wheat_JE2.png', 'Wheat.png'], 'items'],
  berries: [['Sweet_Berries_JE2.png', 'Sweet_Berries_JE1.png', 'Sweet_Berries.png'], 'items'],
  milk: [['Milk_Bucket_JE2.png', 'Milk_Bucket_JE1.png', 'Milk_Bucket.png'], 'items'],
  cookie: [['Cookie_JE3.png', 'Cookie_JE2.png', 'Cookie.png'], 'items'],
  pumpkin_pie: [['Pumpkin_Pie_JE2.png', 'Pumpkin_Pie_JE1.png', 'Pumpkin_Pie.png'], 'items'],
  golden_apple: [['Golden_Apple_JE2.png', 'Golden_Apple_JE1.png', 'Golden_Apple.png'], 'items'],
  beef: [['Raw_Beef_JE4.png', 'Raw_Beef_JE3.png', 'Raw_Beef.png', 'Beef_JE3.png'], 'items'],
  cooked_beef: [['Steak_JE4.png', 'Steak_JE3.png', 'Steak.png', 'Cooked_Beef_JE3.png'], 'items'],
  honey: [['Honey_Bottle_JE2.png', 'Honey_Bottle_JE1.png', 'Honey_Bottle.png'], 'items'],
  mushroom_stew: [['Mushroom_Stew_JE2.png', 'Mushroom_Stew_JE1.png', 'Mushroom_Stew.png'], 'items'],
  // items - 功能方块
  torch: [['Torch_JE4.png', 'Torch_JE3.png', 'Torch.png'], 'items'],
  furnace: [['Furnace_JE4.png', 'Furnace_JE3.png', 'Furnace.png'], 'items'],
  chest: [['Chest_JE3.png', 'Chest_JE2.png', 'Chest.png'], 'items'],
  bed: [['Red_Bed_JE4.png', 'Bed_JE4.png', 'Bed.png'], 'items'],
  door: [['Oak_Door_JE5.png', 'Oak_Door_JE4.png', 'Door_JE2.png'], 'items'],
  tnt: [['TNT_JE3.png', 'TNT_JE2.png', 'TNT.png'], 'items'],
  bookshelf: [['Bookshelf_JE4.png', 'Bookshelf_JE3.png', 'Bookshelf.png'], 'items'],
  pumpkin: [['Pumpkin_JE7.png', 'Pumpkin_JE6.png', 'Pumpkin.png'], 'items'],
  cactus: [['Cactus_JE4.png', 'Cactus_JE3.png', 'Cactus.png'], 'items'],
  brick: [['Bricks_JE5.png', 'Bricks_JE4.png', 'Bricks.png', 'Brick.png'], 'items'],
  glass: [['Glass_JE2.png', 'Glass.png'], 'items'],
  planks: [['Oak_Planks_JE5.png', 'Oak_Planks_JE4.png', 'Oak_Planks.png', 'Planks.png'], 'items'],
  wool: [['White_Wool_JE4.png', 'White_Wool_JE3.png', 'Wool_JE2.png', 'Wool.png'], 'items'],
  saddle: [['Saddle_JE2.png', 'Saddle.png'], 'items'],
  // equipment - 工具
  bucket: [['Bucket_JE2.png', 'Bucket.png'], 'equipment'],
  compass: [['Compass_JE3.png', 'Compass_JE2.png', 'Compass.png'], 'equipment'],
  clock: [['Clock_JE3.png', 'Clock_JE2.png', 'Clock.png'], 'equipment'],
  map: [['Map_JE2.png', 'Empty_Map_JE2.png', 'Map.png'], 'equipment'],
  lead: [['Lead_JE2.png', 'Lead_JE1.png', 'Lead.png'], 'equipment'],
  name_tag: [['Name_Tag_JE2.png', 'Name_Tag.png'], 'equipment'],
  // equipment - 武器工具
  iron_sword: [['Iron_Sword_JE3.png', 'Iron_Sword_JE2.png', 'Iron_Sword.png'], 'equipment'],
  diamond_sword: [['Diamond_Sword_JE3.png', 'Diamond_Sword_JE2.png', 'Diamond_Sword.png'], 'equipment'],
  bow: [['Bow_JE2.png', 'Bow_(Pulling_2)_JE2.png', 'Bow.png'], 'equipment'],
  iron_pickaxe: [['Iron_Pickaxe_JE3.png', 'Iron_Pickaxe_JE2.png', 'Iron_Pickaxe.png'], 'equipment'],
  diamond_pickaxe: [['Diamond_Pickaxe_JE3.png', 'Diamond_Pickaxe_JE2.png', 'Diamond_Pickaxe.png'], 'equipment'],
  iron_axe: [['Iron_Axe_JE3.png', 'Iron_Axe_JE2.png', 'Iron_Axe.png'], 'equipment'],
  iron_shovel: [['Iron_Shovel_JE3.png', 'Iron_Shovel_JE2.png', 'Iron_Shovel.png'], 'equipment'],
  // equipment - 盔甲
  leather_armor: [['Leather_Tunic_JE2.png', 'Leather_Tunic.png', 'Leather_Armor_JE2.png'], 'equipment'],
  iron_armor: [['Iron_Chestplate_JE2.png', 'Iron_Chestplate.png', 'Iron_Armor_JE2.png'], 'equipment'],
  diamond_armor: [['Diamond_Chestplate_JE2.png', 'Diamond_Chestplate.png', 'Diamond_Armor_JE2.png'], 'equipment'],
  shield: [['Shield_JE2.png', 'Shield.png'], 'equipment'],
  fishing_rod: [['Fishing_Rod_JE2.png', 'Fishing_Rod.png'], 'equipment'],
  trident: [['Trident_JE1.png', 'Trident.png'], 'equipment'],
  crossbow: [['Crossbow_JE2.png', 'Crossbow.png'], 'equipment'],
  elytra: [['Elytra_JE2.png', 'Elytra_(item)_JE1.png', 'Elytra.png'], 'equipment'],
  totem: [['Totem_of_Undying_JE2.png', 'Totem_of_Undying.png'], 'equipment'],
  // monsters
  zombie: [['Zombie_JE7.png', 'Zombie_JE6.png', 'Zombie.png'], 'monsters'],
  skeleton: [['Skeleton_JE6.png', 'Skeleton_JE5.png', 'Skeleton.png'], 'monsters'],
  spider: [['Spider_JE5.png', 'Spider_JE4.png', 'Spider.png'], 'monsters'],
  enderman: [['Enderman_JE5.png', 'Enderman_JE4.png', 'Enderman.png'], 'monsters'],
  slime: [['Slime_JE3.png', 'Slime_JE2.png', 'Slime.png'], 'monsters'],
  witch: [['Witch_JE3.png', 'Witch_JE2.png', 'Witch.png'], 'monsters'],
  blaze: [['Blaze_JE3.png', 'Blaze_JE2.png', 'Blaze.png'], 'monsters'],
  wither_skeleton: [['Wither_Skeleton_JE4.png', 'Wither_Skeleton_JE3.png', 'Wither_Skeleton.png'], 'monsters'],
  phantom: [['Phantom_JE2.png', 'Phantom.png'], 'monsters'],
  vindicator: [['Vindicator_JE2.png', 'Vindicator.png'], 'monsters'],
  evoker: [['Evoker_JE2.png', 'Evoker.png'], 'monsters'],
  // animals
  squid: [['Squid_JE3.png', 'Squid_JE2.png', 'Squid.png'], 'animals'],
  glow_squid: [['Glow_Squid_JE2.png', 'Glow_Squid.png'], 'animals'],
  frog: [['Frog_JE1.png', 'Frog.png'], 'animals'],
  allay: [['Allay_JE1.png', 'Allay.png'], 'animals'],
  camel: [['Camel_JE1.png', 'Camel.png'], 'animals'],
  sniffer: [['Sniffer_JE1.png', 'Sniffer.png'], 'animals'],
};

async function getImageUrl(filename) {
  const params = new URLSearchParams({
    action: 'query', titles: `File:${filename}`,
    prop: 'imageinfo', iiprop: 'url|size', format: 'json',
  });
  const res = await fetch(`${API}?params=${params.toString()}`);
  // 修正：参数名应为 params 还是直接拼接？
  const res2 = await fetch(`${API}?${params}`);
  const data = await res2.json();
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

async function processEntry(id, candidates, category) {
  const sharp = (await import('sharp')).default;
  const dstPath = resolve(root, 'public/images', category, `${id}.webp`);

  // 如果已有大于3KB的真实图片，跳过
  if (existsSync(dstPath) && statSync(dstPath).size > 3000) {
    return 'skip';
  }

  for (const filename of candidates) {
    try {
      const info = await getImageUrl(filename);
      if (!info || !info.url) continue;
      // 跳过太小的图片
      if (info.width < 32 || info.height < 32) continue;

      const buf = await downloadImage(info.url);
      await sharp(buf).resize(128, 128, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .webp({ quality: 85 }).toFile(dstPath);
      return 'ok';
    } catch { }
  }

  // 搜索兜底
  const searchTerm = candidates[0].replace(/_JE\d+\.png$/, '').replace(/\.png$/, '');
  try {
    const results = await searchFilename(searchTerm);
    for (const name of results.slice(0, 5)) {
      try {
        const info = await getImageUrl(name);
        if (!info || !info.url || info.width < 32) continue;
        const buf = await downloadImage(info.url);
        await sharp(buf).resize(128, 128, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
          .webp({ quality: 85 }).toFile(dstPath);
        return 'ok';
      } catch { }
    }
  } catch { }

  return 'fail';
}

// 主流程
const entries = Object.entries(DOWNLOAD_MAP);
let ok = 0, skip = 0, fail = 0;

console.log(`开始下载 ${entries.length} 个图片素材...\n`);

for (let i = 0; i < entries.length; i++) {
  const [id, [candidates, category]] = entries[i];
  process.stdout.write(`[${i + 1}/${entries.length}] ${id} (${candidates[0]}) ... `);
  const result = await processEntry(id, candidates, category);
  if (result === 'ok') { console.log('✅'); ok++; }
  else if (result === 'skip') { console.log('⏭️ 已有'); skip++; }
  else { console.log('❌'); fail++; }
  // 限速
  await new Promise(r => setTimeout(r, 300));
}

console.log(`\n完成: ${ok} 成功, ${skip} 跳过, ${fail} 失败`);
