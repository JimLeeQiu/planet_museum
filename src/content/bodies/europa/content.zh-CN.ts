import type { BodyContent } from '../../types';

/** 木卫二（欧罗巴）展台中文内容（SPEC §4.3）。 */
export const europaContent = {
  name: { zh: '木卫二（欧罗巴）', original: 'Europa' },
  narration: {
    sentences: [
      '欧罗巴是木星的一颗冰月亮，表面滑溜溜的，画满了棕色的纹路。',
      '它厚厚的冰壳下面，可能藏着一片比地球还要大的海洋。',
    ],
    pronunciation: {
      欧罗巴: 'ōu luó bā',
      冰壳: 'bīng ké',
      藏着: 'cáng zhe',
    },
  },
  facts: [
    {
      title: '直径约 3,122 千米',
      analogy: '比月球小一点，像个圆圆的冰皮球。',
    },
    {
      title: '离木星约 67 万千米',
      analogy: '围着木星转一圈只要三天半，像小狗追着主人跑。',
    },
    {
      title: '冰壳下可能有大海洋',
      analogy: '科学家猜那里的水，比地球上所有的海水加起来还多。',
    },
    {
      title: '永远用同一面对着木星',
      analogy: '就像小宝宝一直仰着头看妈妈。',
    },
  ],
  parentGuide: [
    '你觉得冰壳下面会有生命吗？',
    '如果冰下面真的都是水，你希望潜水艇能看到什么？',
    '欧罗巴表面的棕色纹路，你觉得像什么图案？',
  ],
  uncertaintyNotes: [
    '展台里的欧罗巴是程序化生成的想象的样子：真实表面是布满棕色裂纹的冰壳，模型只画了个大概。',
    '冰壳下的海洋是科学家的推测，探测器还没有亲眼看到。',
    '模型比真实欧罗巴大了很多很多，是为了能放进屏幕里。',
  ],
  sources: [
    {
      label: 'NASA Planetary Fact Sheet — Jupiter（卫星参数表）',
      url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html',
      accessedOn: '2026-10-11',
    },
  ],
  editorial: {
    editedBy: '星球博物馆项目组',
    reviewedBy: '星球博物馆项目组',
    reviewedOn: '2026-10-11',
  },
  data: {
    diameterKm: 3121.6,
    meanDistanceFromSunKm: null,
    hostDistanceKm: 671000,
    orbitalPeriodDays: 3.55,
    rotationPeriodHours: 85.2,
  },
} satisfies BodyContent;
