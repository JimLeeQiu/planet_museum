import { describe, expect, it } from 'vitest';
import { earth } from './body';

describe('earth runtime body', () => {
  it('has exactly two narration sentences (SPEC §4.3)', () => {
    expect(earth.content.narration.sentences).toHaveLength(2);
  });

  it('has 3–5 analogy facts and 2–3 parent-guide questions', () => {
    expect(earth.content.facts.length).toBeGreaterThanOrEqual(3);
    expect(earth.content.facts.length).toBeLessThanOrEqual(5);
    expect(earth.content.parentGuide.length).toBeGreaterThanOrEqual(2);
    expect(earth.content.parentGuide.length).toBeLessThanOrEqual(3);
  });

  it('declares uncertaintyNotes and fully populated sources', () => {
    expect(earth.content.uncertaintyNotes.length).toBeGreaterThan(0);
    for (const source of earth.content.sources) {
      expect(source.url).toMatch(/^https?:\/\//);
      expect(source.accessedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    }
  });

  it('has editorial review records', () => {
    expect(earth.content.editorial.reviewedBy).not.toBe('');
    expect(earth.content.editorial.reviewedOn).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });

  it('registers provenance for every runtime asset (SPEC §4.4)', () => {
    expect(earth.textureUrl).not.toBeNull();
    expect(earth.narrationAudioUrl).not.toBeNull();
    const ids = earth.provenance.map((p) => p.assetId).sort();
    expect(ids).toEqual(['narration.zh-CN', 'texture']);
    for (const record of earth.provenance) {
      expect(record.attribution.length).toBeGreaterThan(0);
      expect(record.sha256).toMatch(/^[0-9a-f]{64}$/);
      expect(record.bytes).toBeGreaterThan(0);
    }
  });

  it('human-approved narration is ready with review record (SPEC §6.4)', () => {
    expect(earth.narrationAudioUrl).not.toBeNull();
    expect(earth.narrationPlan.status).toBe('ready');
    expect(earth.narrationPlan.humanReviewStatus).toBe('approved');
  });
});
