import type { BodyContent } from '../../types';

/** 月球展台中文内容（SPEC §4.3）。 */
export const moonContent = {
  name: { zh: '月球', original: 'Moon' },
  narration: {
    sentences: [
      '月球是地球的小伙伴，它绕着地球转一圈要 27 天多，而且它很害羞，永远用同一面对着地球。',
      '月球上没有空气也没有水，白天很热、晚上很冷，1969 年，阿姆斯特朗第一次把脚印留在了月亮上。',
    ],
    pronunciation: {
      月球: 'yuè qiú',
      阿姆斯特朗: 'ā mǔ sī tè lǎng',
    },
  },
  facts: [
    {
      title: '直径约 3,475 千米',
      analogy: '月球比地球小得多，像是地球的小弟弟。',
    },
    {
      title: '离地球约 38.4 万千米',
      analogy: '如果坐小汽车去月球，要日夜不停地开一百多天。',
    },
    {
      title: '绕地球一圈约 27.3 天',
      analogy: '月球绕着地球慢慢散步，走一圈差不多是一个月。',
    },
    {
      title: '白天黑夜温差巨大',
      analogy: '月球上没有空气盖被子，白天像烤火，夜里像冰柜。',
    },
  ],
  parentGuide: [
    '晚上一起看看月亮，它的形状有时候圆、有时候弯，和孩子猜猜这是为什么？',
    '月球永远用同一面对着地球，如果你是小兔子住在月球上，会想让地球看到哪一面？',
    '阿姆斯特朗在月亮上留下第一个脚印，如果是你，想在月亮上留下什么？',
  ],
  uncertaintyNotes: [
    '月球被地球潮汐锁定，永远以同一面朝向地球，展台的自转表现遵循这一天文事实。',
    '展台里的月球模型比真实月球大了很多很多，是为了能放进屏幕里。',
    '贴图是艺术家根据 NASA 探测器照片绘制的简化版。',
  ],
  sources: [
    {
      label: 'NASA Planetary Fact Sheet — Moon',
      url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/moonfact.html',
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
    diameterKm: 3474.8,
    meanDistanceFromSunKm: null,
    hostDistanceKm: 384400,
    orbitalPeriodDays: 27.32,
    rotationPeriodHours: 655.7,
  },
} satisfies BodyContent;
