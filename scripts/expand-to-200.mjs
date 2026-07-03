import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const API = 'https://minecraft.wiki/api.php';

// 分类正确的词条定义
const NEW_ENTRIES = [
  // ===== 方块 (blocks) - 自然资源、矿石、建筑材料 =====
  { id: 'granite', name: '花岗岩', category: 'blocks', image: 'granite', audio: 'stone', sound: 'stone', displayText: '花岗岩是粉色的石头，在地下很常见。', audioText: '花岗岩粉粉的，在地下到处都能找到它～', fact: '花岗岩可以做成抛光花岗岩', parentTip: '你见过粉色的石头吗？', audioDuration: 16 },
  { id: 'diorite', name: '闪长岩', category: 'blocks', image: 'diorite', audio: 'stone', sound: 'stone', displayText: '闪长岩是黑白相间的石头，可以做建筑材料。', audioText: '闪长岩白白的有黑点点，做建筑材料很好看～', fact: '闪长岩可以做成抛光滑长岩', parentTip: '你见过黑白花纹的石头吗？', audioDuration: 16 },
  { id: 'andesite', name: '安山岩', category: 'blocks', image: 'andesite', audio: 'stone', sound: 'stone', displayText: '安山岩是灰色的石头，和花岗岩、闪长岩是好朋友。', audioText: '安山岩灰灰的，和花岗岩、闪长岩经常在一起～', fact: '安山岩可以做成抛光安山岩', parentTip: '灰色的石头看起来像什么？', audioDuration: 16 },
  { id: 'dirt_path', name: '土径', category: 'blocks', image: 'dirt_path', audio: 'dirt', sound: 'dirt', displayText: '土径是用铲子把草方块铲平做成的路。', audioText: '用铲子铲一铲草方块，就变成平平的土径啦～', fact: '土径比普通方块矮一点', parentTip: '你家门前有小路吗？', audioDuration: 16 },
  { id: 'mud', name: '泥巴', category: 'blocks', image: 'mud', audio: 'dirt', sound: 'dirt', displayText: '泥巴是湿湿的土，用水瓶倒在土上就能做出来。', audioText: '泥巴湿湿的，用水瓶倒点水就变出来啦～', fact: '泥巴可以做成泥砖', parentTip: '你玩过泥巴吗？', audioDuration: 16 },
  { id: 'packed_mud', name: '压实泥巴', category: 'blocks', image: 'packed_mud', audio: 'dirt', sound: 'dirt', displayText: '压实泥巴是把泥巴压紧做成的方块。', audioText: '把泥巴压一压就变成压实泥巴啦～', fact: '压实泥巴可以做成泥砖', parentTip: '你压过什么东西吗？', audioDuration: 16 },
  { id: 'mud_bricks', name: '泥砖', category: 'blocks', image: 'mud_bricks', audio: 'stone', sound: 'stone', displayText: '泥砖是用泥巴做的砖块，可以盖房子。', audioText: '泥砖用泥巴就能做，盖房子特别好看～', fact: '4个压实泥巴可以做4个泥砖', parentTip: '你见过泥巴做的房子吗？', audioDuration: 16 },
  { id: 'smooth_stone', name: '平滑石头', category: 'blocks', image: 'smooth_stone', audio: 'stone', sound: 'stone', displayText: '平滑石头是把石头烧一烧做出来的，很光滑。', audioText: '把石头放进熔炉烧一烧，就变成平滑石头啦～', fact: '平滑石头可以做平滑石台阶', parentTip: '你见过光滑的石头吗？', audioDuration: 16 },
  { id: 'stone_bricks', name: '石砖', category: 'blocks', image: 'stone_bricks', audio: 'stone', sound: 'stone', displayText: '石砖是用石头做的砖块，很结实很漂亮。', audioText: '石砖方方正正的，造房子特别结实～', fact: '4个石头可以做4个石砖', parentTip: '你见过砖头做的房子吗？', audioDuration: 16 },

  // ===== 物品 (items) - 食物、工具、装饰品 =====
  { id: 'glowstone', name: '荧石', category: 'items', image: 'glowstone', audio: 'glass', sound: 'glass', displayText: '荧石会发光，放在哪里都能照亮一片。', audioText: '荧石亮闪闪的，放在哪里都能照亮一片～', fact: '荧石粉可以做红石灯', parentTip: '你见过会发光的石头吗？', audioDuration: 16 },
  { id: 'redstone_lamp', name: '红石灯', category: 'items', image: 'redstone_lamp', audio: 'redstone', sound: 'redstone', displayText: '红石灯通电就会亮，可以做电灯。', audioText: '红石灯通上电就亮啦，可以做电灯～', fact: '红石灯需要红石信号才能亮', parentTip: '你家的灯是怎么亮的？', audioDuration: 16 },
  { id: 'lantern', name: '灯笼', category: 'items', image: 'lantern', audio: 'iron', sound: 'iron', displayText: '灯笼可以挂在墙上或地上，照亮周围。', audioText: '灯笼可以挂起来，照亮周围的地方～', fact: '灯笼比火把亮一点', parentTip: '你见过灯笼吗？', audioDuration: 16 },
  { id: 'soul_lantern', name: '灵魂灯笼', category: 'items', image: 'soul_lantern', audio: 'iron', sound: 'iron', displayText: '灵魂灯笼发出蓝色的光，很神秘。', audioText: '灵魂灯笼蓝蓝的，看起来很神秘～', fact: '灵魂灯笼可以驱赶猪灵', parentTip: '你喜欢蓝色的光吗？', audioDuration: 16 },
  { id: 'painting', name: '画', category: 'items', image: 'painting', audio: 'wood', sound: 'wood', displayText: '画可以挂在墙上做装饰，有很多不同的图案。', audioText: '画可以挂在墙上，有好多好多不同的图案～', fact: '画的内容是随机的', parentTip: '你喜欢画画吗？', audioDuration: 16 },
  { id: 'flower_pot', name: '花盆', category: 'items', image: 'flower_pot', audio: 'dirt', sound: 'dirt', displayText: '花盆可以种花，放在家里很漂亮。', audioText: '花盆可以种花，放在家里特别好看～', fact: '花盆可以种很多不同的植物', parentTip: '你种过花吗？', audioDuration: 16 },
  { id: 'item_frame', name: '物品展示框', category: 'items', image: 'item_frame', audio: 'wood', sound: 'wood', displayText: '物品展示框可以把东西挂在墙上展示。', audioText: '物品展示框可以把东西挂在墙上给大家看～', fact: '物品展示框可以显示地图', parentTip: '你有展示过自己的收藏吗？', audioDuration: 16 },
  { id: 'armor_stand', name: '盔甲架', category: 'items', image: 'armor_stand', audio: 'wood', sound: 'wood', displayText: '盔甲架可以放盔甲，展示你的装备。', audioText: '盔甲架可以把盔甲穿在上面展示出来～', fact: '盔甲架可以摆不同的姿势', parentTip: '你有展示过自己的玩具吗？', audioDuration: 16 },
  { id: 'banner', name: '旗帜', category: 'items', image: 'banner', audio: 'wood', sound: 'wood', displayText: '旗帜可以做标记，还能装饰房子。', audioText: '旗帜可以做标记，还能装饰房子～', fact: '旗帜可以画上很多不同的图案', parentTip: '你见过旗帜吗？', audioDuration: 16 },

  // ===== 装备 (equipment) - 武器、盔甲、工具 =====
  { id: 'stone_hoe', name: '石锄', category: 'equipment', image: 'stone_hoe', audio: 'stone', sound: 'stone', displayText: '石锄可以翻地种庄稼。', audioText: '石锄可以翻地，种庄稼离不开它～', fact: '锄头还能割草', parentTip: '你见过锄头吗？', audioDuration: 16 },
  { id: 'iron_hoe', name: '铁锄', category: 'equipment', image: 'iron_hoe', audio: 'iron', sound: 'iron', displayText: '铁锄比石锄更耐用，翻地更快。', audioText: '铁锄比石锄结实，翻地嗖嗖的～', fact: '铁锄可以挖草方块', parentTip: '铁做的工具和石头做的有什么不同？', audioDuration: 16 },
  { id: 'diamond_hoe', name: '钻石锄', category: 'equipment', image: 'diamond_hoe', audio: 'diamond', sound: 'diamond', displayText: '钻石锄是最耐用的锄头，永远用不坏。', audioText: '钻石锄特别结实，永远用不坏～', fact: '钻石锄是最稀有的工具', parentTip: '你想要一个永远用不坏的工具吗？', audioDuration: 16 },
  { id: 'golden_hoe', name: '金锄', category: 'equipment', image: 'golden_hoe', audio: 'gold', sound: 'gold', displayText: '金锄很漂亮但不耐用，翻地特别快。', audioText: '金锄金灿灿的，翻地特别快但容易坏～', fact: '金锄的附魔概率很高', parentTip: '金色的东西好看吗？', audioDuration: 16 },
  { id: 'chainmail_armor', name: '锁链甲', category: 'equipment', image: 'chainmail_armor', audio: 'iron', sound: 'iron', displayText: '锁链甲是用铁环做的盔甲，很特别。', audioText: '锁链甲用铁环做的，穿起来很特别～', fact: '锁链甲不能合成，只能交易获得', parentTip: '你见过锁链做的东西吗？', audioDuration: 16 },
  { id: 'golden_armor', name: '金甲', category: 'equipment', image: 'golden_armor', audio: 'gold', sound: 'gold', displayText: '金甲很漂亮但不耐用，附魔效果特别好。', audioText: '金甲金灿灿的，穿起来特别帅～', fact: '金甲可以防止猪灵攻击', parentTip: '你穿过金色的衣服吗？', audioDuration: 16 },
  { id: 'turtle_helmet', name: '海龟壳', category: 'equipment', image: 'turtle_helmet', audio: 'turtle', sound: 'turtle', displayText: '海龟壳可以做头盔，还能做水下呼吸药水。', audioText: '海龟壳可以做头盔，戴上去能在水下待更久～', fact: '海龟壳可以做神龟药水', parentTip: '你见过海龟吗？', audioDuration: 16 },
  { id: 'warped_fungus_on_a_stick', name: '诡异菌钓竿', category: 'equipment', image: 'warped_fungus_on_a_stick', audio: 'wood', sound: 'wood', displayText: '诡异菌钓竿可以控制炽足兽的方向。', audioText: '诡异菌钓竿可以控制炽足兽，骑着它去冒险～', fact: '炽足兽会跟着诡异菌钓竿走', parentTip: '你骑过什么动物吗？', audioDuration: 16 },

  // ===== 怪物 (monsters) - 敌对生物、中立生物、NPC =====
  { id: 'breeze', name: '旋风人', category: 'monsters', image: 'breeze', audio: 'breeze', sound: 'breeze', displayText: '旋风人会发射风弹，把你吹得远远的。', audioText: '旋风人会发射风弹，把你吹得好远好远～', fact: '旋风人是试炼密室的怪物', parentTip: '你见过旋风吗？', audioDuration: 17 },
  { id: 'bogged', name: '沼骸', category: 'monsters', image: 'bogged', audio: 'skeleton', sound: 'skeleton', displayText: '沼骸是沼泽里的骷髅，射出的箭有毒。', audioText: '沼骸住在沼泽里，射出的箭有毒，要小心～', fact: '沼骸会掉落毒箭', parentTip: '你去过沼泽吗？', audioDuration: 17 },
  { id: 'breeze_wind_charge', name: '风弹', category: 'monsters', image: 'breeze_wind_charge', audio: 'breeze', sound: 'breeze', displayText: '风弹是旋风人发射的攻击，会把你吹飞。', audioText: '风弹呼呼的，会把你吹得好高好远～', fact: '风弹可以用来做跳跃增强', parentTip: '你被风吹过吗？', audioDuration: 16 },
  { id: 'creaking', name: '嘎枝', category: 'monsters', image: 'creaking', audio: 'creaking', sound: 'creaking', displayText: '嘎枝住在诡异森林，你看它它就不动。', audioText: '嘎枝住在诡异森林，你看它它就不动啦～', fact: '嘎枝只在你看别处时才会动', parentTip: '你玩过一二三木头人吗？', audioDuration: 17 },
  { id: 'creeper_charged', name: '高压苦力怕', category: 'monsters', image: 'creeper_charged', audio: 'creeper', sound: 'creeper', displayText: '高压苦力怕被闪电击中过，爆炸威力更大。', audioText: '高压苦力怕被闪电击中过，爆炸威力特别大～', fact: '高压苦力怕爆炸威力是普通苦力怕的两倍', parentTip: '你见过闪电吗？', audioDuration: 17 },
  { id: 'ender_dragon', name: '末影龙', category: 'monsters', image: 'ender_dragon', audio: 'ender_dragon', sound: 'ender_dragon', displayText: '末影龙是最终boss，住在末地里。', audioText: '末影龙是最终boss，住在末地里，打败它就赢啦～', fact: '打败末影龙会掉落龙蛋', parentTip: '你打败过什么厉害的怪物吗？', audioDuration: 17 },
  { id: 'wither', name: '凋灵', category: 'monsters', image: 'wither', audio: 'wither', sound: 'wither', displayText: '凋灵是用灵魂沙和凋灵骷髅头召唤出来的boss。', audioText: '凋灵是自己召唤出来的boss，特别厉害～', fact: '凋灵会掉落下界之星', parentTip: '你召唤过什么强大的生物吗？', audioDuration: 17 },

  // ===== 动物 (animals) - 友好生物 =====
  { id: 'armadillo', name: '犰狳', category: 'animals', image: 'armadillo', audio: 'armadillo', sound: 'armadillo', displayText: '犰狳会卷成球保护自己，掉落的鳞甲可以做狼甲。', audioText: '犰狳会卷成球保护自己，特别可爱～', fact: '犰狳的鳞甲可以给狼穿', parentTip: '你见过犰狳吗？', audioDuration: 16 },
  { id: 'wolf_armor', name: '狼铠', category: 'animals', image: 'wolf_armor', audio: 'wolf', sound: 'wolf', displayText: '狼铠可以给狼穿上，保护它不受伤。', audioText: '狼铠可以给狼穿上，保护它不受伤～', fact: '狼铠可以用犰狳鳞甲做', parentTip: '你有养过宠物吗？', audioDuration: 16 },
  { id: 'cat', name: '猫', category: 'animals', image: 'cat', audio: 'cat', sound: 'cat', displayText: '猫可以驯服，会帮你赶走苦力怕和幻翼。', audioText: '猫咪喵喵叫，驯服它它就会保护你～', fact: '猫可以赶走苦力怕和幻翼', parentTip: '你喜欢猫吗？', audioDuration: 16 },
  { id: 'rabbit', name: '兔子', category: 'animals', image: 'rabbit', audio: 'rabbit', sound: 'rabbit', displayText: '兔子跳来跳去，很可爱，可以做兔子脚药水。', audioText: '兔子蹦蹦跳跳的，特别可爱～', fact: '兔子脚可以做跳跃药水', parentTip: '你见过兔子吗？', audioDuration: 16 },
  { id: 'bat2', name: '蝙蝠', category: 'animals', image: 'bat2', audio: 'bat', sound: 'bat', displayText: '蝙蝠住在洞里，会飞来飞去，不会伤害你。', audioText: '蝙蝠黑黑的，住在洞里会飞来飞去～', fact: '蝙蝠是唯一会飞的被动生物', parentTip: '你见过蝙蝠吗？', audioDuration: 16 },
  { id: 'squid2', name: '鱿鱼', category: 'animals', image: 'squid2', audio: 'squid', sound: 'squid', displayText: '鱿鱼住在水里，会喷墨汁。', audioText: '鱿鱼住在水里，会喷墨汁～', fact: '鱿鱼可以掉落墨囊', parentTip: '你见过鱿鱼吗？', audioDuration: 16 },
  { id: 'glow_squid2', name: '发光鱿鱼', category: 'animals', image: 'glow_squid2', audio: 'glow_squid', sound: 'glow_squid', displayText: '发光鱿鱼会发光，住在水里很漂亮。', audioText: '发光鱿鱼亮闪闪的，住在水里特别好看～', fact: '发光鱿鱼可以掉落荧光墨囊', parentTip: '你见过会发光的动物吗？', audioDuration: 16 },
  { id: 'frog2', name: '青蛙', category: 'animals', image: 'frog2', audio: 'frog', sound: 'frog', displayText: '青蛙会跳来跳去，伸出舌头吃虫子。', audioText: '青蛙呱呱叫，会跳很高～', fact: '青蛙吃岩浆怪会掉落蛙明灯', parentTip: '你听过青蛙叫吗？', audioDuration: 16 },
  { id: 'tadpole2', name: '蝌蚪', category: 'animals', image: 'tadpole2', audio: 'frog', sound: 'frog', displayText: '蝌蚪是青蛙的小时候，长着小尾巴在水里游。', audioText: '蝌蚪是青蛙宝宝，黑黑的有小尾巴～', fact: '蝌蚪长大后会变成青蛙', parentTip: '你见过蝌蚪吗？', audioDuration: 16 },
  { id: 'sniffer2', name: '嗅探兽', category: 'animals', image: 'sniffer2', audio: 'sniffer', sound: 'sniffer', displayText: '嗅探兽会闻地下的种子，帮你找到稀有植物。', audioText: '嗅探兽鼻子特别灵，能闻到地下的种子～', fact: '嗅探兽是远古生物', parentTip: '你见过什么动物鼻子很灵？', audioDuration: 16 },
  { id: 'camel2', name: '骆驼', category: 'animals', image: 'camel2', audio: 'camel', sound: 'camel', displayText: '骆驼可以骑两个人，还能跨过栅栏。', audioText: '骆驼高高的，可以骑两个人一起去冒险～', fact: '骆驼可以跨过1.5格高的方块', parentTip: '你见过骆驼吗？', audioDuration: 16 },
  { id: 'allay2', name: '悦灵', category: 'animals', image: 'allay2', audio: 'allay', sound: 'allay', displayText: '悦灵会帮你捡东西，给它一个物品它就帮你找。', audioText: '悦灵蓝蓝的，会帮你捡东西，特别贴心～', fact: '悦灵可以复制', parentTip: '你有帮妈妈捡过东西吗？', audioDuration: 16 }
];

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

// 候选文件名映射
const candidateMap = {
  granite: ['Granite_JE3.png', 'Granite.png'],
  diorite: ['Diorite_JE3.png', 'Diorite.png'],
  andesite: ['Andesite_JE3.png', 'Andesite.png'],
  dirt_path: ['Dirt_Path_JE2.png', 'Dirt_Path.png', 'Grass_Path_JE2.png', 'Grass_Path.png'],
  mud: ['Mud_JE1.png', 'Mud.png'],
  packed_mud: ['Packed_Mud_JE1.png', 'Packed_Mud.png'],
  mud_bricks: ['Mud_Bricks_JE1.png', 'Mud_Bricks.png'],
  smooth_stone: ['Smooth_Stone_JE2.png', 'Smooth_Stone.png'],
  stone_bricks: ['Stone_Bricks_JE4.png', 'Stone_Bricks.png'],
  glowstone: ['Glowstone_JE3.png', 'Glowstone.png'],
  redstone_lamp: ['Redstone_Lamp_JE3.png', 'Redstone_Lamp.png'],
  lantern: ['Lantern_JE2.png', 'Lantern.png'],
  soul_lantern: ['Soul_Lantern_JE2.png', 'Soul_Lantern.png'],
  painting: ['Painting_JE2.png', 'Painting.png'],
  flower_pot: ['Flower_Pot_JE3.png', 'Flower_Pot.png'],
  item_frame: ['Item_Frame_JE2.png', 'Item_Frame.png'],
  armor_stand: ['Armor_Stand_JE2.png', 'Armor_Stand.png'],
  banner: ['White_Banner_JE2.png', 'Banner.png'],
  stone_hoe: ['Stone_Hoe_JE3.png', 'Stone_Hoe.png'],
  iron_hoe: ['Iron_Hoe_JE3.png', 'Iron_Hoe.png'],
  diamond_hoe: ['Diamond_Hoe_JE3.png', 'Diamond_Hoe.png'],
  golden_hoe: ['Golden_Hoe_JE3.png', 'Golden_Hoe.png'],
  chainmail_armor: ['Chainmail_Chestplate_JE2.png', 'Chainmail_Chestplate.png'],
  golden_armor: ['Golden_Chestplate_JE2.png', 'Golden_Chestplate.png'],
  turtle_helmet: ['Turtle_Shell_JE2.png', 'Turtle_Shell.png'],
  warped_fungus_on_a_stick: ['Warped_Fungus_on_a_Stick_JE1.png', 'Warped_Fungus_on_a_Stick.png'],
  breeze: ['Breeze_JE1.png', 'Breeze.png'],
  bogged: ['Bogged_JE1.png', 'Bogged.png'],
  breeze_wind_charge: ['Wind_Charge_JE1.png', 'Wind_Charge.png'],
  creaking: ['Creaking_JE1.png', 'Creaking.png'],
  creeper_charged: ['Charged_Creeper_JE4.png', 'Creeper_JE5.png'],
  ender_dragon: ['Ender_Dragon_JE4.png', 'Ender_Dragon.png'],
  wither: ['Wither_JE3.png', 'Wither.png'],
  armadillo: ['Armadillo_JE1.png', 'Armadillo.png'],
  wolf_armor: ['Wolf_Armor_JE1.png', 'Wolf_Armor.png'],
  cat: ['Cat_JE2.png', 'Cat.png'],
  rabbit: ['Rabbit_JE4.png', 'Rabbit.png'],
  bat2: ['Bat_JE3.png', 'Bat.png'],
  squid2: ['Squid_JE3.png', 'Squid.png'],
  glow_squid2: ['Glow_Squid_JE2.png', 'Glow_Squid.png'],
  frog2: ['Frog_JE1.png', 'Frog.png'],
  tadpole2: ['Tadpole_JE2.png', 'Tadpole.png'],
  sniffer2: ['Sniffer_JE2.png', 'Sniffer.png'],
  camel2: ['Camel_JE2.png', 'Camel.png'],
  allay2: ['Allay_JE2.png', 'Allay.png'],
};

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

const newEntries = NEW_ENTRIES.filter(e => !existingIds.has(e.id));
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
