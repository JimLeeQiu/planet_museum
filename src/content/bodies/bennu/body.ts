import type { RuntimeBody } from '../../types';
import { bennuContent } from './content.zh-CN';
import raw from './provenance.json';
import type { AssetProvenance } from '../../types';
import audioUrl from './audio/narration.zh-CN.mp3?url';
import review from './audio/narration.zh-CN.review.json';

const bennuProvenance = raw as AssetProvenance[];

/** 配音未合成/未听审：显式 pending-review（SPEC §6.4），UI 显示「介绍准备中」。 */
export const bennu: RuntimeBody = {
  id: 'bennu',
  kind: 'asteroid',
  fallbackColor: '#6f6a60',
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
      seed: 1999,
      palette: ['#6f6a60', '#57534a', '#8a8578'],
      roughness: 0.6,
      craters: true,
    },
  },
  content: bennuContent,
  provenance: bennuProvenance,
};
