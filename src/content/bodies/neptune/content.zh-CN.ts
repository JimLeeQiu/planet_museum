import type { BodyContent } from '../../types';

/** 海王星展台中文内容（SPEC §4.3）。 */
export const neptuneContent = {
  name: { zh: '海王星', original: 'Neptune' },
  narration: {
    sentences: [
      '海王星是离太阳最远的蓝色大行星，太阳光跑到它那里，都要跑四个多小时。',
      '它是数学家先在纸上算出来、望远镜才找到的行星，上面的风是太阳系里跑得最快的，呼呼地吹。',
    ],
    pronunciation: {
      海王星: 'hǎi wáng xīng',
      数学: 'shù xué',
      望远镜: 'wàng yuǎn jìng',
    },
  },
  facts: [
    {
      title: '直径约 49,244 千米',
      analogy: '海王星比地球大得多，如果地球是一颗玻璃珠，海王星就像一颗大乒乓球。',
    },
    {
      title: '离太阳约 45 亿千米',
      analogy: '太阳光从太阳出发，要跑四个多小时才到海王星——而你眨一下眼睛的时间，光已经跑了好远好远。',
    },
    {
      title: '一年约 164.8 个地球年',
      analogy: '海王星走得好慢好慢，从它被发现的 1846 年到现在，还没有完整地绕太阳跑完一圈呢。',
    },
    {
      title: '风速可超过 2,000 千米/时',
      analogy: '比最快的飞机还要快好多倍，要是在海王星上放风筝，风筝会「嗖」的一下飞得没影。',
    },
  ],
  parentGuide: [
    '海王星是先被人用纸和笔算出来、后来才被望远镜找到的，你觉得数学家是怎么算到的呢？',
    '海王星的一年要一百六十多个地球年，如果你的生日在海王星上过，会发生什么好玩的事？',
    '你想在海王星上放一次最快的风筝吗？风那么大，我们要怎么抓住它？',
  ],
  uncertaintyNotes: [
    '海王星的一年约 164.8 个地球年，自 1846 年被发现以来，它还没有完整地绕太阳跑完一圈——这个时间太长，科学家还在等它跑完呢。',
    '展台里的海王星模型比真实海王星小了很多很多，是为了能放进屏幕里。',
    '贴图是艺术家根据 NASA 探测器照片绘制的简化版，真正的海王星大气还要复杂美丽得多。',
  ],
  sources: [
    {
      label: 'NASA Planetary Fact Sheet — Neptune',
      url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/neptunefact.html',
      accessedOn: '2026-10-11',
    },
    {
      label: 'Solar System Scope 纹理页（CC BY 4.0）',
      url: 'https://www.solarsystemscope.com/textures/',
      accessedOn: '2026-10-11',
    },
  ],
  editorial: {
    editedBy: '星球博物馆项目组',
    reviewedBy: '星球博物馆项目组',
    reviewedOn: '2026-10-11',
  },
  data: {
    diameterKm: 49244,
    meanDistanceFromSunKm: 4_495_000_000,
    hostDistanceKm: null,
    orbitalPeriodDays: 60182,
    rotationPeriodHours: 16.11,
  },
} satisfies BodyContent;
