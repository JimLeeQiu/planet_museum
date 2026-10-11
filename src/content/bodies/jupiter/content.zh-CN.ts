import type { BodyContent } from '../../types';

/** 木星展台中文内容（SPEC §4.3）。 */
export const jupiterContent = {
  name: { zh: '木星', original: 'Jupiter' },
  narration: {
    sentences: [
      '木星是行星之王，肚子里能装下一千三百多个地球，是一个超级大巨人。',
      '木星脸上有一块大红斑，那是刮了几百年的大风暴，比地球还大；它的一天很短，只有十个小时左右。',
    ],
    pronunciation: {
      木星: 'mù xīng',
      大红斑: 'dà hóng bān',
      风暴: 'fēng bào',
    },
  },
  facts: [
    {
      title: '直径约 139,820 千米',
      analogy: '木星能装下一千三百多个地球，就像把一千三百颗小弹珠塞进一个大皮球。',
    },
    {
      title: '大红斑：刮了数百年的巨型风暴，比地球还大',
      analogy: '那场风暴大到可以整个吞下我们的地球，而且几百岁啦，还没有停。',
    },
    {
      title: '一年约 4,330 天（地球的 11.9 年）',
      analogy: '木星过一岁，地球上的你已经从两岁小不点长成十四岁的大孩子啦。',
    },
    {
      title: '一天只有约 9.9 小时',
      analogy: '木星的一天短到只够吃一顿大餐、打一个盹。',
    },
    {
      title: '离太阳约 7.8 亿千米',
      analogy: '如果太阳是操场中央的大灯，木星要站得远远的，在围墙外面。',
    },
  ],
  parentGuide: [
    '如果木星能装下一千三百多个地球，你觉得住在木星上是什么感觉？',
    '大红斑刮了好几百年都不停，你想问问它什么问题？',
    '木星的一天只有十个小时，你想怎么安排这么短的一天？',
  ],
  uncertaintyNotes: [
    '展台里的木星模型比真实木星小了很多很多，是为了能放进屏幕里。',
    '贴图是艺术家根据 NASA 探测器照片绘制的简化版，真正的木星还要壮观复杂得多。',
    '大红斑的大小和颜色会慢慢变化，展台画的是它近些年大致的样子。',
  ],
  sources: [
    {
      label: 'NASA Planetary Fact Sheet — Jupiter',
      url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html',
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
    diameterKm: 139820,
    meanDistanceFromSunKm: 778_500_000,
    hostDistanceKm: null,
    orbitalPeriodDays: 4330.6,
    rotationPeriodHours: 9.93,
  },
} satisfies BodyContent;
