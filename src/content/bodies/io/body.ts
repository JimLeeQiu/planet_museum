import type { RuntimeBody } from '../../types';
import { ioContent } from './content.zh-CN';
import raw from './provenance.json';
import type { AssetProvenance } from '../../types';
import audioUrl from './audio/narration.zh-CN.mp3?url';
import review from './audio/narration.zh-CN.review.json';

const ioProvenance = raw as AssetProvenance[];

/** 配音未合成/未听审：显式 pending-review（SPEC §6.4），UI 显示「介绍准备中」。 */
export const io: RuntimeBody = {
  id: 'io',
  kind: 'moon',
  fallbackColor: '#e8d44f',
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
      seed: 1061,
      palette: ['#e8d44f', '#c8862a', '#7a4a20'],
      roughness: 0.3,
      craters: false,
    },
  },
  content: ioContent,
  provenance: ioProvenance,
};
