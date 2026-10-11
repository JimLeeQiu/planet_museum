import textureUrl from './assets/texture-2k.jpg?url';
import type { RuntimeBody } from '../../types';
import { mercuryContent } from './content.zh-CN';
import raw from './provenance.json';
import type { AssetProvenance } from '../../types';
import audioUrl from './audio/narration.zh-CN.mp3?url';
import review from './audio/narration.zh-CN.review.json';

const mercuryProvenance = raw as AssetProvenance[];

/** 配音未合成/未听审：显式 pending-review（SPEC §6.4），UI 显示「介绍准备中」。 */
export const mercury: RuntimeBody = {
  id: 'mercury',
  kind: 'planet',
  fallbackColor: '#9c8e82',
  textureUrl,
  narrationAudioUrl: audioUrl,
  narrationPlan:
    review.humanReviewStatus === 'approved'
      ? { status: 'ready', humanReviewStatus: 'approved' }
      : { status: 'pending-review', gate: { id: 'final-narration' } },
  presentation: { hasRings: false, emissive: false, procedural: null },
  content: mercuryContent,
  provenance: mercuryProvenance,
};
