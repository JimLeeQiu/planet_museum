import { describe, expect, it } from 'vitest';
import { validateInitialState } from './validateInitialState';

describe('validateInitialState（SPEC §1.3 客户端校验后才采用）', () => {
  it('接受合法的首页与展台状态', () => {
    expect(validateInitialState({ page: 'home' })).toEqual({ page: 'home' });
    expect(validateInitialState({ page: 'exhibit', bodyId: 'mars' })).toEqual({
      page: 'exhibit',
      bodyId: 'mars',
    });
  });

  it('拒绝未知天体 id', () => {
    expect(validateInitialState({ page: 'exhibit', bodyId: 'pluto2' })).toBeNull();
    expect(validateInitialState({ page: 'exhibit' })).toBeNull();
  });

  it('拒绝未知页面与畸形输入', () => {
    expect(validateInitialState({ page: 'admin' })).toBeNull();
    expect(validateInitialState('home')).toBeNull();
    expect(validateInitialState(null)).toBeNull();
    expect(validateInitialState({ page: 'exhibit', bodyId: 42 })).toBeNull();
  });
});
