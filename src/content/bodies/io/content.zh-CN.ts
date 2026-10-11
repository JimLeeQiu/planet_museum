import type { BodyContent } from '../../types';

/** 木卫一（伊奥）展台中文内容（SPEC §4.3）。 */
export const ioContent = {
  name: { zh: '木卫一（伊奥）', original: 'Io' },
  narration: {
    sentences: [
      '伊奥是木星身边的小卫星，也是全太阳系火山最多的地方，表面撒满了黄黄的硫磺，像一块刚出炉的披萨。',
      '木星用它大大的引力手把伊奥轻轻揉来揉去，让伊奥的肚子里暖暖的，四百多座火山就一座接一座醒来啦。',
    ],
    pronunciation: {
      伊奥: 'yī ào',
      硫磺: 'liú huáng',
      揉: 'róu',
    },
  },
  facts: [
    {
      title: '直径约 3,643 千米',
      analogy: '伊奥和我们的月亮差不多大，抱在手里就像一个圆圆的大瑜伽球。',
    },
    {
      title: '离木星约 42.2 万千米',
      analogy: '如果木星是一个大操场，伊奥就像绕着操场外面跑圈的小朋友。',
    },
    {
      title: '绕木星一圈只要约 1.77 天',
      analogy: '还不到两天，伊奥就绕着木星跑完一整圈，比你从星期一等到星期三还快。',
    },
    {
      title: '转一圈要约 42.46 小时',
      analogy: '伊奥总是把同一张小脸朝向木星，像小宝宝一直看着自己的妈妈。',
    },
  ],
  parentGuide: [
    '伊奥看起来像一块披萨，你觉得上面黄黄的东西会是什么味道？',
    '如果有一座火山在你家门口醒来，你想送给它什么礼物？',
    '伊奥一直看着木星，就像一直看着妈妈，你想对这位「木星的宝宝」说些什么？',
  ],
  uncertaintyNotes: [
    '展台里的伊奥是程序想象出来的样子：颜色参考了探测器拍的照片，但表面的火山和斑纹并不是一座一座真实还原的。',
    '模型比真实伊奥大了很多很多，是为了能放进屏幕里。',
  ],
  sources: [
    {
      label: 'NASA Planetary Fact Sheet — Jupiter（卫星参数表）',
      url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/jupiterfact.html',
      accessedOn: '2026-10-11',
    },
  ],
  editorial: {
    editedBy: '星球博物馆项目组',
    reviewedBy: '星球博物馆项目组',
    reviewedOn: '2026-10-11',
  },
  data: {
    diameterKm: 3643.2,
    meanDistanceFromSunKm: null,
    hostDistanceKm: 421700,
    orbitalPeriodDays: 1.77,
    rotationPeriodHours: 42.46,
  },
} satisfies BodyContent;
