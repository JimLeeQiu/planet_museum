export type BodyKind = 'star' | 'planet' | 'moon' | 'dwarf-planet' | 'asteroid' | 'comet';

/**
 * 沙盘天体描述符。
 * 所有半径/距离均为艺术化压缩值（场景单位），压缩比例就写在这里，不进 viewer。
 * 顺序即距日展示顺序（索引与沙盘共用），见 SPEC §2.3。
 */
export interface SandboxBody {
  id: string;
  kind: BodyKind;
  nameZh: string;
  nameEn: string;
  /** 沙盘轨道半径（卫星为绕宿主的小轨道半径） */
  orbitRadius: number;
  /** 沙盘天体半径 */
  bodyRadius: number;
  color: string;
  /** 初始相位角（弧度），避免所有天体排成一线 */
  initialAngle: number;
  /** 卫星的宿主天体 id */
  hostBody?: string;
  /** 仅土星为 true（SPEC §2.2） */
  hasRings?: boolean;
  /** 仅哈雷彗星为 true：沙盘不摆实体，只画扁椭圆轨道线 */
  orbitLineOnly?: boolean;
  /** 轨道线参数（仅 orbitLineOnly 使用） */
  orbitLine?: {
    rx: number;
    ry: number;
    tiltX: number;
    tiltZ: number;
    color: string;
  };
}
