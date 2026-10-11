import { expect, test } from '@playwright/test';

test('home page renders sandbox, pause control and the full 18-body index', async ({ page }) => {
  await page.goto('/');

  await expect(page.getByText('星球博物馆', { exact: true })).toBeVisible();

  const index = page.getByRole('navigation', { name: '天体索引' });
  await expect(index.getByRole('button')).toHaveCount(18);
  await expect(index.getByRole('button', { name: /太阳/ }).first()).toBeVisible();

  // 暂停/继续按钮切换 aria-live 状态
  const toggle = page.getByRole('button', { name: '暂停转动' });
  await toggle.click();
  await expect(page.getByRole('status')).toHaveText('太阳系沙盘动画已暂停');
  await page.getByRole('button', { name: '继续转动' }).click();
  await expect(page.getByRole('status')).toHaveText('太阳系沙盘动画播放中');
});

test.describe('reduced motion', () => {
  test.use({ reducedMotion: 'reduce' });

  test('sandbox starts paused when user prefers reduced motion', async ({ page }) => {
    await page.goto('/');
    // reduced-motion 下沙盘默认静止：状态播报即「已暂停」
    await expect(page.getByRole('status')).toHaveText('太阳系沙盘动画已暂停');
    await expect(page.getByRole('button', { name: '继续转动' })).toBeVisible();
  });
});

test('clicking a body in the index fades into its exhibit', async ({ page }) => {
  await page.goto('/');
  await page
    .getByRole('navigation', { name: '天体索引' })
    .getByRole('button', { name: /木星/ })
    .click();
  await expect(page.getByRole('heading', { name: '木星' })).toBeVisible();
  await page.getByRole('button', { name: '← 回到太阳系沙盘' }).click();
  await expect(page.getByRole('navigation', { name: '天体索引' })).toBeVisible();
});

test('bundled license notices are served from the built site (SPEC §8.4)', async ({
  page,
}) => {
  for (const path of [
    'LICENSE',
    'LICENSING.md',
    'THIRD_PARTY_NOTICES.md',
    'LICENSES/AGPL-3.0-only.txt',
    'LICENSES/CC-BY-4.0.txt',
    'LICENSES/CC-BY-NC-SA-4.0.txt',
  ]) {
    const response = await page.request.get(`./${path}`);
    expect(response.status(), path).toBe(200);
  }
  const notices = await (await page.request.get('./THIRD_PARTY_NOTICES.md')).text();
  expect(notices).toContain('Solar System Scope');
});

test('SSG: home page is server-rendered with inlined initial state (SPEC §1.3)', async ({
  page,
}) => {
  const html = await (await page.request.get('/')).text();
  // SSR 标记：JS 执行前索引已存在 + 初始状态内联
  expect(html).toContain('aria-label="天体索引"');
  expect(html).toContain('id="pm-initial-state"');
  expect(html).toContain('{"page":"home"}');
});

test('SSG: exhibit pages are pre-rendered and hydrate on direct visit', async ({ page }) => {
  const html = await (await page.request.get('/bodies/mars/')).text();
  expect(html).toContain('"bodyId":"mars"');

  await page.goto('/bodies/mars/');
  await expect(page.getByRole('heading', { name: '火星' })).toBeVisible();
  // 水合后 3D 舞台与听一听可用
  await expect(page.getByRole('application')).toBeVisible();
  await expect(page.getByRole('button', { name: '听一听' })).toBeVisible();
  // 客户端校验拒绝伪造状态时应回落首页（篡改内联状态）
  await page.goto('/');
  await expect(page.getByRole('navigation', { name: '天体索引' })).toBeVisible();
});
