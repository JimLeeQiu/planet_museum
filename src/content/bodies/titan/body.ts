import type { RuntimeBody } from '../../types';
import { titanContent } from './content.zh-CN';
import raw from './provenance.json';
import type { AssetProvenance } from '../../types';
import audioUrl from './audio/narration.zh-CN.mp3?url';
import review from './audio/narration.zh-CN.review.json';

const titanProvenance = raw as AssetProvenance[];

/** 配音未合成/未听审：显式 pending-review（SPEC §6.4），UI 显示「介绍准备中」。 */
export const titan: RuntimeBody = {
  id: 'titan',
  kind: 'moon',
  fallbackColor: '#d29a3e',
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
      seed: 1661,
      palette: ['#d29a3e', '#b07828', '#8a5a20'],
      roughness: 0.15,
      craters: false,
    },
  },
  content: titanContent,
  provenance: titanProvenance,
};
