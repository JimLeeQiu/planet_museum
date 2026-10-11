import type { BodyContent } from '../../types';

/** 灶神星展台中文内容（SPEC §4.3）。 */
export const vestaContent = {
  name: { zh: '灶神星', original: 'Vesta' },
  narration: {
    sentences: [
      '灶神星住在火星和木星之间的小行星带，是小行星带里最亮的小不点。',
      '它的身上有好多好多大坑，是很久以前被别的石块重重撞出来的。',
    ],
    pronunciation: {
      灶神星: 'zào shén xīng',
      小行星带: 'xiǎo xíng xīng dài',
    },
  },
  facts: [
    {
      title: '直径约 525 千米',
      analogy: '和英国的大小差不多，是颗「迷你行星」。',
    },
    {
      title: '离太阳约 3.5 亿千米',
      analogy: '住在火星和木星之间的「石头环带」里。',
    },
    {
      title: '一天只有约 5.3 小时',
      analogy: '你还没睡醒，灶神星已经翻了好多个跟头。',
    },
    {
      title: 'Dawn 探测器 2011 年拜访过它',
      analogy: '它是人类坐飞船去串过门的小行星之一。',
    },
  ],
  parentGuide: [
    '地球上能找到灶神星的「石头碎片」，你觉得它们是怎么飞过来的？',
    '小行星带听着很挤，其实石块之间隔得好远好远，你想去看看吗？',
    '如果给灶神星起个小名，你会叫它什么？',
  ],
  uncertaintyNotes: [
    '展台里的灶神星是程序化生成的「想象的样子」：真实灶神星形状更不规则，还带着一个巨大的撞击坑。',
    '模型比真实灶神星大了很多很多，是为了能放进屏幕里。',
  ],
  sources: [
    {
      label: 'NASA Planetary Fact Sheet — Asteroids',
      url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/asteroidfact.html',
      accessedOn: '2026-10-11',
    },
  ],
  editorial: {
    editedBy: '星球博物馆项目组',
    reviewedBy: '星球博物馆项目组',
    reviewedOn: '2026-10-11',
  },
  data: {
    diameterKm: 525.4,
    meanDistanceFromSunKm: 353600000,
    hostDistanceKm: null,
    orbitalPeriodDays: 1325.8,
    rotationPeriodHours: 5.34,
  },
} satisfies BodyContent;
