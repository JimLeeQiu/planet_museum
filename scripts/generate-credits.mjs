/**
 * 从 provenance 记录机械生成 credits（SPEC §8.3）。不得手工编辑产物。
 * 用法：npm run generate:credits
 * 输出：
 *   - THIRD_PARTY_NOTICES.md（仓库根，随构建打进 dist/）
 *   - src/generated/credits.json（站内 credits 页数据源）
 * 校验（任一失败则非零退出）：
 *   必填字段齐全、attribution 非空、许可在允许清单内、禁用来源（planetpixelemporium、NASA/ESA logo）
 */
import { createHash } from 'node:crypto';
import { mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const bodiesDir = join(siteRoot, 'src/content/bodies');
const outMdPath = join(siteRoot, 'THIRD_PARTY_NOTICES.md');
const outJsonPath = join(siteRoot, 'src/generated/credits.json');

const ALLOWED_LICENSES = new Set([
  'CC-BY-4.0',
  'CC-BY-SA-4.0',
  'CC-BY-NC-SA-4.0',
  'CC0-1.0',
  'PDM-1.0',
  'Apache-2.0',
  'MIT',
]);

const BANNED_PATTERNS = [/planetpixelemporium/i, /\bnasa\s*logo\b/i, /\besa\s*logo\b/i];

const REQUIRED_FIELDS = [
  'assetId',
  'spdxLicenseId',
  'origin',
  'sha256',
  'bytes',
  'attribution',
  'redistributable',
  'evidencePath',
];

const errors = [];
const assets = [];

for (const entry of readdirSync(bodiesDir, { withFileTypes: true })) {
  if (!entry.isDirectory()) continue;
  const provenancePath = join(bodiesDir, entry.name, 'provenance.json');
  let records;
  try {
    records = JSON.parse(readFileSync(provenancePath, 'utf8'));
  } catch {
    errors.push(`${entry.name}: 缺少或无法解析 provenance.json`);
    continue;
  }
  for (const record of records) {
    const label = `${entry.name}/${record.assetId ?? '?'}`;
    for (const field of REQUIRED_FIELDS) {
      if (record[field] === undefined || record[field] === null || record[field] === '') {
        errors.push(`${label}: 缺字段 ${field}`);
      }
    }
    if (record.attribution && typeof record.attribution === 'string') {
      for (const pattern of BANNED_PATTERNS) {
        if (pattern.test(record.attribution)) {
          errors.push(`${label}: 署名包含禁用来源/logo（${pattern}）`);
        }
      }
    }
    if (record.spdxLicenseId && !ALLOWED_LICENSES.has(record.spdxLicenseId)) {
      errors.push(`${label}: 许可 ${record.spdxLicenseId} 不在允许清单内`);
    }
    if (record.origin === 'third-party' && !record.sourceUrl) {
      errors.push(`${label}: 第三方素材必须登记 sourceUrl`);
    }
    if (record.origin === 'third-party' && !record.accessedOn) {
      errors.push(`${label}: 第三方素材必须登记 accessedOn`);
    }
    assets.push({ body: entry.name, ...record });
  }
}

if (errors.length > 0) {
  console.error('provenance 校验失败：');
  for (const error of errors) console.error(`  - ${error}`);
  process.exit(1);
}

// 按署名来源分层（SPEC §8.3：NASA/SVS、USGS、Solar System Scope、任务团队……）
const byAttribution = new Map();
for (const asset of assets) {
  const key = asset.attribution;
  if (!byAttribution.has(key)) byAttribution.set(key, []);
  byAttribution.get(key).push(asset);
}

const lines = [
  '<!-- 本文件由 `npm run generate:credits` 机械生成，请勿手工编辑。 -->',
  '',
  '# 第三方素材署名（THIRD PARTY NOTICES）',
  '',
  '本站运行时资产（纹理、音频、程序化参数）逐条 provenance 记录见各天体目录的 `provenance.json`；本清单由这些记录机械生成。',
  '',
];

for (const [attribution, group] of byAttribution) {
  lines.push(`## ${attribution}`, '');
  for (const asset of group) {
    const license = asset.spdxLicenseId;
    const origin =
      asset.origin === 'third-party'
        ? `来源：${asset.sourceUrl}（${asset.accessedOn} 访问）`
        : asset.origin === 'generated'
          ? `项目生成：${asset.generatedBy?.tool ?? '未知工具'} v${asset.generatedBy?.version ?? '?'}`
          : '衍生作品';
    lines.push(`- \`${asset.body}/${asset.assetId}\` — ${license}。${origin}。`);
  }
  lines.push('');
}

writeFileSync(outMdPath, `${lines.join('\n')}\n`);

mkdirSync(dirname(outJsonPath), { recursive: true });
const json = {
  generatedAt: new Date().toISOString(),
  generatorHash: createHash('sha256')
    .update(readFileSync(fileURLToPath(import.meta.url)))
    .digest('hex'),
  assets,
};
writeFileSync(outJsonPath, `${JSON.stringify(json, null, 2)}\n`);

console.log(`credits 生成完成：${assets.length} 条资产记录，${byAttribution.size} 个署名来源`);
