# 星球博物馆（Planet Museum）

亲子向太阳系 3D 合集网站。纯静态网站，**无后端、无数据库、无环境变量**。参考的灵感来自于[史前动物博物馆](https://github.com/s010s/prehistoric-animal-museum.git)，纯Vide Coding（Kimi Code），部署在GitHub Pages(http://jimleeqiu.github.io/planet_museum/)

## 目前天体合集

- 太阳
- 水星
- 金星
- 地球
- 月球
- 火星
- 木星
- 木卫二
- 木卫一
- 土星
- 土卫六
- 天王星
- 海王星
- 冥王星
- 谷神星
- 灶神星
- 贝努
- 哈雷彗星

> 部分小行星和矮行星天体由于素材来源问题，展台渲染质量较差

## 本地构建

要求 Node ≥ 22（开发用 Node 24 验证）。

```bash
npm install
npm run build        # 双构建（客户端 + SSR）+ SSG + 许可打包，产物在 dist/
```

## 本地预览与局域网体验

```bash
npm run preview                 # 本机访问 http://localhost:4173
npm run preview -- --host       # 监听所有网卡
```

`--host` 模式下，手机/平板连同一 Wi-Fi，浏览器访问 `http://<电脑局域网IP>:4173` 即可真机体验（适合触屏手势实测）。

## 部署后核对清单

1. 首页：沙盘太阳居中发亮、点击空白暂停/继续、下方 18 天体索引
2. 展台：任选一个 → 3D 模型可拖动旋转 → 「听一听」可播放（18 个全部解锁）
3. 真实比例：非地球展台点「和地球比比看」（土星的环、谷神星的一排球）
4. 直达链接：`/bodies/mars/` 可直接打开
5. 合规：`/THIRD_PARTY_NOTICES.md`、`/LICENSING.md`、`/LICENSES/` 均可访问

## 更新内容后重新部署

新增/修改天体内容后：

```bash
npm run validate:content   # 发布门禁
npm run build              # 内含 tsc / credits / 双构建 / SSG
```

配音重合成另见 `scripts/synthesize-narration.mjs`。

## 七、许可摘要

- 代码：AGPL-3.0-only；原创文字/配音/程序化资产：CC BY-NC-SA 4.0
- 第三方素材（Solar System Scope 等）单独署名，见 `THIRD_PARTY_NOTICES.md`
- 因 AGPL 通过网络提供服务需开放源码：仓库源码即对应源码，保持公开即可
