import type { BodyContent } from '../../types';

/** 哈雷彗星展台中文内容（SPEC §4.3）。 */
export const halleyContent = {
  name: { zh: '哈雷彗星', original: 'Halley' },
  narration: {
    sentences: [
      '哈雷彗星是一颗会拖着长尾巴的小星星，大约每七十六年才回到太阳身边看我们一次。',
      '上一次它来是 1986 年，下一次要等 2061 年——那时候，你也长成大人的大人啦。',
    ],
    pronunciation: {
      哈雷彗星: 'hā léi huì xīng',
      尾巴: 'wěi ba',
    },
  },
  facts: [
    {
      title: '彗核直径约 11 千米',
      analogy: '彗核像一颗大土豆，只比一座小山包大一丢丢。',
    },
    {
      title: '离太阳平均约 26.7 亿千米',
      analogy: '它大部分时间住在很远很远的「郊外」，比所有行星都远。',
    },
    {
      title: '绕太阳一圈约 75 年',
      analogy: '它转一圈的时间里，小宝宝可以长成一位老爷爷。',
    },
    {
      title: '自转一圈约 2 天',
      analogy: '它的一颗「一天」比我们的两天还长一点。',
    },
  ],
  parentGuide: [
    '76 年才回来一次，你觉得它在外面旅行的时候，会看见什么呢？',
    '如果你能给彗星留一张字条，等它 2061 年回来时看，你想写点什么？',
    '彗星靠近太阳时会长出尾巴，你觉得尾巴是什么做的？',
  ],
  uncertaintyNotes: [
    '展台里的哈雷彗星模型是程序化生成的想象的样子：真实的彗核是不规则的双瓣结构，而且平时离太阳远，根本不长彗尾。',
    '彗星只有靠近太阳时才受热长出长长的彗尾，飞远之后就缩回成一颗灰灰的小土豆。',
    '模型比真实彗核大了很多很多，是为了能放进屏幕里；沙盘里它只画轨道线，不摆模型。',
    '自转一周的 52.1 小时是探测器的测量值，科学家说这个数字还不太确定。',
  ],
  sources: [
    {
      label: 'NASA Planetary Fact Sheet — Comets',
      url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/cometfact.html',
      accessedOn: '2026-10-11',
    },
  ],
  editorial: {
    editedBy: '星球博物馆项目组',
    reviewedBy: '星球博物馆项目组',
    reviewedOn: '2026-10-11',
  },
  data: {
    diameterKm: 11,
    meanDistanceFromSunKm: 2_668_000_000,
    hostDistanceKm: null,
    orbitalPeriodDays: 27507,
    rotationPeriodHours: 52.1,
  },
} satisfies BodyContent;
