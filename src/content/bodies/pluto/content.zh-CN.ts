import type { BodyContent } from '../../types';

/** 冥王星展台中文内容（SPEC §4.3）。 */
export const plutoContent = {
  name: { zh: '冥王星', original: 'Pluto' },
  narration: {
    sentences: [
      '冥王星是一颗小小的矮行星，它有一颗大大的爱心，叫汤博区，是白白的氮冰平原。',
      '冥王星住得好远好远，从那里看，太阳只是一颗亮亮的小点点，一年要等上两百四十八年。',
    ],
    pronunciation: {
      冥王星: 'míng wáng xīng',
      矮行星: 'ǎi xíng xīng',
      汤博区: 'tāng bó qū',
      氮冰: 'dàn bīng',
    },
  },
  facts: [
    {
      title: '直径约 2,377 千米',
      analogy: '冥王星比月球还小，就像大人身边站着的小宝宝。',
    },
    {
      title: '离太阳约 59 亿千米',
      analogy: '如果把太阳到地球比作一步，冥王星要走三十九步那么远。',
    },
    {
      title: '绕太阳一圈约 248 年',
      analogy: '冥王星上的一年，比太爷爷的一生还要长好多好多。',
    },
    {
      title: '自转一圈要 6.39 天',
      analogy: '在冥王星上，睡一觉醒来，一天还没过完呢。',
    },
  ],
  parentGuide: [
    '你看冥王星上的「爱心」，你觉得它是怎么形成的？',
    '从冥王星看太阳只有一个小亮点，你觉得那里会有白天吗？',
    '如果让你在冥王星上过一年，你会想带什么去？',
  ],
  uncertaintyNotes: [
    '展台里的冥王星是程序化生成的想象的样子：配色参考了新视野号探测器拍的照片，但「爱心」等细节没有真实还原。',
    '展台里的冥王星模型比真实冥王星大了很多很多，是为了能放进屏幕里。',
  ],
  sources: [
    {
      label: 'NASA Planetary Fact Sheet — Pluto',
      url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/plutofact.html',
      accessedOn: '2026-10-11',
    },
  ],
  editorial: {
    editedBy: '星球博物馆项目组',
    reviewedBy: '星球博物馆项目组',
    reviewedOn: '2026-10-11',
  },
  data: {
    diameterKm: 2376.6,
    meanDistanceFromSunKm: 5_906_000_000,
    hostDistanceKm: null,
    orbitalPeriodDays: 90560,
    rotationPeriodHours: 153.3,
  },
} satisfies BodyContent;
