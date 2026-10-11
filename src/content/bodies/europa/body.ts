import type { AssetProvenance, RuntimeBody } from '../../types';
import { europaContent } from './content.zh-CN';
import raw from './provenance.json';
import audioUrl from './audio/narration.zh-CN.mp3?url';
import review from './audio/narration.zh-CN.review.json';

const europaProvenance = raw as AssetProvenance[];

/** 配音未合成/未听审：显式 pending-review（SPEC §6.4），UI 显示「介绍准备中」。 */
export const europa: RuntimeBody = {
  id: 'europa',
  kind: 'moon',
  fallbackColor: '#d9cfc0',
  textureUrl: null,
  narrationAudioUrl: audioUrl,
  narrationPlan:
    review.humanReviewStatus === 'approved'
      ? { status: 'ready', humanReviewStatus: 'approved' }
      : { status: 'pending-review', gate: { id: 'final-narration' } },
  presentation: {
    hasRings: false,
    emissive: false,
    procedural: {
      seed: 421,
      palette: ['#e9e4da', '#cbb9a2', '#9a6a48'],
      roughness: 0.25,
      craters: false,
    },
  },
  content: europaContent,
  provenance: europaProvenance,
};
