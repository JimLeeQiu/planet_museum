import { existsSync } from 'node:fs';
import { copyFile, mkdir, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig, type Plugin } from 'vitest/config';
import react from '@vitejs/plugin-react';

/**
 * 构建期 bundled notices 插件（SPEC §8.4）：
 * 把 LICENSE / LICENSING.md / THIRD_PARTY_NOTICES.md / LICENSES/*.txt 打进 dist/。
 */
function bundledNotices(): Plugin {
  const root = dirname(fileURLToPath(import.meta.url));
  const topLevelNotices = ['LICENSE', 'LICENSING.md', 'THIRD_PARTY_NOTICES.md'];

  return {
    name: 'planet-museum:bundled-notices',
    // 只在客户端构建生效（SSR 构建的 outDir 是 .ssr-dist）
    apply: (config) => !config.build?.ssr,
    async closeBundle() {
      const dist = join(root, 'dist');
      const licensesDir = join(root, 'LICENSES');
      for (const notice of topLevelNotices) {
        if (!existsSync(join(root, notice))) {
          throw new Error(`构建缺少通告文件：${notice}（先运行 npm run generate:credits）`);
        }
        await copyFile(join(root, notice), join(dist, notice));
      }
      const distLicenses = join(dist, 'LICENSES');
      await mkdir(distLicenses, { recursive: true });
      for (const file of await readdir(licensesDir)) {
        if (file.endsWith('.txt')) {
          await copyFile(join(licensesDir, file), join(distLicenses, file));
        }
      }
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [react(), bundledNotices()],
  test: {
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    css: false,
    exclude: ['e2e/**', 'node_modules/**', 'dist/**'],
  },
});
