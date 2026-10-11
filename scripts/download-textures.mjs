/**
 * 构建期素材脚本（SPEC §5.3）：从 Solar System Scope（CC BY 4.0）下载 2k 贴图。
 * 用法：node scripts/download-textures.mjs
 * 输出：各天体 assets/texture-2k.jpg + stdout 打印 sha256/bytes（登记进 provenance.json）。
 */
import { createHash } from 'node:crypto';
import { mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const siteRoot = join(dirname(fileURLToPath(import.meta.url)), '..');

/** bodyId → SSS 文件名（不含扩展名）。
 * 注：pluto / europa / io / titan 的 SSS 2k 贴图 2026-10 已下架（HTTP 404），
 * 与 vesta / bennu / halley 一起改走程序化生成（src/viewer/procedural/createSmallBody.ts）。 */
const SSS_TEXTURES = {
  sun: '2k_sun',
  mercury: '2k_mercury',
  venus: '2k_venus_surface',
  moon: '2k_moon',
  mars: '2k_mars',
  jupiter: '2k_jupiter',
  saturn: '2k_saturn',
  uranus: '2k_uranus',
  neptune: '2k_neptune',
  ceres: '2k_ceres_fictional',
};

const results = {};

for (const [bodyId, fileName] of Object.entries(SSS_TEXTURES)) {
  const url = `https://www.solarsystemscope.com/textures/download/${fileName}.jpg`;
  const dir = join(siteRoot, 'src/content/bodies', bodyId, 'assets');
  mkdirSync(dir, { recursive: true });
  const outPath = join(dir, 'texture-2k.jpg');
  try {
    const response = await fetch(url, {
      headers: { 'User-Agent': 'planet-museum-asset-pipeline/0.1' },
    });
    if (!response.ok) {
      results[bodyId] = { error: `HTTP ${response.status}` };
      console.error(`${bodyId}: ${url} → HTTP ${response.status}`);
      continue;
    }
    const buffer = Buffer.from(await response.arrayBuffer());
    writeFileSync(outPath, buffer);
    const sha256 = createHash('sha256').update(buffer).digest('hex');
    results[bodyId] = { url, bytes: buffer.length, sha256 };
    console.log(`${bodyId}: ${(buffer.length / 1024).toFixed(0)} KB ${sha256.slice(0, 12)}…`);
  } catch (error) {
    results[bodyId] = { error: String(error) };
    console.error(`${bodyId}: ${error}`);
  }
}

console.log(JSON.stringify(results, null, 2));
