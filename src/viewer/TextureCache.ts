import * as THREE from 'three';

/**
 * 展台贴图 LRU 缓存（SPEC §7）：离开展台不立即释放，
 * 保留最近 maxEntries 个展台，重复访问不重复下载/解码。
 */
export class TextureCache {
  private readonly entries = new Map<string, Promise<THREE.Texture>>();

  constructor(
    private readonly loader: THREE.TextureLoader,
    private readonly maxEntries = 3,
  ) {}

  get size(): number {
    return this.entries.size;
  }

  get(url: string): Promise<THREE.Texture> {
    const existing = this.entries.get(url);
    if (existing) {
      // LRU：移到最新
      this.entries.delete(url);
      this.entries.set(url, existing);
      return existing;
    }

    const pending = this.loader.loadAsync(url).then((texture) => {
      texture.colorSpace = THREE.SRGBColorSpace;
      return texture;
    });
    this.entries.set(url, pending);

    while (this.entries.size > this.maxEntries) {
      const oldestKey = this.entries.keys().next().value as string;
      const oldest = this.entries.get(oldestKey) as Promise<THREE.Texture>;
      this.entries.delete(oldestKey);
      oldest
        .then((texture) => texture.dispose())
        .catch(() => {
          // 加载失败的条目释放时无需处理
        });
    }

    return pending;
  }
}

/** 全局共享缓存：最近 3 个展台 */
export const exhibitTextureCache = new TextureCache(new THREE.TextureLoader(), 3);
