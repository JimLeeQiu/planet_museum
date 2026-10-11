import type { RuntimeBody } from '../../types';
import { plutoContent } from './content.zh-CN';
import raw from './provenance.json';
import type { AssetProvenance } from '../../types';
import audioUrl from './audio/narration.zh-CN.mp3?url';
import review from './audio/narration.zh-CN.review.json';

const plutoProvenance = raw as AssetProvenance[];

/** 配音未合成/未听审：显式 pending-review（SPEC §6.4），UI 显示「介绍准备中」。 */
export const pluto: RuntimeBody = {
  id: 'pluto',
  kind: 'dwarf-planet',
  fallbackColor: '#c9b9a6',
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
      seed: 1516,
      palette: ['#c9b9a6', '#a08878', '#e8ddd0'],
      roughness: 0.35,
      craters: true,
    },
  },
  content: plutoContent,
  provenance: plutoProvenance,
};
