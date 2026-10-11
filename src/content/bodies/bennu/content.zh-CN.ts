import type { BodyContent } from '../../types';

/** 贝努展台中文内容（SPEC §4.3）。 */
export const bennuContent = {
  name: { zh: '贝努', original: 'Bennu' },
  narration: {
    sentences: [
      '贝努是一颗小小的近地小行星，个子只有一幢大楼那么高，表面像一大片碎石沙滩。',
      '一个叫 OSIRIS-REx 的探测器拜访过它，轻轻碰了碰它，还把碎石样品带回了地球。',
    ],
    pronunciation: {
      贝努: 'bèi nǔ',
      碎石: 'suì shí',
      探测器: 'tàn cè qì',
    },
  },
  facts: [
    {
      title: '直径约 490 米',
      analogy: '把贝努竖起来，大概和一幢大楼一样高，比真正的行星小好多好多。',
    },
    {
      title: '离太阳约 1.68 亿千米',
      analogy: '它绕着太阳走的路，离地球很近，算是太阳系的「邻居」。',
    },
    {
      title: '绕太阳一圈约 436 天',
      analogy: '贝努的一岁比我们的长一些，一年多一点才过一次生日。',
    },
    {
      title: '自转一圈约 4.3 小时',
      analogy: '你午睡一小会儿，贝努已经翻了一个又一个跟头。',
    },
  ],
  parentGuide: [
    '贝努的表面像碎石沙滩，你想在这样的「沙滩」上散步吗？会怎样走？',
    '探测器从那么远的地方带回小石子，你觉得科学家为什么要这么做？',
    '如果你可以给贝努起一个外号，你会叫它什么？',
  ],
  uncertaintyNotes: [
    '展台里的贝努模型是程序化生成的想象的样子：真实的贝努是双锥「陀螺」形的乱石堆，并不是一颗圆滚滚的球。',
    '展台里的贝努模型比真实贝努大了很多很多，是为了能放进屏幕里。',
    '模型颜色是参照探测器照片配色的简化版，真实的贝努表面还要粗糙、复杂得多。',
  ],
  sources: [
    {
      label: 'NASA JPL SBDB — 101955 Bennu',
      url: 'https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=101955',
      accessedOn: '2026-10-11',
    },
    {
      label: 'NASA OSIRIS-REx 任务页',
      url: 'https://www.nasa.gov/osiris-rex/',
      accessedOn: '2026-10-11',
    },
  ],
  editorial: {
    editedBy: '星球博物馆项目组',
    reviewedBy: '星球博物馆项目组',
    reviewedOn: '2026-10-11',
  },
  data: {
    diameterKm: 0.49,
    meanDistanceFromSunKm: 168_400_000,
    hostDistanceKm: null,
    orbitalPeriodDays: 436.6,
    rotationPeriodHours: 4.297,
  },
} satisfies BodyContent;
