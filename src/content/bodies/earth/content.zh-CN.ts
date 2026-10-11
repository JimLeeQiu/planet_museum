import type { BodyContent } from '../../types';

/** 地球展台中文内容（SPEC §4.3 首发语言）。 */
export const earthContent = {
  name: { zh: '地球', original: 'Earth' },
  narration: {
    sentences: [
      '这是我们生活的地球，一颗蓝色的星球，大海和陆地手拉手。',
      '地球像一艘大飞船，载着我们在太空里慢慢旅行，一年绕太阳跑一圈。',
    ],
    pronunciation: {
      地球: 'dì qiú',
      旅行: 'lǚ xíng',
    },
  },
  facts: [
    {
      title: '直径约 12,742 千米',
      analogy: '坐飞机绕地球飞一圈，要两天两夜还多。',
    },
    {
      title: '离太阳约 1.5 亿千米',
      analogy: '太阳光跑这么远，只要 8 分钟，却是全世界最快的赛跑。',
    },
    {
      title: '绕太阳一圈 365 天多一点',
      analogy: '地球的一岁，就是我们的一年。',
    },
    {
      title: '七成表面是大海',
      analogy: '如果从太空看，地球更像一颗「水球」。',
    },
  ],
  parentGuide: [
    '找找看，我们住的地方在地球的哪一面？',
    '从太空看地球，为什么蓝色占了大部分？',
    '你觉得地球上最神奇的地方在哪里？',
  ],
  uncertaintyNotes: [
    '展台里的地球模型比真实地球小了很多很多，是为了能放进屏幕里。',
    '贴图是艺术家根据 NASA 卫星照片绘制的简化版，真正的地球还要复杂美丽得多。',
  ],
  sources: [
    {
      label: 'NASA Planetary Fact Sheet — Earth',
      url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/earthfact.html',
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
    diameterKm: 12742,
    meanDistanceFromSunKm: 149_600_000,
    hostDistanceKm: null,
    orbitalPeriodDays: 365.25,
    rotationPeriodHours: 23.93,
  },
} satisfies BodyContent;
