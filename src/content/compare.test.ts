import { describe, expect, it } from 'vitest';
import { ALL_BODIES } from './registry';
import { DUAL_VIEW_MIN_RATIO, EARTH_DIAMETER_KM, planComparison } from './compare';

describe('planComparison（SPEC §3.2 真实比例对比）', () => {
  it('地球参照常量为 12,742 km', () => {
    expect(EARTH_DIAMETER_KM).toBe(12742);
  });

  it('大于等于阈值的天体用真实比例双球', () => {
    expect(planComparison(12742).mode).toBe('dual'); // 地球自身
    expect(planComparison(4879).mode).toBe('dual'); // 水星 0.38
    expect(planComparison(3474.8).mode).toBe('dual'); // 月球 0.27
    expect(planComparison(2376.6).mode).toBe('dual'); // 冥王星 0.19
    expect(planComparison(1392700).mode).toBe('dual'); // 太阳 109 倍
  });

  it('小天体用「N 个排成一行」类比，N 为真实换算', () => {
    const ceres = planComparison(939.4);
    expect(ceres.mode).toBe('row');
    expect(ceres.count).toBe(Math.round(12742 / 939.4)); // ≈14

    const bennu = planComparison(0.49);
    expect(bennu.mode).toBe('row');
    expect(bennu.count).toBe(Math.round(12742 / 0.49)); // ≈26,004
  });

  it('18 个天体都有明确的对比方案', () => {
    for (const body of ALL_BODIES) {
      if (body.id === 'earth') continue;
      const plan = planComparison(body.content.data.diameterKm);
      expect(plan.mode === 'dual' || plan.mode === 'row').toBe(true);
      expect(plan.ratio).toBeGreaterThan(0);
    }
  });

  it('阈值边界：刚好低于阈值走 row 模式', () => {
    const boundary = planComparison(EARTH_DIAMETER_KM * DUAL_VIEW_MIN_RATIO - 1);
    expect(boundary.mode).toBe('row');
  });
});
