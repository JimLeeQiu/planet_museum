/**
 * 构建期内容校验（SPEC §8.1/§8.2），作为 `npm run validate:content` 运行。
 * 覆盖 published 门禁的核心可机器检查项：必填字段、provenance 完整性、
 * 署名/许可红线、贴图分辨率红线（仅 earth/jupiter/saturn 可 4k）、配音状态机一致性。
 */
import { describe, expect, it } from 'vitest';
import { SANDBOX_BODIES } from './bodies/sandbox';
import { ALL_BODIES } from './registry';
import type { RuntimeBody } from './types';

const ALLOWED_4K = new Set(['earth', 'jupiter', 'saturn']);
const URL_PATTERN = /^https?:\/\//;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;
const SHA_PATTERN = /^[0-9a-f]{64}$/;

function checkBody(body: RuntimeBody): string[] {
  const problems: string[] = [];
  const { content, presentation, provenance, narrationPlan, textureUrl, narrationAudioUrl } = body;

  // §8.2-1 中文内容齐全
  if (!content.name.zh || !content.name.original) problems.push('name 缺失');
  if (content.narration.sentences.length !== 2) {
    problems.push(`narration 必须恰好两句，实际 ${content.narration.sentences.length}`);
  }
  if (content.facts.length < 3 || content.facts.length > 5) {
    problems.push(`facts 必须 3–5 条，实际 ${content.facts.length}`);
  }
  if (content.parentGuide.length < 2 || content.parentGuide.length > 3) {
    problems.push(`parentGuide 必须 2–3 条，实际 ${content.parentGuide.length}`);
  }
  if (!Array.isArray(content.uncertaintyNotes)) problems.push('uncertaintyNotes 字段必填');
  for (const source of content.sources) {
    if (!URL_PATTERN.test(source.url)) problems.push(`source url 非法: ${source.url}`);
    if (!DATE_PATTERN.test(source.accessedOn)) problems.push(`source accessedOn 非法: ${source.label}`);
  }
  if (!content.editorial.reviewedBy || !DATE_PATTERN.test(content.editorial.reviewedOn)) {
    problems.push('editorial 审核记录不完整');
  }
  const { data } = content;
  if (!(data.meanDistanceFromSunKm !== null || data.hostDistanceKm !== null)) {
    problems.push('data 必须填 meanDistanceFromSunKm 或 hostDistanceKm 之一');
  }
  if (!(data.diameterKm > 0) || !(data.rotationPeriodHours > 0)) {
    problems.push('data 直径/自转周期必须为正数');
  }
  if (body.id !== 'sun' && !(data.orbitalPeriodDays > 0)) {
    problems.push('data 公转周期必须为正数（太阳除外）');
  }

  // §8.2-2 provenance 至少一条，且每个运行时资产有记录
  if (provenance.length < 1) problems.push('provenance 至少一条');
  if (textureUrl !== null && !provenance.some((p) => p.assetId === 'texture')) {
    problems.push('有贴图但缺 texture provenance');
  }
  if (presentation.procedural !== null && !provenance.some((p) => p.assetId === 'procedural-model')) {
    problems.push('程序化天体但缺 procedural-model provenance');
  }
  if (textureUrl !== null && presentation.procedural !== null) {
    problems.push('textureUrl 与 procedural 不能同时存在');
  }
  for (const record of provenance) {
    if (!record.attribution.trim()) problems.push(`provenance ${record.assetId} 署名文案为空`);
    if (!SHA_PATTERN.test(record.sha256)) problems.push(`provenance ${record.assetId} sha256 非法`);
    if (!(record.bytes > 0)) problems.push(`provenance ${record.assetId} bytes 非法`);
  }

  // §8.2-5 贴图分辨率红线（4k 仅 earth/jupiter/saturn）
  if (textureUrl !== null && /4k/i.test(textureUrl) && !ALLOWED_4K.has(body.id)) {
    problems.push(`${body.id} 不允许 4k 贴图`);
  }

  // §8.2-4 配音状态机：无音频必须显式 pending-review；ready 必须听审通过
  if (narrationAudioUrl === null && narrationPlan.status !== 'pending-review') {
    problems.push('无音频但 narrationPlan 未声明 pending-review（不得无声冒充 ready）');
  }
  if (narrationPlan.status === 'ready') {
    if (narrationPlan.humanReviewStatus !== 'approved') {
      problems.push('ready 状态必须 humanReviewStatus: approved（人工听审门禁）');
    }
    if (narrationAudioUrl === null) {
      problems.push('ready 状态必须有音频资产');
    }
  }
  if (narrationPlan.status === 'pending-review' && narrationPlan.gate?.id !== 'final-narration') {
    problems.push('pending-review 必须带 final-narration 门禁');
  }

  // §8.2-3 展示红线：全站仅 saturn 有环、仅 sun 自发光
  if (presentation.hasRings && body.id !== 'saturn') problems.push('仅 saturn 可实现环');
  if (presentation.emissive && body.id !== 'sun') problems.push('仅 sun 可自发光');

  return problems;
}

describe('validate:content（SPEC §8.1/§8.2 发布门禁）', () => {
  it('18 个展台全部存在且 id 与沙盘名单一一对应', () => {
    expect(ALL_BODIES).toHaveLength(18);
    const contentIds = ALL_BODIES.map((b) => b.id).sort();
    const sandboxIds = [...SANDBOX_BODIES.map((b) => b.id)].sort();
    expect(contentIds).toEqual(sandboxIds);
  });

  it('每个展台通过全部机器可检门禁', () => {
    const failures = ALL_BODIES.flatMap((body) =>
      checkBody(body).map((problem) => `${body.id}: ${problem}`),
    );
    expect(failures).toEqual([]);
  });

  it('土星环与太阳自发光全站唯一', () => {
    expect(ALL_BODIES.filter((b) => b.presentation.hasRings).map((b) => b.id)).toEqual(['saturn']);
    expect(ALL_BODIES.filter((b) => b.presentation.emissive).map((b) => b.id)).toEqual(['sun']);
  });

  it('程序化天体的「想象的样子」声明齐全（SPEC §4.3 强制）', () => {
    for (const body of ALL_BODIES) {
      if (body.presentation.procedural === null) continue;
      const declared = body.content.uncertaintyNotes.some((note) => note.includes('想象'));
      expect(declared, `${body.id} 缺「想象的样子」声明`).toBe(true);
    }
  });

  it('fictional 贴图（SSS 虚构填充）如实标注（SPEC §5.1）', () => {
    for (const body of ALL_BODIES) {
      const fictionalTexture = body.provenance.some(
        (p) => p.assetId === 'texture' && /fictional/i.test(p.sourceUrl ?? ''),
      );
      if (!fictionalTexture) continue;
      const disclosed = body.content.uncertaintyNotes.some(
        (note) => note.includes('虚构') || note.includes('fictional'),
      );
      expect(disclosed, `${body.id} 的 SSS fictional 贴图未在 uncertaintyNotes 标注`).toBe(true);
    }
  });
});
