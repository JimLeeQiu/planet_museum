import type { SandboxBody } from './types';

/**
 * 18 个天体的沙盘描述符，顺序 = 索引顺序 = 沙盘距日排列顺序（SPEC §2.3 名单）。
 * 半径与轨道间距为艺术化压缩值；科学数据在展台内容中另行给出。
 */
const BODIES: readonly SandboxBody[] = [
  { id: 'sun', kind: 'star', nameZh: '太阳', nameEn: 'Sun', orbitRadius: 0, bodyRadius: 2.2, color: '#ffcc55', initialAngle: 0 },
  { id: 'mercury', kind: 'planet', nameZh: '水星', nameEn: 'Mercury', orbitRadius: 4.6, bodyRadius: 0.32, color: '#9c8e82', initialAngle: 0.6 },
  { id: 'venus', kind: 'planet', nameZh: '金星', nameEn: 'Venus', orbitRadius: 6.9, bodyRadius: 0.5, color: '#e8c47c', initialAngle: 2.4 },
  { id: 'earth', kind: 'planet', nameZh: '地球', nameEn: 'Earth', orbitRadius: 9.2, bodyRadius: 0.53, color: '#4f7ec4', initialAngle: 4.2 },
  { id: 'moon', kind: 'moon', nameZh: '月球', nameEn: 'Moon', orbitRadius: 1.3, bodyRadius: 0.18, color: '#b8b8b8', initialAngle: 1.1, hostBody: 'earth' },
  { id: 'mars', kind: 'planet', nameZh: '火星', nameEn: 'Mars', orbitRadius: 11.5, bodyRadius: 0.4, color: '#c1613b', initialAngle: 5.6 },
  { id: 'jupiter', kind: 'planet', nameZh: '木星', nameEn: 'Jupiter', orbitRadius: 15.1, bodyRadius: 1.35, color: '#d8b48a', initialAngle: 0.2 },
  { id: 'europa', kind: 'moon', nameZh: '木卫二（欧罗巴）', nameEn: 'Europa', orbitRadius: 1.9, bodyRadius: 0.24, color: '#d9cfc0', initialAngle: 2.2, hostBody: 'jupiter' },
  { id: 'io', kind: 'moon', nameZh: '木卫一（伊奥）', nameEn: 'Io', orbitRadius: 2.5, bodyRadius: 0.26, color: '#e8d44f', initialAngle: 4.9, hostBody: 'jupiter' },
  { id: 'saturn', kind: 'planet', nameZh: '土星', nameEn: 'Saturn', orbitRadius: 19.5, bodyRadius: 1.15, color: '#e0c489', initialAngle: 3.1, hasRings: true },
  { id: 'titan', kind: 'moon', nameZh: '土卫六（泰坦）', nameEn: 'Titan', orbitRadius: 1.9, bodyRadius: 0.27, color: '#d29a3e', initialAngle: 5.3, hostBody: 'saturn' },
  { id: 'uranus', kind: 'planet', nameZh: '天王星', nameEn: 'Uranus', orbitRadius: 23.2, bodyRadius: 0.85, color: '#9fd8d8', initialAngle: 1.8 },
  { id: 'neptune', kind: 'planet', nameZh: '海王星', nameEn: 'Neptune', orbitRadius: 26.6, bodyRadius: 0.82, color: '#5a7fd6', initialAngle: 4.4 },
  { id: 'pluto', kind: 'dwarf-planet', nameZh: '冥王星', nameEn: 'Pluto', orbitRadius: 29.8, bodyRadius: 0.3, color: '#c9b9a6', initialAngle: 2.9 },
  { id: 'ceres', kind: 'dwarf-planet', nameZh: '谷神星', nameEn: 'Ceres', orbitRadius: 32.4, bodyRadius: 0.22, color: '#8a8a8a', initialAngle: 0.9 },
  { id: 'vesta', kind: 'asteroid', nameZh: '灶神星', nameEn: 'Vesta', orbitRadius: 34.2, bodyRadius: 0.19, color: '#a99f8d', initialAngle: 3.8 },
  { id: 'bennu', kind: 'asteroid', nameZh: '贝努', nameEn: 'Bennu', orbitRadius: 36.0, bodyRadius: 0.16, color: '#6f6a60', initialAngle: 5.9 },
  {
    id: 'halley',
    kind: 'comet',
    nameZh: '哈雷彗星',
    nameEn: "Halley's Comet",
    orbitRadius: 0,
    bodyRadius: 0,
    color: '#bcd8ff',
    initialAngle: 0,
    orbitLineOnly: true,
    orbitLine: { rx: 39, ry: 13.5, tiltX: 0.42, tiltZ: -0.18, color: '#8fb8e8' },
  },
];

export const SANDBOX_BODIES: readonly SandboxBody[] = BODIES;

export function getBodyById(id: string): SandboxBody | undefined {
  return BODIES.find((body) => body.id === id);
}

/** 最外圈实体轨道半径，用于推算公转角速度（外圈约 90 秒一圈） */
export const OUTERMOST_ORBIT_RADIUS = 36;
/** 外圈公转周期（秒） */
export const OUTERMOST_ORBIT_PERIOD_SECONDS = 90;
