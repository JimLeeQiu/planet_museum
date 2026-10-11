import type { Route } from '../App';
import { SANDBOX_BODIES } from '../content/bodies/sandbox';

/** SPEC §1.3：内联初始状态必须经客户端校验后才采用 */
export function validateInitialState(value: unknown): Route | null {
  if (typeof value !== 'object' || value === null) return null;
  const state = value as Record<string, unknown>;
  if (state.page === 'home') return { page: 'home' };
  if (
    state.page === 'exhibit' &&
    typeof state.bodyId === 'string' &&
    SANDBOX_BODIES.some((body) => body.id === state.bodyId)
  ) {
    return { page: 'exhibit', bodyId: state.bodyId };
  }
  return null;
}
