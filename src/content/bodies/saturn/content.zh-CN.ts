import type { BodyContent } from '../../types';

/** 土星展台中文内容（SPEC §4.3）。 */
export const saturnContent = {
  name: { zh: '土星', original: 'Saturn' },
  narration: {
    sentences: [
      '土星是一颗戴着美丽光环的大行星，光环由数不清的亮晶晶的冰块和小石头组成。',
      '土星特别轻，比水还要轻，放进一个足够大的浴缸里，它真的会浮起来哦。',
    ],
    pronunciation: {
      土星: 'tǔ xīng',
      光环: 'guāng huán',
    },
  },
  facts: [
    {
      title: '直径约 116,460 千米',
      analogy: '差不多九个地球排成一排，才有土星这么宽。',
    },
    {
      title: '光环宽几十万千米，厚度可能只有几十米',
      analogy: '像一张超级大的薄纸，比宝宝的手掌还要薄得多。',
    },
    {
      title: '平均密度比水还小',
      analogy: '如果有一个宇宙里最大的浴缸，土星能在水里浮起来。',
    },
    {
      title: '一年约 29 个地球年',
      analogy: '在土星上刚过完一岁，地球上已经过了 29 个生日啦。',
    },
    {
      title: '1610 年，伽利略就用望远镜看到了它',
      analogy: '很久以前，一位老爷爷用望远镜第一次偷偷发现了这个戴光环的星球。',
    },
  ],
  parentGuide: [
    '你觉得土星的光环像什么？饼干圈、呼啦圈，还是别的东西？',
    '土星比水还轻，如果它掉进水里会怎么样呢？和孩子一起来想象。',
    '如果一年有 29 个地球年那么长，你最想用它来做一件什么事？',
  ],
  uncertaintyNotes: [
    '土星环的真实厚度科学家还没有完全确定，可能只有几十米，档案中特别标注「必须写明」。',
    '展台里的土星模型比真实土星小了很多很多，是为了能放进屏幕里。',
    '贴图是艺术家根据 NASA 探测器照片绘制的简化版，真正的土星和光环还要复杂美丽得多。',
  ],
  sources: [
    {
      label: 'NASA Planetary Fact Sheet — Saturn',
      url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/saturnfact.html',
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
    diameterKm: 116460,
    meanDistanceFromSunKm: 1_432_000_000,
    hostDistanceKm: null,
    orbitalPeriodDays: 10759.2,
    rotationPeriodHours: 10.66,
  },
} satisfies BodyContent;
