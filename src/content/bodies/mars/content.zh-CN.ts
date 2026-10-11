import type { BodyContent } from '../../types';

/** 火星展台中文内容（SPEC §4.3）。 */
export const marsContent = {
  name: { zh: '火星', original: 'Mars' },
  narration: {
    sentences: [
      '火星是一颗红红的星球，像一颗放了很久的铁锈色弹珠，在太阳系里慢慢滚。',
      '它的一天和地球几乎一样长，机器人小车已经好几次去火星散步，也许有一天，我们也会去做客。',
    ],
    pronunciation: {
      火星: 'huǒ xīng',
      铁锈: 'tiě xiù',
      奥林帕斯: 'ào lín pà sī',
    },
  },
  facts: [
    {
      title: '直径约 6,779 千米',
      analogy: '火星比地球小一圈，像地球的弟弟，站在旁边矮了小半个头。',
    },
    {
      title: '离太阳约 2.28 亿千米',
      analogy: '如果太阳是家里的台灯，地球坐在书桌前，火星已经坐到了客厅沙发上。',
    },
    {
      title: '一天约 24.6 小时',
      analogy: '火星的一天和地球一样长，你在火星上幼儿园，放学时间也差不多。',
    },
    {
      title: '绕太阳一圈要 687 天',
      analogy: '火星的一年快有两个地球年那么长，要等很久才能过一次生日。',
    },
    {
      title: '奥林帕斯山约为珠峰的 2.5 倍高',
      analogy: '那座山太宽太高了，站在山脚下，山顶会跑到云朵外面去。',
    },
  ],
  parentGuide: [
    '你觉得火星为什么这么红？可以和孩子一起猜猜「铁锈色」的秘密。',
    '如果有一天去火星做客，你想带上什么？为什么会带它？',
    '机器人小车已经在火星上散步了，你想让它替你看看哪里？',
  ],
  uncertaintyNotes: [
    '「人类有一天会搬到火星住」目前还只是一个美好的梦想，什么时候实现还没有人知道。',
    '展台里的火星模型比真实火星小了很多很多，是为了能放进屏幕里。',
    '贴图是艺术家根据 NASA 探测器照片绘制的简化版，真正的火星表面还要崎岖得多。',
  ],
  sources: [
    {
      label: 'NASA Planetary Fact Sheet — Mars',
      url: 'https://nssdc.gsfc.nasa.gov/planetary/factsheet/marsfact.html',
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
    diameterKm: 6779,
    meanDistanceFromSunKm: 227_900_000,
    hostDistanceKm: null,
    orbitalPeriodDays: 687,
    rotationPeriodHours: 24.62,
  },
} satisfies BodyContent;
