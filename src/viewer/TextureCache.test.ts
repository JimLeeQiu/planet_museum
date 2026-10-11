import * as THREE from 'three';
import { describe, expect, it, vi } from 'vitest';
import { TextureCache } from './TextureCache';

function createFakeLoader() {
  const textures = new Map<string, THREE.Texture>();
  const disposed = new Set<string>();
  const loader = {
    loadAsync: vi.fn((url: string) => {
      const texture = new THREE.Texture();
      texture.addEventListener('dispose', () => disposed.add(url));
      textures.set(url, texture);
      return Promise.resolve(texture);
    }),
  };
  return {
    loader: loader as unknown as THREE.TextureLoader,
    textures,
    isDisposed: (url: string) => disposed.has(url),
  };
}

describe('TextureCache (LRU, SPEC §7 最近 3 个展台)', () => {
  it('keeps at most maxEntries textures', async () => {
    const { loader } = createFakeLoader();
    const cache = new TextureCache(loader, 3);
    await cache.get('a.jpg');
    await cache.get('b.jpg');
    await cache.get('c.jpg');
    await cache.get('d.jpg');
    expect(cache.size).toBe(3);
  });

  it('disposes the least recently used texture on eviction', async () => {
    const { loader, isDisposed } = createFakeLoader();
    const cache = new TextureCache(loader, 2);
    await cache.get('a.jpg');
    await cache.get('b.jpg');
    await cache.get('c.jpg');
    expect(isDisposed('a.jpg')).toBe(true);
    expect(isDisposed('b.jpg')).toBe(false);
  });

  it('re-getting a url refreshes its recency', async () => {
    const { loader, isDisposed } = createFakeLoader();
    const cache = new TextureCache(loader, 2);
    await cache.get('a.jpg');
    await cache.get('b.jpg');
    await cache.get('a.jpg'); // a 变最新
    await cache.get('c.jpg'); // 应淘汰 b
    expect(isDisposed('a.jpg')).toBe(false);
    expect(isDisposed('b.jpg')).toBe(true);
  });

  it('reuses the same promise for concurrent gets (no duplicate decode)', async () => {
    const { loader } = createFakeLoader();
    const cache = new TextureCache(loader, 3);
    const first = cache.get('a.jpg');
    const second = cache.get('a.jpg');
    expect(first).toBe(second);
    expect(loader.loadAsync).toHaveBeenCalledTimes(1);
  });
});
