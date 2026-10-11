import { expect, test } from '@playwright/test';

test('earth exhibit: texture stage, keyboard rotation and narration button', async ({
  page,
}) => {
  await page.goto('/');
  await page
    .getByRole('navigation', { name: '天体索引' })
    .getByRole('button', { name: /地球/ })
    .click();

  // 展台标题与 3D 舞台
  await expect(page.getByRole('heading', { name: '地球' })).toBeVisible();
  const canvas = page.getByRole('application', { name: /地球 3D 模型/ });
  await expect(canvas).toBeVisible();

  // aria-live 播报贴图加载完成
  await expect(page.getByRole('status')).toContainText('已就绪', { timeout: 15_000 });

  // 语音绝不自动播放：初始按钮为「听一听」
  const narration = page.getByRole('button', { name: '听一听' });
  await expect(narration).toBeVisible();

  // 点击播放 → 暂停 → 继续听
  await narration.click();
  await expect(page.getByRole('button', { name: '暂停' })).toBeVisible();
  await page.getByRole('button', { name: '暂停' }).click();
  await expect(page.getByRole('button', { name: '继续听' })).toBeVisible();

  // 键盘方向键旋转不报错
  await canvas.focus();
  await page.keyboard.press('ArrowLeft');
  await page.keyboard.press('ArrowUp');
  await expect(canvas).toBeFocused();

  // 内容区块渲染
  await expect(page.getByRole('heading', { name: '比一比，想一想' })).toBeVisible();
  await expect(page.getByRole('heading', { name: '陪娃一起聊' })).toBeVisible();

  // 回到首页
  await page.getByRole('button', { name: '← 回到太阳系沙盘' }).click();
  await expect(page.getByRole('navigation', { name: '天体索引' })).toBeVisible();
});

test('every body now has a full exhibit (no placeholders left)', async ({ page }) => {
  await page.goto('/');
  await page
    .getByRole('navigation', { name: '天体索引' })
    .getByRole('button', { name: /火星/ })
    .click();
  await expect(page.getByRole('heading', { name: '火星' })).toBeVisible();
  await expect(page.getByRole('application')).toBeVisible();
  await expect(page.getByText('展台正在布置中')).toHaveCount(0);
});

test('credits footer lists asset attributions', async ({ page }) => {
  await page.goto('/');
  await page.getByText('素材署名与许可').click();
  await expect(page.getByText(/Solar System Scope/)).toBeVisible();
});

test('all 18 exhibits render with a 3D stage and narration state', async ({ page }) => {
  test.setTimeout(180_000);
  const bodies = [
    ['太阳', '听一听'],
    ['水星', '听一听'],
    ['金星', '听一听'],
    ['地球', '听一听'],
    ['月球', '听一听'],
    ['火星', '听一听'],
    ['木星', '听一听'],
    ['木卫二（欧罗巴）', '听一听'],
    ['木卫一（伊奥）', '听一听'],
    ['土星', '听一听'],
    ['土卫六（泰坦）', '听一听'],
    ['天王星', '听一听'],
    ['海王星', '听一听'],
    ['冥王星', '听一听'],
    ['谷神星', '听一听'],
    ['灶神星', '听一听'],
    ['贝努', '听一听'],
    ['哈雷彗星', '听一听'],
  ] as const;

  for (const [name, narrationLabel] of bodies) {
    await page.goto('/');
    await page
      .getByRole('navigation', { name: '天体索引' })
      .getByRole('button', { name: new RegExp(name) })
      .click();
    await expect(page.getByRole('heading', { name })).toBeVisible();
    await expect(page.getByRole('application')).toBeVisible();
    await expect(page.getByText(narrationLabel)).toBeVisible();
    await expect(page.getByRole('status')).toContainText('已就绪', { timeout: 15_000 });
  }
});

test('compare with Earth: dual spheres for planets, row analogy for small bodies', async ({
  page,
}) => {
  // 地球自身不提供对比按钮（它就是参照物）
  await page.goto('/');
  await page
    .getByRole('navigation', { name: '天体索引' })
    .getByRole('button', { name: /地球/ })
    .click();
  await expect(page.getByRole('button', { name: '和地球比比看' })).toHaveCount(0);

  // 火星：真实比例双球，切回
  await page.getByRole('button', { name: '← 回到太阳系沙盘' }).click();
  await page
    .getByRole('navigation', { name: '天体索引' })
    .getByRole('button', { name: /火星/ })
    .click();
  const compare = page.getByRole('button', { name: '和地球比比看' });
  await compare.click();
  const caption = page.locator('.compare-caption');
  await expect(caption).toHaveText(/两个球按真实大小摆放/);
  await expect(caption).toHaveText(/左边是火星，右边是地球/);
  // 对比视图同样支持键盘旋转
  await page.getByRole('application').focus();
  await page.keyboard.press('ArrowRight');
  // 切回展台视图
  await page.getByRole('button', { name: '回到展台视图' }).click();
  await expect(page.getByRole('status')).toContainText('已就绪', { timeout: 15_000 });

  // 谷神星：「N 个排成一行」类比
  await page.getByRole('button', { name: '← 回到太阳系沙盘' }).click();
  await page
    .getByRole('navigation', { name: '天体索引' })
    .getByRole('button', { name: /谷神星/ })
    .click();
  await page.getByRole('button', { name: '和地球比比看' }).click();
  await expect(page.locator('.compare-caption')).toHaveText(/约 14 个排成一行/);
});
