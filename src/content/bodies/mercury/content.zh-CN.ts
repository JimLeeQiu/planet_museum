import type { BodyContent } from '../../types';

/** 水星展台中文内容（SPEC §4.3）。 */
export const mercuryContent = {
  name: { zh: '水星', original: 'Mercury' },
  narration: {
    sentences: [
      '水星是离太阳最近的小不点行星，跑得最快，88 天就绕太阳一圈。',
      '它白天热得像火炉，晚上冷得像冰窖，因为没有大气层给它盖被子。',
    ],
    pronunciation: {
      水星: 'shuǐ xīng',
      大气层: 'dà qì céng',
    },
  },
  facts: [
    {
      title: '直径约 4,879 千米',
      analogy: '水星只有地球的三分之一大，像个小小的兄弟。',
    },
    {
      title: '离太阳约 5,800 万千米',
      analogy: '如果太阳是教室门口的灯，水星就坐在第一排。',
    },
    {
      title: '一年只有 88 天',
      analogy: '你在水星上过生日，一年很快就又来了。',
    },
    {
      title: '白天 430°C，晚上 -180°C',
      analogy: '中午烤面包，半夜冻冰棍，一天经历「冰火两重天」。',
    },
  ],
  parentGuide: [
    '水星为什么叫「水」星？其实它上面没有水，可以和孩子猜猜名字的来历。',
    '如果一年只有 88 天，你觉得会有什么不一样？',
  ],
  uncertaintyNotes: [
    '展台里的水星模型比真实水星大了很多很多，是为了能放进屏幕里。',
    '贴图是艺术家根据 NASA 探测器照片绘制的简化版。',
  ],
  sources: [
    {
      label: 'NASA Planetary Fact Sheet — Mercury',
      url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/mercuryfact.html',
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
    diameterKm: 4879,
    meanDistanceFromSunKm: 57_900_000,
    hostDistanceKm: null,
    orbitalPeriodDays: 88,
    rotationPeriodHours: 1407.6,
  },
} satisfies BodyContent;
