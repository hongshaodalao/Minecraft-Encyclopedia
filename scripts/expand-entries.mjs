import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const root = resolve(__dirname, '..');
const API = 'https://minecraft.wiki/api.php';

// 新增词条定义
const NEW_ENTRIES = [
  // ===== 方块 (blocks) - 新增10个 =====
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
    id: 'obsidian', name: '黑曜石', category: 'blocks',
    image: 'obsidian', audio: 'stone', sound: 'stone',
    displayText: '黑曜石是最硬的方块之一，可以用来做下界传送门。',
    audioText: '黑曜石黑黑的，特别硬，用钻石镐才能挖，可以做传送门去下界～',
    fact: '黑曜石需要钻石镐挖掘，要花很长时间',
    parentTip: '你知道什么是黑曜石吗？它是什么颜色的？',
    audioDuration: 17
  },
  {
    id: 'snow', name: '雪块', category: 'blocks',
    image: 'snow', audio: 'dirt', sound: 'dirt',
    displayText: '雪块白白的，堆在一起可以做雪人，放在高山上特别多。',
    audioText: '雪块白白软软的，堆起来可以做雪人，放在高山上到处都是～',
    fact: '4个雪球可以合成一个雪块',
    parentTip: '你堆过雪人吗？雪摸起来是什么感觉？',
    audioDuration: 16
  },
  {
    id: 'ice', name: '冰', category: 'blocks',
    image: 'ice', audio: 'water', sound: 'water',
    displayText: '冰很滑，走在上面会滑很远，在雪地里能找到。',
    audioText: '冰滑滑的，踩上去会滑好远，在特别冷的地方才能找到它～',
    fact: '冰放在火旁边会融化成水',
    parentTip: '你滑过冰吗？冰摸起来是什么感觉？',
    audioDuration: 16
  },
  {
    id: 'furnace', name: '熔炉', category: 'blocks',
    image: 'furnace', audio: 'stone', sound: 'stone',
    displayText: '熔炉可以烧东西，把矿石变成金属，把食物烤熟。',
    audioText: '熔炉可以把生的东西烤熟，把沙子烧成玻璃，特别有用～',
    fact: '熔炉用8个圆石合成',
    parentTip: '你吃过烤的食物吗？烤的和生的有什么区别？',
    audioDuration: 16
  },
  {
    id: 'chest', name: '箱子', category: 'blocks',
    image: 'chest', audio: 'wood', sound: 'wood',
    displayText: '箱子可以存放东西，两个箱子放一起可以变大箱子。',
    audioText: '箱子可以放好多东西，两个箱子放一起就变成大箱子啦～',
    fact: '大箱子有54个格子，是普通箱子的两倍',
    parentTip: '你有自己的小箱子吗？里面放了什么？',
    audioDuration: 16
  },

  // ===== 怪物 (monsters) - 新增8个 =====
  {
    id: 'creeper', name: '苦力怕', category: 'monsters',
    image: 'creeper', audio: 'creeper', sound: 'creeper',
    displayText: '苦力怕会悄悄靠近然后爆炸，是最可怕的怪物之一。',
    audioText: '苦力怕绿绿的，走路没有声音，靠近就会嘶嘶嘶然后砰！',
    fact: '苦力怕被闪电击中会变成高压苦力怕',
    parentTip: '你害怕突然的响声吗？遇到吓人的东西怎么办？',
    audioDuration: 17
  },
  {
    id: 'ghast', name: '恶魂', category: 'monsters',
    image: 'ghast', audio: 'ghast', sound: 'ghast',
    displayText: '恶魂是下界的大白球，会发射火球攻击你。',
    audioText: '恶魂白白的，飘在下界天空，会哭还会吐火球，很危险～',
    fact: '恶魂的眼泪可以用来炼药',
    parentTip: '你见过会飞的怪物吗？如果遇到危险你会怎么做？',
    audioDuration: 17
  },
  {
    id: 'magma_cube', name: '岩浆怪', category: 'monsters',
    image: 'magma_cube', audio: 'slime', sound: 'slime',
    displayText: '岩浆怪像史莱姆但会烫伤人，住在下界里。',
    audioText: '岩浆怪橙橙的，会弹来弹去，碰到会烫伤，要躲开哦～',
    fact: '大岩浆怪分裂后会变成小岩浆怪',
    parentTip: '你知道岩浆是什么吗？它和水有什么不同？',
    audioDuration: 16
  },
  {
    id: 'guardian', name: '守卫者', category: 'monsters',
    image: 'guardian', audio: 'guardian', sound: 'guardian',
    displayText: '守卫者住在海底神殿，有大眼睛会发射激光。',
    audioText: '守卫者住在海底，大眼睛会发光，还会发射激光保护神殿～',
    fact: '守卫者的眼睛会一直盯着你看',
    parentTip: '你去过海底吗？海底有什么神奇的东西？',
    audioDuration: 17
  },
  {
    id: 'shulker', name: '潜影贝', category: 'monsters',
    image: 'shulker', audio: 'shulker', sound: 'shulker',
    displayText: '潜影贝住在末地城，会发射子弹让你飘起来。',
    audioText: '潜影贝藏在盒子里，会发射子弹让你飘起来，打掉它可以做潜影盒～',
    fact: '潜影贝的壳可以做潜影盒，能装很多东西',
    parentTip: '你见过会飞的贝壳吗？如果飘起来会是什么感觉？',
    audioDuration: 17
  },
  {
    id: 'warden', name: '监守者', category: 'monsters',
    image: 'warden', audio: 'warden', sound: 'warden',
    displayText: '监守者是地下深处的可怕怪物，看不见但能听到你的声音。',
    audioText: '监守者住在地下深处，看不见但耳朵特别灵，走路要轻轻的～',
    fact: '监守者是游戏中最强的怪物之一',
    parentTip: '你害怕黑暗吗？在黑暗中你会怎么保护自己？',
    audioDuration: 17
  },
  {
    id: 'iron_golem', name: '铁傀儡', category: 'monsters',
    image: 'iron_golem', audio: 'iron', sound: 'iron',
    displayText: '铁傀儡是村庄的守护者，会保护村民不被怪物伤害。',
    audioText: '铁傀儡高高大大的，会保护村民，看到怪物就会把它打飞～',
    fact: '铁傀儡可以用4个铁块和1个南瓜合成',
    parentTip: '你有想要保护的人吗？你会怎么保护他们？',
    audioDuration: 16
  },
  {
    id: 'snow_golem', name: '雪傀儡', category: 'monsters',
    image: 'snow_golem', audio: 'snow', sound: 'snow',
    displayText: '雪傀儡会扔雪球打怪物，走过的地方会留下雪。',
    audioText: '雪傀儡戴着南瓜头，会扔雪球，走过的地方都会变白～',
    fact: '雪傀儡在沙漠里会融化',
    parentTip: '你想堆一个会走路的雪人吗？',
    audioDuration: 16
  },

  // ===== 动物 (animals) - 新增10个 =====
  {
    id: 'parrot', name: '鹦鹉', category: 'animals',
    image: 'parrot', audio: 'parrot', sound: 'parrot',
    displayText: '鹦鹉会学你说话，还能站在肩膀上陪你冒险。',
    audioText: '鹦鹉五颜六色的，会学你说话，还能站在你肩膀上一起去冒险～',
    fact: '鹦鹉会模仿附近怪物的声音',
    parentTip: '你见过会说话的鸟吗？如果鹦鹉学你说话会说什么？',
    audioDuration: 16
  },
  {
    id: 'turtle', name: '海龟', category: 'animals',
    image: 'turtle', audio: 'turtle', sound: 'turtle',
    displayText: '海龟会在沙滩上生蛋，小海龟破壳而出特别可爱。',
    audioText: '海龟慢慢悠悠的，会在沙滩上生蛋，小海龟从蛋里钻出来特别可爱～',
    fact: '海龟壳可以做水下呼吸的药水',
    parentTip: '你见过海龟吗？它走路快还是慢？',
    audioDuration: 16
  },
  {
    id: 'fox', name: '狐狸', category: 'animals',
    image: 'fox', audio: 'fox', sound: 'fox',
    displayText: '狐狸很聪明，会偷偷拿走东西，晚上才会出来活动。',
    audioText: '狐狸橙橙的，尾巴大大的，很聪明会偷东西，晚上才出来玩～',
    fact: '狐狸会捡起地上的东西然后叼着跑',
    parentTip: '你听过狐狸的故事吗？狐狸是什么样子的？',
    audioDuration: 16
  },
  {
    id: 'bee', name: '蜜蜂', category: 'animals',
    image: 'bee', audio: 'bee', sound: 'bee',
    displayText: '蜜蜂会采蜜，帮助花朵生长，但惹怒它们会被蛰。',
    audioText: '蜜蜂嗡嗡嗡，会采花蜜，帮花朵传粉，但惹它会蛰你哦～',
    fact: '蜜蜂蛰人后会死去',
    parentTip: '你见过蜜蜂采蜜吗？蜜蜂为什么会嗡嗡叫？',
    audioDuration: 16
  },
  {
    id: 'goat', name: '山羊', category: 'animals',
    image: 'goat', audio: 'goat', sound: 'goat',
    displayText: '山羊喜欢跳来跳去，还会用头撞你，住在高山上。',
    audioText: '山羊住在高山上，喜欢跳来跳去，还会用头把你撞飞～',
    fact: '山羊跳跃的高度是所有动物中最高的',
    parentTip: '你见过山羊吗？它喜欢吃什么？',
    audioDuration: 16
  },
  {
    id: 'axolotl', name: '美西螈', category: 'animals',
    image: 'axolotl', audio: 'axolotl', sound: 'axolotl',
    displayText: '美西螈是水里的小可爱，有粉色和蓝色，会帮你打怪物。',
    audioText: '美西螈住在水里，粉粉的特别可爱，还会帮你打水里的怪物～',
    fact: '美西螈可以装在水桶里带走',
    parentTip: '你见过美西螈吗？它是什么颜色的？',
    audioDuration: 16
  },
  {
    id: 'frog', name: '青蛙', category: 'animals',
    image: 'frog', audio: 'frog', sound: 'frog',
    displayText: '青蛙会跳来跳去，伸出舌头吃虫子，在沼泽里能找到。',
    audioText: '青蛙呱呱叫，会跳很高，伸出舌头吃虫子，住在沼泽里～',
    fact: '青蛙吃岩浆怪会掉落蛙明灯',
    parentTip: '你听过青蛙叫吗？是什么声音？',
    audioDuration: 16
  },
  {
    id: 'tadpole', name: '蝌蚪', category: 'animals',
    image: 'tadpole', audio: 'frog', sound: 'frog',
    displayText: '蝌蚪是青蛙的小时候，长着小尾巴在水里游。',
    audioText: '蝌蚪是青蛙宝宝，黑黑的有小尾巴，在水里游啊游～',
    fact: '蝌蚪长大后会变成青蛙',
    parentTip: '你见过蝌蚪吗？它和青蛙长得一样吗？',
    audioDuration: 16
  },
  {
    id: 'piglin', name: '猪灵', category: 'animals',
    image: 'piglin', audio: 'piglin', sound: 'piglin',
    displayText: '猪灵住在下界，特别喜欢金子，可以用金锭和它们交易。',
    audioText: '猪灵住在下界，喜欢金灿灿的东西，给它金锭它会给你好东西～',
    fact: '猪灵看到你穿金甲就不会攻击你',
    parentTip: '你喜欢金色的东西吗？如果遇到猪灵你会怎么做？',
    audioDuration: 17
  },
  {
    id: 'strider', name: '炽足兽', category: 'animals',
    image: 'strider', audio: 'strider', sound: 'strider',
    displayText: '炽足兽可以在岩浆上走路，骑着它就能安全过岩浆河。',
    audioText: '炽足兽红红的，脚很长，可以在岩浆上面走路，骑着它过岩浆河～',
    fact: '炽足兽是唯一能在岩浆上行走的生物',
    parentTip: '你知道岩浆有多热吗？如果能骑炽足兽你想去哪里？',
    audioDuration: 16
  },

  // ===== 物品 (items) - 新增5个 =====
  {
    id: 'cake', name: '蛋糕', category: 'items',
    image: 'cake', audio: 'cake', sound: 'cake',
    displayText: '蛋糕可以放在地上和朋友一起分享，能吃好几次。',
    audioText: '蛋糕圆圆的，可以放在地上，和朋友一起分着吃，能吃好多口～',
    fact: '一个蛋糕需要3桶牛奶、2糖、1鸡蛋、3小麦',
    parentTip: '你过生日会吃蛋糕吗？最喜欢什么口味的？',
    audioDuration: 16
  },
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

  // ===== 装备 (equipment) - 新增5个 =====
  {
    id: 'bow', name: '弓', category: 'equipment',
    image: 'bow', audio: 'bow', sound: 'bow',
    displayText: '弓可以射箭，远距离攻击怪物，拉开弓弦射得更远。',
    audioText: '弓可以射箭，拉开弓弦射得更远，打怪物特别方便～',
    fact: '弓拉满时伤害最高',
    parentTip: '你玩过弓箭玩具吗？射箭要注意什么？',
    audioDuration: 16
  },
  {
    id: 'fishing_rod', name: '钓鱼竿', category: 'equipment',
    image: 'fishing_rod', audio: 'fishing_rod', sound: 'fishing_rod',
    displayText: '钓鱼竿可以钓鱼，还能钓到宝物，甩出去等鱼上钩。',
    audioText: '钓鱼竿甩出去，等浮标沉下去就能钓到鱼，还能钓到宝物呢～',
    fact: '钓鱼有几率钓到附魔书、鞍等宝物',
    parentTip: '你钓过鱼吗？钓鱼需要什么？',
    audioDuration: 16
  },
  {
    id: 'shield', name: '盾牌', category: 'equipment',
    image: 'shield', audio: 'shield', sound: 'shield',
    displayText: '盾牌可以挡住怪物的攻击，保护你不受伤。',
    audioText: '盾牌可以挡住怪物的攻击，举起来就安全啦～',
    fact: '盾牌可以用旗帜自定义图案',
    parentTip: '你玩过打仗游戏吗？盾牌是做什么用的？',
    audioDuration: 16
  },
  {
    id: 'trident', name: '三叉戟', category: 'equipment',
    image: 'trident', audio: 'trident', sound: 'trident',
    displayText: '三叉戟可以扔出去攻击敌人，还能召唤闪电。',
    audioText: '三叉戟有三个尖尖，可以扔出去打怪物，还能召唤闪电～',
    fact: '三叉戟附魔激雷可以在雨天召唤闪电',
    parentTip: '你知道三叉戟是什么吗？它有几个尖？',
    audioDuration: 17
  },
  {
    id: 'crossbow', name: '弩', category: 'equipment',
    image: 'crossbow', audio: 'crossbow', sound: 'crossbow',
    displayText: '弩比弓射得更远更准，但装填时间更长。',
    audioText: '弩射得又远又准，但是装箭要等一会儿～',
    fact: '弩可以附魔多重射击，一次射出三支箭',
    parentTip: '弩和弓有什么不同？你觉得哪个更好用？',
    audioDuration: 16
  }
];

// 从 Minecraft Wiki 下载图片
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

// 搜索文件名
async function searchFilename(term) {
  const params = new URLSearchParams({
    action: 'query', list: 'search', srsearch: term,
    srnamespace: '6', srlimit: '10', format: 'json',
  });
  const res = await fetch(`${API}?${params}`);
  const data = await res.json();
  return (data.query?.search || []).map(r => r.title.replace('File:', ''));
}

// 下载图片并转换为 WebP
async function downloadImage(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

// 处理单个词条
async function processEntry(entry) {
  const sharp = (await import('sharp')).default;
  const imgDir = resolve(root, 'public/images', entry.category);
  mkdirSync(imgDir, { recursive: true });
  const dstPath = resolve(imgDir, `${entry.image}.webp`);

  // 如果已有图片，跳过
  if (existsSync(dstPath)) {
    return 'skip';
  }

  // 候选文件名映射
  const candidateMap = {
    glass: ['Glass_JE2.png', 'Glass.png'],
    bookshelf: ['Bookshelf_JE4.png', 'Bookshelf.png'],
    brick: ['Bricks_JE5.png', 'Bricks.png', 'Brick.png'],
    pumpkin: ['Pumpkin_JE7.png', 'Pumpkin.png'],
    cactus: ['Cactus_JE4.png', 'Cactus.png'],
    obsidian: ['Obsidian_JE3.png', 'Obsidian.png'],
    snow: ['Snow_Block_JE3.png', 'Snow_Block.png', 'Snow.png'],
    ice: ['Ice_JE3.png', 'Ice.png'],
    furnace: ['Furnace_JE4.png', 'Furnace.png'],
    chest: ['Chest_JE3.png', 'Chest.png'],
    creeper: ['Creeper_JE5.png', 'Creeper.png'],
    ghast: ['Ghast_JE4.png', 'Ghast.png'],
    magma_cube: ['Magma_Cube_JE3.png', 'Magma_Cube.png'],
    guardian: ['Guardian_JE2.png', 'Guardian.png'],
    shulker: ['Shulker_JE2.png', 'Shulker.png'],
    warden: ['Warden_JE1.png', 'Warden.png'],
    iron_golem: ['Iron_Golem_JE3.png', 'Iron_Golem.png'],
    snow_golem: ['Snow_Golem_JE3.png', 'Snow_Golem.png'],
    parrot: ['Parrot_JE2.png', 'Parrot.png'],
    turtle: ['Turtle_JE2.png', 'Turtle.png'],
    fox: ['Fox_JE2.png', 'Fox.png'],
    bee: ['Bee_JE2.png', 'Bee.png'],
    goat: ['Goat_JE2.png', 'Goat.png'],
    axolotl: ['Axolotl_JE2.png', 'Axolotl.png'],
    frog: ['Frog_JE2.png', 'Frog.png'],
    tadpole: ['Tadpole_JE2.png', 'Tadpole.png'],
    piglin: ['Piglin_JE3.png', 'Piglin.png'],
    strider: ['Strider_JE2.png', 'Strider.png'],
    cake: ['Cake_JE3.png', 'Cake.png'],
    bucket: ['Bucket_JE2.png', 'Bucket.png'],
    compass: ['Compass_JE3.png', 'Compass.png'],
    clock: ['Clock_JE3.png', 'Clock.png'],
    map: ['Map_JE2.png', 'Empty_Map_JE2.png', 'Map.png'],
    bow: ['Bow_JE2.png', 'Bow.png'],
    fishing_rod: ['Fishing_Rod_JE2.png', 'Fishing_Rod.png'],
    shield: ['Shield_JE2.png', 'Shield.png'],
    trident: ['Trident_JE1.png', 'Trident.png'],
    crossbow: ['Crossbow_JE2.png', 'Crossbow.png'],
  };

  const candidates = candidateMap[entry.image] || [`${entry.image.replace(/_/g, '_')}.png`];

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

  // 搜索兜底
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

// 主流程
const entriesPath = resolve(root, 'src/data/entries.json');
const existingEntries = JSON.parse(readFileSync(entriesPath, 'utf-8'));
const existingIds = new Set(existingEntries.map(e => e.id));

// 过滤掉已存在的词条
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

// 合并并写入 entries.json
const allEntries = [...existingEntries, ...newEntries];
writeFileSync(entriesPath, JSON.stringify(allEntries, null, 2), 'utf-8');

console.log(`\n完成: ${ok} 图片下载成功, ${skip} 跳过, ${fail} 失败`);
console.log(`词条总数: ${existingEntries.length} → ${allEntries.length}`);
