import type { RuntimeBody } from '../../types';
import { halleyContent } from './content.zh-CN';
import raw from './provenance.json';
import type { AssetProvenance } from '../../types';
import audioUrl from './audio/narration.zh-CN.mp3?url';
import review from './audio/narration.zh-CN.review.json';

const halleyProvenance = raw as AssetProvenance[];

/** 配音未合成/未听审：显式 pending-review（SPEC §6.4），UI 显示「介绍准备中」。 */
export const halley: RuntimeBody = {
  id: 'halley',
  kind: 'comet',
  fallbackColor: '#8fb8e8',
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
      seed: 1758,
      palette: ['#8a8578', '#6f6a60', '#4a463e'],
      roughness: 0.55,
      craters: true,
    },
  },
  content: halleyContent,
  provenance: halleyProvenance,
};
