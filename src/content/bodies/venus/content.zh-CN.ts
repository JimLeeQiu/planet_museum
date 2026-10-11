import type { BodyContent } from '../../types';

/** 金星展台中文内容（SPEC §4.3）。 */
export const venusContent = {
  name: { zh: '金星', original: 'Venus' },
  narration: {
    sentences: [
      '金星是清晨和傍晚天上最亮的那颗星星，古人叫它「启明星」和「长庚星」，其实它们是同一颗。',
      '金星的一天比一年还要长，而且它是倒着自转的，像一辆在太空里慢慢倒着开的金色小汽车。',
    ],
    pronunciation: {
      金星: 'jīn xīng',
      启明星: 'qǐ míng xīng',
      长庚星: 'cháng gēng xīng',
      自转: 'zì zhuàn',
    },
  },
  facts: [
    {
      title: '直径约 12,104 千米',
      analogy: '金星和地球差不多大，像一对双胞胎，只是金星脾气更「火爆」。',
    },
    {
      title: '一年约 225 天，一天约 243 天',
      analogy: '在金星上，太阳还没升起来多久，生日就到了——因为一天比一年还要长。',
    },
    {
      title: '表面约 460°C',
      analogy: '像一台全天开着的大烤炉，连铅做的玩具都会化成水。',
    },
    {
      title: '清晨和傍晚最亮的星',
      analogy: '早晚抬头找最亮的那颗「大灯泡」，那就是金星在和我们打招呼。',
    },
    {
      title: '自转方向和其他行星相反',
      analogy: '别的行星向前走，金星偏偏倒着走，像在太空里玩倒车游戏。',
    },
  ],
  parentGuide: [
    '清晨和傍晚各有一颗特别亮的星星，你愿意当一次「找星星小侦探」吗？',
    '如果一天比一年还要长，你觉得会先过生日，还是先等到天亮？',
    '金星那么热、那么亮，你觉得它上面会住着谁呢？',
  ],
  uncertaintyNotes: [
    '展台里的金星模型比真实金星小了很多很多，是为了能放进屏幕里。',
    '贴图是艺术家根据探测器数据绘制的简化版，厚厚的云层下藏着真正的表面，我们看不清楚。',
    '「倒着自转」「一天比一年长」来自探测器的测量，孩子听起来可能觉得奇怪——这正是金星有趣的地方。',
  ],
  sources: [
    {
      label: 'NASA Planetary Fact Sheet — Venus',
      url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/venusfact.html',
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
    diameterKm: 12104,
    meanDistanceFromSunKm: 108_200_000,
    hostDistanceKm: null,
    orbitalPeriodDays: 224.7,
    rotationPeriodHours: 5832.5,
  },
} satisfies BodyContent;
