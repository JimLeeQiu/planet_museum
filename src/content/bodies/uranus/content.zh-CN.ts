import type { BodyContent } from '../../types';

/** 天王星展台中文内容（SPEC §4.3）。 */
export const uranusContent = {
  name: { zh: '天王星', original: 'Uranus' },
  narration: {
    sentences: [
      '天王星是一颗爱躺着打滚的行星，别的行星站得直直的转，它却歪着身子，像在太空里慢慢滚动的球。',
      '它披着青绿色的外衣，那是甲烷的颜色，它的一年特别长，要 84 个地球年才转完一圈。',
    ],
    pronunciation: {
      天王星: 'tiān wáng xīng',
      甲烷: 'jiǎ wán',
    },
  },
  facts: [
    {
      title: '直径约 50,724 千米',
      analogy: '把四个地球排成一队，才差不多和天王星一样宽。',
    },
    {
      title: '离太阳约 28.7 亿千米',
      analogy: '如果太阳是家里的小夜灯，天王星就在很远很远的街角。',
    },
    {
      title: '一年约 84 个地球年',
      analogy: '在天王星上，爷爷奶奶过完长长的一辈子，它才刚过完一年。',
    },
    {
      title: '自转轴几乎躺倒（约 98°）',
      analogy: '它不像地球那样站着转，而是侧着身子转，像小朋友躺在滑滑梯上滚下来。',
    },
  ],
  parentGuide: [
    '如果地球也像天王星一样躺着转，我们的白天和黑夜会变得怎样？',
    '天王星是青绿色的，如果请你给它重新涂一种颜色，你会选什么？',
    '天王星为什么「躺着」滚呢？可以和孩子编一个属于你们的故事。',
  ],
  uncertaintyNotes: [
    '展台里的天王星模型比真实天王星小了很多很多，是为了能放进屏幕里。',
    '贴图是艺术家根据 NASA 探测器照片绘制的简化版，真正的天王星还要柔和神秘得多。',
    '天王星为什么会「躺着」自转，科学家还没有完全弄清楚，这正是它最迷人的地方。',
  ],
  sources: [
    {
      label: 'NASA Planetary Fact Sheet — Uranus',
      url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/uranusfact.html',
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
    diameterKm: 50724,
    meanDistanceFromSunKm: 2_871_000_000,
    hostDistanceKm: null,
    orbitalPeriodDays: 30688.5,
    rotationPeriodHours: 17.24,
  },
} satisfies BodyContent;
