import { describe, expect, it } from 'vitest';
import { getBodyById, SANDBOX_BODIES } from './sandbox';

const EXPECTED_ORDER = [
  'sun',
  'mercury',
  'venus',
  'earth',
  'moon',
  'mars',
  'jupiter',
  'europa',
  'io',
  'saturn',
  'titan',
  'uranus',
  'neptune',
  'pluto',
  'ceres',
  'vesta',
  'bennu',
  'halley',
];

describe('sandbox body roster', () => {
  it('contains exactly the 18 bodies from SPEC §2.3 in order', () => {
    expect(SANDBOX_BODIES.map((b) => b.id)).toEqual(EXPECTED_ORDER);
  });

  it('has unique ids', () => {
    const ids = SANDBOX_BODIES.map((b) => b.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('gives Saturn the only rings', () => {
    const ringed = SANDBOX_BODIES.filter((b) => b.hasRings);
    expect(ringed.map((b) => b.id)).toEqual(['saturn']);
  });

  it('draws Halley as orbit line only, with no solid body', () => {
    const halley = SANDBOX_BODIES.find((b) => b.id === 'halley');
    expect(halley?.orbitLineOnly).toBe(true);
    expect(halley?.bodyRadius).toBe(0);
    expect(halley?.orbitLine).toBeDefined();
  });

  it('anchors every moon to a host that appears earlier in the list', () => {
    for (const body of SANDBOX_BODIES) {
      if (!body.hostBody) continue;
      const hostIndex = EXPECTED_ORDER.indexOf(body.hostBody);
      const moonIndex = EXPECTED_ORDER.indexOf(body.id);
      expect(hostIndex).toBeGreaterThanOrEqual(0);
      expect(hostIndex).toBeLessThan(moonIndex);
    }
  });

  it('resolves bodies by id', () => {
    expect(getBodyById('earth')?.nameZh).toBe('地球');
    expect(getBodyById('nope')).toBeUndefined();
  });
});
