import { describe, expect, it } from 'vitest';
import { SANDBOX_BODIES } from '../../content/bodies/sandbox';
import { angularSpeed } from './createSandboxScene';

describe('createSandboxScene 公转计算（太阳不可见 bug 回归）', () => {
  it('太阳（orbitRadius=0）角速度为 0 且位置计算不产生 NaN', () => {
    const sun = SANDBOX_BODIES.find((body) => body.id === 'sun');
    expect(sun).toBeDefined();
    expect(angularSpeed(sun!)).toBe(0);

    // 模拟 tick 中的位置公式：NaN 坐标会让 three.js 丢弃整个网格
    const angle = sun!.initialAngle + 100 * angularSpeed(sun!);
    const x = Math.cos(angle) * sun!.orbitRadius;
    const z = Math.sin(angle) * sun!.orbitRadius;
    expect(Number.isNaN(x) || Number.isNaN(z)).toBe(false);
    expect(x).toBe(0);
    expect(z).toBe(0);
  });

  it('其余绕天天体角速度为有限正数', () => {
    for (const body of SANDBOX_BODIES) {
      if (body.id === 'sun' || body.orbitLineOnly) continue;
      const speed = angularSpeed(body);
      expect(Number.isFinite(speed), body.id).toBe(true);
      expect(speed).toBeGreaterThan(0);
    }
  });
});
