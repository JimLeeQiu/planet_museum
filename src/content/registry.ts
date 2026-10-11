import type { RuntimeBody } from './types';
import { earth } from './bodies/earth/body';
import { mercury } from './bodies/mercury/body';
import { venus } from './bodies/venus/body';
import { sun } from './bodies/sun/body';
import { moon } from './bodies/moon/body';
import { mars } from './bodies/mars/body';
import { jupiter } from './bodies/jupiter/body';
import { saturn } from './bodies/saturn/body';
import { uranus } from './bodies/uranus/body';
import { neptune } from './bodies/neptune/body';
import { pluto } from './bodies/pluto/body';
import { ceres } from './bodies/ceres/body';
import { vesta } from './bodies/vesta/body';
import { bennu } from './bodies/bennu/body';
import { halley } from './bodies/halley/body';
import { europa } from './bodies/europa/body';
import { io } from './bodies/io/body';
import { titan } from './bodies/titan/body';

/** 全部 18 个展台的运行时天体（SPEC §2.3 名单）。 */
export const ALL_BODIES: readonly RuntimeBody[] = [
  sun,
  mercury,
  venus,
  earth,
  moon,
  mars,
  jupiter,
  europa,
  io,
  saturn,
  titan,
  uranus,
  neptune,
  pluto,
  ceres,
  vesta,
  bennu,
  halley,
];

const BY_ID: ReadonlyMap<string, RuntimeBody> = new Map(
  ALL_BODIES.map((body) => [body.id, body]),
);

export function getRuntimeBody(id: string): RuntimeBody | null {
  return BY_ID.get(id) ?? null;
}
