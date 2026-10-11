import { earth } from './bodies/earth/body';

/** 地球直径（千米），来自地球展台科学数据，真实比例对比的参照物 */
export const EARTH_DIAMETER_KM = earth.content.data.diameterKm;

/** 小于该比例的天体双球并排会看不清，改用「N 个排成一行」类比（SPEC §3.2） */
export const DUAL_VIEW_MIN_RATIO = 0.15;

export type CompareMode = 'dual' | 'row';

export interface ComparisonPlan {
  mode: CompareMode;
  /** row 模式：约多少个该天体排成一行 = 地球直径 */
  count: number;
  /** 天体直径 / 地球直径 */
  ratio: number;
}

export function planComparison(bodyDiameterKm: number): ComparisonPlan {
  const ratio = bodyDiameterKm / EARTH_DIAMETER_KM;
  if (ratio >= DUAL_VIEW_MIN_RATIO) {
    return { mode: 'dual', count: 1, ratio };
  }
  return { mode: 'row', count: Math.max(2, Math.round(1 / ratio)), ratio };
}
