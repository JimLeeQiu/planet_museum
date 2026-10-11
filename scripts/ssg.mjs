/**
 * 构建期 SSG 收尾（SPEC §1.3）：客户端构建产出 dist/index.html 模板后，
 * 用 SSR 渲染的页面标记替换空 #root，并内联初始状态；
 * 每个天体再生成 dist/bodies/<id>/index.html（子路径页面需重写相对资源路径）。
 */
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const siteRoot = join(dirname(fileURLToPath(import.meta.url)), '..');
const distDir = join(siteRoot, 'dist');
const ssrEntry = join(siteRoot, '.ssr-dist/entry.js');

const { renderApp } = await import(pathToFileURL(ssrEntry).href);
const { SANDBOX_BODIES } = await import(
  pathToFileURL(join(siteRoot, 'src/content/bodies/sandbox.ts')).href
);

const template = readFileSync(join(distDir, 'index.html'), 'utf8');
if (!template.includes('<div id="root"></div>')) {
  throw new Error('dist/index.html 缺少 <div id="root"></div> 占位');
}

/** JSON 内联进 <script> 时转义，防 </script> 注入 */
function inlineJson(value) {
  return JSON.stringify(value).replace(/</g, '\\u003c');
}

function buildPage(route) {
  const markup = renderApp(route);
  const stateScript = `<script type="application/json" id="pm-initial-state">${inlineJson(route)}</script>`;
  return template.replace(
    '<div id="root"></div>',
    `<div id="root">${markup}</div>\n    ${stateScript}`,
  );
}

// 首页
writeFileSync(join(distDir, 'index.html'), buildPage({ page: 'home' }));
console.log('dist/index.html');

// 18 个展台直达页（T5：不做单天体直达链接，但静态页可被直接访问/分享）
for (const body of SANDBOX_BODIES) {
  const route = { page: 'exhibit', bodyId: body.id };
  // base './' 在子路径下需上溯两级指向 dist/assets/
  const html = buildPage(route).replaceAll('./assets/', '../../assets/');
  const outDir = join(distDir, 'bodies', body.id);
  mkdirSync(outDir, { recursive: true });
  writeFileSync(join(outDir, 'index.html'), html);
  console.log(`dist/bodies/${body.id}/index.html`);
}
