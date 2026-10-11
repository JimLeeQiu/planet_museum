# 许可分层说明（LICENSING）

本项目采用与参照仓库（prehistoric-animal-museum）一致的分层许可机制（SPEC §1.4）：

| 层 | 许可 | 范围 | 全文 |
|---|---|---|---|
| 代码 | **AGPL-3.0-only** | `src/`、`scripts/`、`e2e/` 等全部源码 | `LICENSES/AGPL-3.0-only.txt` |
| 原创内容 | **CC BY-NC-SA 4.0** | 中文/英文文案、配音、程序化生成贴图与参数、背景图等 | `LICENSES/CC-BY-NC-SA-4.0.txt` |
| 第三方素材 | **按各自许可单独署名** | Solar System Scope 纹理（CC BY 4.0）等 | `LICENSES/CC-BY-4.0.txt` 等 + `THIRD_PARTY_NOTICES.md` |
| 品牌（「星球博物馆 / Planet Museum」wordmark） | **保留所有权利** | 禁止混淆性使用；允许改名再品牌化 fork | — |

要点：

- 每条运行时资产（纹理、音频、程序化参数）的 provenance 记录见
  `src/content/bodies/<id>/provenance.json`；`THIRD_PARTY_NOTICES.md` 由
  `npm run generate:credits` **机械生成**，不得手工编辑。
- CC BY-NC-SA 4.0 允许纳入公有领域与 CC BY 素材并署名再发布，故 NASA（公有领域）
  与 Solar System Scope（CC BY 4.0）素材可嵌入本项目内容层，署名义务保留在
  credits 页与 `THIRD_PARTY_NOTICES.md`。
- 署名文案中不使用 NASA / ESA 等机构 logo（SPEC §5.1）。
- 使用 AGPL 代码意味着：若通过网络提供服务（Web 即属此类），须向使用者提供
  相应源码。`dist/` 内的通告文件（本文件、`LICENSE`、许可全文与
  `THIRD_PARTY_NOTICES.md`）由构建期插件自动打入（SPEC §8.4）。
