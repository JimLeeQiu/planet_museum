# 星球博物馆（Planet Museum）部署说明

亲子向太阳系 3D 合集网站。纯静态产物（`dist/`），**无后端、无数据库、无环境变量**，可部署到任意静态托管平台，不锁定厂商。

## 一、设备支持

部署一次，全平台访问：手机 / 平板 / PC 浏览器打开同一网址即可。

- 响应式布局：沙盘与展台自适应屏幕尺寸
- 触摸交互：单指拖动旋转、双指捏合缩放（触屏），鼠标拖动/滚轮（桌面）
- 无障碍：`prefers-reduced-motion`、键盘方向键旋转、aria-live 状态播报
- 硬性要求：浏览器需支持 WebGL（近十年主流设备均支持）

## 二、本地构建

要求 Node ≥ 22（开发用 Node 24 验证）。

```bash
cd site
npm install
npm run build        # 双构建（客户端 + SSR）+ SSG + 许可打包，产物在 dist/
```

构建序列等价于 SPEC §8.5：`validate:content` → `tsc -b` → `generate:credits`（prebuild 自动）→ 客户端构建 → SSR 构建 → SSG 静态页生成。任何一环失败构建即失败。

## 三、本地预览与局域网体验

```bash
npm run preview                 # 本机访问 http://localhost:4173
npm run preview -- --host       # 监听所有网卡
```

`--host` 模式下，手机/平板连同一 Wi-Fi，浏览器访问 `http://<电脑局域网IP>:4173` 即可真机体验（适合触屏手势实测）。

## 四、部署到托管平台

`dist/` 是完整的可部署目录（`index.html` + `assets/` + `bodies/<id>/index.html` + 许可通告）。`base: './'` 相对路径，**任意子路径托管均可**。

| 平台 | 操作 |
|---|---|
| **Cloudflare Pages** | 控制台「直接上传资产」拖入 `dist/`，或连接 Git 仓库：构建命令 `npm run build`，输出目录 `site/dist` |
| **GitHub Pages** | 把 `dist/` 内容推到 `gh-pages` 分支（或用 Actions 构建后发布）；项目页地址自带子路径，无需额外配置 |
| **阿里云 OSS** | 创建 Bucket → 开启「静态网站托管」→ 上传 `dist/`，首页 `index.html`，404 页 `index.html`；配 CDN 国内访问更快 |
| **Netlify / Vercel** | 拖拽 `dist/` 到部署页即可（zero-config） |

### SPA 回退说明

站内转场是状态切换，不依赖 URL；但展台直达页（`/bodies/<id>/`）是真实生成的静态文件，刷新/直达均正常。若托管平台提供 SPA 404 回退，统一回退到 `/index.html` 亦可（SSG 已预渲染两种页面）。

## 五、部署后核对清单

1. 首页：沙盘太阳居中发亮、点击空白暂停/继续、下方 18 天体索引
2. 展台：任选一个 → 3D 模型可拖动旋转 → 「听一听」可播放（18 个全部解锁）
3. 真实比例：非地球展台点「和地球比比看」（土星的环、谷神星的一排球）
4. 直达链接：`/bodies/mars/` 可直接打开
5. 合规：`/THIRD_PARTY_NOTICES.md`、`/LICENSING.md`、`/LICENSES/` 均可访问

## 六、更新内容后重新部署

新增/修改天体内容后，按序执行并重新上传 `dist/`：

```bash
npm run validate:content   # 发布门禁
npm run build              # 内含 tsc / credits / 双构建 / SSG
```

配音重合成另见 `scripts/synthesize-narration.mjs`（需阿里云凭证环境变量，不入仓）。

## 七、许可摘要

- 代码：AGPL-3.0-only；原创文字/配音/程序化资产：CC BY-NC-SA 4.0
- 第三方素材（Solar System Scope 等）单独署名，见 `THIRD_PARTY_NOTICES.md`
- 因 AGPL 通过网络提供服务需开放源码：仓库源码即对应源码，保持公开即可
