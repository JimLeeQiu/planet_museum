import type { BodyContent } from '../../types';

/** 土卫六（泰坦）展台中文内容（SPEC §4.3）。 */
export const titanContent = {
  name: { zh: '土卫六（泰坦）', original: 'Titan' },
  narration: {
    sentences: [
      '泰坦是土星最大的卫星，穿着厚厚的橙色大衣，是全世界唯一有大气的卫星。',
      '它上面有甲烷做成的小河和湖泊，还会下甲烷雨，惠更斯号探测器 2005 年到过那里。',
    ],
    pronunciation: {
      泰坦: 'tài tǎn',
      甲烷: 'jiǎ wán',
      湖泊: 'hú pō',
      惠更斯号: 'huì gēng sī hào',
    },
  },
  facts: [
    {
      title: '直径约 5,150 千米，比水星还大',
      analogy: '泰坦虽然是卫星，却穿着大一号的橙色外套，个子比「行星」水星还要高一点点。',
    },
    {
      title: '离土星约 122 万千米',
      analogy: '泰坦像牵着爸爸妈妈的手那样，稳稳地跟着土星一起走。',
    },
    {
      title: '绕土星一圈约 16 天',
      analogy: '你在泰坦上一个月（绕土星一圈），比地球的一个月短多啦。',
    },
    {
      title: '转一圈要 383 小时，永远用同一面朝着土星',
      analogy: '就像小宝宝一直仰着头看妈妈，泰坦一直用同一张脸看着土星。',
    },
  ],
  parentGuide: [
    '泰坦的大衣是橙色的，如果孩子也有一件这样的大衣，你想在上面画什么图案？',
    '泰坦上下的雨不是水，而是甲烷——如果天上下的不是雨，你希望下什么？',
    '惠更斯号探测器在泰坦上降落过，如果你也能坐飞船去，你最想带回什么「纪念品」？',
  ],
  uncertaintyNotes: [
    '泰坦表面的样子谁也看不清楚：展台里的模型是程序化生成的想象的样子，橙色雾球参考卡西尼号探测器照片的配色，真正的表面被浓雾盖住了。',
    '泰坦的湖泊和河流是液态甲烷，不是水，科学家们还在不断研究它。',
    '展台里的泰坦模型比真实泰坦大了很多很多，是为了能放进屏幕里。',
  ],
  sources: [
    {
      label: 'NASA Planetary Fact Sheet — Saturn（卫星参数表）',
      url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.html',
      accessedOn: '2026-10-11',
    },
  ],
  editorial: {
    editedBy: '星球博物馆项目组',
    reviewedBy: '星球博物馆项目组',
    reviewedOn: '2026-10-11',
  },
  data: {
    diameterKm: 5149.5,
    meanDistanceFromSunKm: null,
    hostDistanceKm: 1221870,
    orbitalPeriodDays: 15.95,
    rotationPeriodHours: 382.7,
  },
} satisfies BodyContent;
