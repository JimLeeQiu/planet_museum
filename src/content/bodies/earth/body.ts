import textureUrl from './assets/texture-2k.jpg?url';
import type { RuntimeBody } from '../../types';
import { earthContent } from './content.zh-CN';
import { earthProvenance } from './provenance';
import audioUrl from './audio/narration.zh-CN.mp3?url';
import review from './audio/narration.zh-CN.review.json';

/** 配音未合成/未听审：显式 pending-review（SPEC §6.4），UI 显示「介绍准备中」。 */
export const earth: RuntimeBody = {
  id: 'earth',
  kind: 'planet',
  fallbackColor: '#4f7ec4',
  textureUrl,
  narrationAudioUrl: audioUrl,
  narrationPlan:
    review.humanReviewStatus === 'approved'
      ? { status: 'ready', humanReviewStatus: 'approved' }
      : { status: 'pending-review', gate: { id: 'final-narration' } },
  presentation: { hasRings: false, emissive: false, procedural: null },
  content: earthContent,
  provenance: earthProvenance,
};
