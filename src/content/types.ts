/** 内容模型类型（SPEC §4.2 / §4.3 / §4.4 / §6.4）。 */

export type BodyKind =
  | 'star'
  | 'planet'
  | 'moon'
  | 'dwarf-planet'
  | 'asteroid'
  | 'comet';

/** 展台中文内容（zh-CN 首发；en 预留，SPEC §10） */
export interface BodyContent {
  name: { zh: string; original: string };
  /** 恰好两句儿童旁白（SPEC §4.3）；元组长度 2 在类型层强制 */
  narration: {
    sentences: [string, string];
    /** 多音字/易错读音注音表 */
    pronunciation: Record<string, string>;
  };
  /** 类比式数据卡片 3–5 条 */
  facts: Array<{ title: string; analogy: string }>;
  /** 给家长的开放式引导问题 2–3 个 */
  parentGuide: [string, ...string[]];
  /** 不确定性/想象成分声明（必填字段，可为空数组） */
  uncertaintyNotes: string[];
  /** 科学来源，每条含 url + accessedOn */
  sources: Array<{ label: string; url: string; accessedOn: string }>;
  editorial: { editedBy: string; reviewedBy: string; reviewedOn: string };
  /** 必填科学数据（SPEC §4.3）；卫星填 hostDistanceKm，其余天体填 meanDistanceFromSunKm，另一项为 null */
  data: {
    diameterKm: number;
    /** 距日平均距离；太阳本身为 0 */
    meanDistanceFromSunKm: number | null;
    /** 卫星距宿主（母星）距离 */
    hostDistanceKm: number | null;
    orbitalPeriodDays: number;
    rotationPeriodHours: number;
  };
}

/** 程序化生成描述符（SPEC §5.5）：无公开全球纹理的天体，seed + 参数保证表面可复现 */
export interface ProceduralDescriptor {
  seed: number;
  /** fBm 反照率调色板：[底色, 斑纹, 暗斑] */
  palette: [string, string, string];
  /** 表面位移强度 0–1（「土豆」程度） */
  roughness: number;
  /** 是否叠加程序陨石坑 */
  craters: boolean;
}

/** 展台展示参数（沙盘压缩比例在 sandbox.ts，与此独立） */
export interface BodyPresentation {
  /** 仅土星为 true */
  hasRings: boolean;
  /** 恒星为 true：无光照自发光材质 */
  emissive: boolean;
  /** 非 null 时运行时程序化生成形状与贴图（textureUrl 应为 null） */
  procedural: ProceduralDescriptor | null;
}

/** 每条运行时资产一条 provenance 记录（SPEC §4.4） */
export interface AssetProvenance {
  /** 运行时资产标识，如 'texture' / 'narration.zh-CN' */
  assetId: string;
  /** SPDX 许可标识，如 'CC-BY-4.0'、'CC-BY-NC-SA-4.0' */
  spdxLicenseId: string;
  /** 来源类型：第三方 / 项目生成 / 衍生 */
  origin: 'third-party' | 'generated' | 'derived';
  sourceUrl: string | null;
  sha256: string;
  bytes: number;
  /** 第三方素材访问日期（YYYY-MM-DD） */
  accessedOn: string | null;
  /** 程序化/生成资产：工具 + 版本 + 参数 JSON + seed（SPEC §4.4） */
  generatedBy?: {
    tool: string;
    version: string;
    parametersJson: string;
    seed: string | null;
  };
  /** 修改记录（转码、重命名等） */
  modifications: string[];
  /** 署名文案（非空） */
  attribution: string;
  redistributable: boolean;
  /** 证据文件路径（调研记录 / 生成脚本） */
  evidencePath: string;
}

/** 配音计划状态机（SPEC §6.4） */
export interface NarrationPlan {
  status: 'ready' | 'pending-review';
  /** pending-review 时必须带最终听审门禁 */
  gate?: { id: 'final-narration' };
  humanReviewStatus?: 'approved';
}

/** 运行时天体包：定义 + 内容 + 资产 URL（展台消费） */
export interface RuntimeBody {
  id: string;
  kind: BodyKind;
  /** 贴图懒加载失败/未配置时的纯色兜底 */
  fallbackColor: string;
  textureUrl: string | null;
  narrationAudioUrl: string | null;
  narrationPlan: NarrationPlan;
  presentation: BodyPresentation;
  content: BodyContent;
  provenance: AssetProvenance[];
}
