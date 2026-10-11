import { beforeAll, describe, expect, it, vi } from 'vitest';
import { createSmallBody } from './createSmallBody';

// jsdom 无 canvas 2D 实现（缺 node-canvas），桩一个最小上下文
beforeAll(() => {
  vi.spyOn(HTMLCanvasElement.prototype, 'getContext').mockImplementation(
    ((type: string) => {
      if (type !== '2d') return null;
      return {
        createImageData: (w: number, h: number) => ({
          data: new Uint8ClampedArray(w * h * 4),
          width: w,
          height: h,
        }),
        putImageData: () => {},
      } as unknown as CanvasRenderingContext2D;
    }) as typeof HTMLCanvasElement.prototype.getContext,
  );
});

describe('createSmallBody（SPEC §5.5 程序化生成）', () => {
  const descriptor = {
    seed: 421,
    palette: ['#e9e4da', '#cbb9a2', '#9a6a48'] as [string, string, string],
    roughness: 0.5,
    craters: true,
  };

  it('同一 seed + 参数生成同一几何（可复现）', () => {
    const a = createSmallBody(descriptor);
    const b = createSmallBody(descriptor);
    const posA = (a.geometry.attributes.position.array as Float32Array).slice(0, 64);
    const posB = (b.geometry.attributes.position.array as Float32Array).slice(0, 64);
    expect(Array.from(posA)).toEqual(Array.from(posB));
  });

  it('不同 seed 生成不同表面', () => {
    const a = createSmallBody(descriptor);
    const b = createSmallBody({ ...descriptor, seed: 999 });
    const posA = (a.geometry.attributes.position.array as Float32Array).slice(0, 64);
    const posB = (b.geometry.attributes.position.array as Float32Array).slice(0, 64);
    expect(Array.from(posA)).not.toEqual(Array.from(posB));
  });

  it('输出 1024×512 贴图与已位移几何', () => {
    const { geometry, texture } = createSmallBody(descriptor);
    expect(texture.image.width).toBe(1024);
    expect(texture.image.height).toBe(512);
    const position = geometry.attributes.position;
    let displaced = false;
    for (let i = 0; i < position.count; i += 1) {
      const length = Math.hypot(position.getX(i), position.getY(i), position.getZ(i));
      if (Math.abs(length - 1.6) > 1e-6) {
        displaced = true;
        break;
      }
    }
    expect(displaced).toBe(true);
  });
});
