import type { BodyContent } from '../../types';

/** 谷神星展台中文内容（SPEC §4.3）。 */
export const ceresContent = {
  name: { zh: '谷神星', original: 'Ceres' },
  narration: {
    sentences: [
      '谷神星住在火星和木星之间的小行星带里，是小行星带唯一的矮行星。',
      '2015 年，Dawn 探测器飞到它身边，发现它脸上有一些亮晶晶的「小灯」，那是盐留下的痕迹。',
    ],
    pronunciation: {
      谷神星: 'gǔ shén xīng',
      矮行星: 'ǎi xíng xīng',
      探测器: 'tàn cè qì',
      亮晶晶: 'liàng jīng jīng',
    },
  },
  facts: [
    {
      title: '直径约 939 千米',
      analogy: '谷神星比月亮还小很多，像一个还没长大的小妹妹。',
    },
    {
      title: '离太阳约 4.14 亿千米（约 2.77 AU）',
      analogy: '它住在火星和木星之间的「小行星小区」里，邻居特别多。',
    },
    {
      title: '绕太阳一圈约 4.6 年（1,680 天）',
      analogy: '你从上幼儿园到上小学，谷神星才刚刚过完一岁。',
    },
    {
      title: '一天只有约 9 小时',
      analogy: '在谷神星上，你睡一觉醒来，两天就过去了。',
    },
  ],
  parentGuide: [
    '谷神星脸上的亮晶晶小斑点，你猜会是什么呢？',
    '如果一个小星球要花四年多才过一次生日，你觉得它会孤单吗？为什么？',
  ],
  uncertaintyNotes: [
    '展台贴图是 Solar System Scope 的虚构填充（原文件名标注 fictional）：真实的谷神星表面来自 Dawn 探测器照片，陨石坑密布，贴图上的颜色细节是想象的样子。',
    '展台里的谷神星模型比真实谷神星大了很多很多，是为了能放进屏幕里。',
  ],
  sources: [
    {
      label: 'NASA Planetary Fact Sheet — Asteroids',
      url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/asteroidfact.html',
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
    diameterKm: 939.4,
    meanDistanceFromSunKm: 413_700_000,
    hostDistanceKm: null,
    orbitalPeriodDays: 1680.1,
    rotationPeriodHours: 9.07,
  },
} satisfies BodyContent;
