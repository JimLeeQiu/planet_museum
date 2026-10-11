import type { AssetProvenance, RuntimeBody } from '../../types';
import { vestaContent } from './content.zh-CN';
import raw from './provenance.json';
import audioUrl from './audio/narration.zh-CN.mp3?url';
import review from './audio/narration.zh-CN.review.json';

const vestaProvenance = raw as AssetProvenance[];

/** 配音未合成/未听审：显式 pending-review（SPEC §6.4），UI 显示「介绍准备中」。 */
export const vesta: RuntimeBody = {
  id: 'vesta',
  kind: 'asteroid',
  fallbackColor: '#a99f8d',
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
      seed: 2405,
      palette: ['#a99f8d', '#8a8070', '#6f6a60'],
      roughness: 0.5,
      craters: true,
    },
  },
  content: vestaContent,
  provenance: vestaProvenance,
};
