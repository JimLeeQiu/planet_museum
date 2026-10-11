import type { BodyContent } from '../../types';

/** 太阳展台中文内容（SPEC §4.3）。 */
export const sunContent = {
  name: { zh: '太阳', original: 'Sun' },
  narration: {
    sentences: [
      '太阳是太阳系的老大，一颗又亮又暖的大火球，它一站不动，八大行星就围着它慢慢转圈。',
      '太阳超级大，差不多能装下一百万个地球，还占了整个太阳系百分之九十九点八的重量——不过记住哦，太阳很亮很亮，我们要爱护眼睛，可不能用它直直地看。',
    ],
    pronunciation: {
      太阳: 'tài yáng',
      行星: 'xíng xīng',
    },
  },
  facts: [
    {
      title: '直径约 139 万千米（约为地球的 109 倍）',
      analogy: '如果把太阳放进地球的位置，水星、金星、地球、火星全都会被它吞进肚子里。',
    },
    {
      title: '表面温度约 5,500°C',
      analogy: '家里烤箱最烫也只有两百多度，太阳表面比烤箱热二十几倍，所以远远晒着就暖暖的了。',
    },
    {
      title: '阳光到达地球约需 8 分钟',
      analogy: '太阳的光跑得比任何东西都快，也要跑 8 分钟才到我们身边——你现在晒到的，是 8 分钟前的太阳抱抱。',
    },
    {
      title: '占太阳系总质量的 99.8% 以上',
      analogy: '如果把太阳系做成一个大披萨，太阳就是整张披萨，所有行星加起来只是掉在桌上的一小粒渣。',
    },
  ],
  parentGuide: [
    '太阳为什么会发光发热？可以和孩子聊聊「火球」和「灯」有什么不一样。',
    '太阳晒在身上暖洋洋的，你觉得太阳对小花、小动物有什么帮助？',
    '为什么不能直接用眼睛看太阳？一起想想怎么保护我们的眼睛。',
  ],
  uncertaintyNotes: [
    '太阳是太阳系的中心，自己不绕太阳公转，所以 orbitalPeriodDays 填 0；meanDistanceFromSunKm 也填 0，表示它就是「起点」。',
    '太阳的自转有点特别：赤道转一圈约 25 天，两极要 30 多天，是我们填入的 609.1 小时（约 25.4 天）的由来。',
    '展台里的太阳模型比真实太阳小了很多很多，是为了能放进屏幕里。',
    '贴图是艺术家根据 NASA 探测器照片绘制的简化版。',
  ],
  sources: [
    {
      label: 'NASA Planetary Fact Sheet — Sun',
      url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/sunfact.html',
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
    diameterKm: 1392700,
    meanDistanceFromSunKm: 0,
    hostDistanceKm: null,
    orbitalPeriodDays: 0,
    rotationPeriodHours: 609.1,
  },
} satisfies BodyContent;
