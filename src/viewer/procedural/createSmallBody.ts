import * as THREE from 'three';
import type { ProceduralDescriptor } from '../../content/types';

/**
 * 程序化小天体生成器（SPEC §5.5）：icosphere + 低频 fBm 位移（「土豆」造型），
 * Canvas 烘焙 1024×512 斑驳反照率贴图（< 1 MB，实际为零网络字节）。
 * 同一 seed + 参数必然生成同一表面（provenance 可复现）。
 */

export interface GeneratedSmallBody {
  geometry: THREE.BufferGeometry;
  texture: THREE.Texture;
}

/** mulberry32：确定性 PRNG */
function createRng(seed: number): () => number {
  let state = seed >>> 0;
  return () => {
    state = (state + 0x6d2b79f5) | 0;
    let t = Math.imul(state ^ (state >>> 15), 1 | state);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** 3D value noise（基于整数格点哈希） */
function makeNoise3D(seed: number): (x: number, y: number, z: number) => number {
  const hash = (x: number, y: number, z: number): number => {
    let h = seed ^ Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(z, 1274126177);
    h = Math.imul(h ^ (h >>> 13), 1103515245);
    return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
  };
  const smooth = (t: number) => t * t * (3 - 2 * t);
  return (x, y, z) => {
    const xi = Math.floor(x);
    const yi = Math.floor(y);
    const zi = Math.floor(z);
    const xf = smooth(x - xi);
    const yf = smooth(y - yi);
    const zf = smooth(z - zi);
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    return lerp(
      lerp(lerp(hash(xi, yi, zi), hash(xi + 1, yi, zi), xf), lerp(hash(xi, yi + 1, zi), hash(xi + 1, yi + 1, zi), xf), yf),
      lerp(lerp(hash(xi, yi, zi + 1), hash(xi + 1, yi, zi + 1), xf), lerp(hash(xi, yi + 1, zi + 1), hash(xi + 1, yi + 1, zi + 1), xf), yf),
      zf,
    );
  };
}

function fbm(noise: (x: number, y: number, z: number) => number, x: number, y: number, z: number, octaves = 5): number {
  let sum = 0;
  let amplitude = 0.5;
  let frequency = 1;
  for (let i = 0; i < octaves; i += 1) {
    sum += amplitude * noise(x * frequency, y * frequency, z * frequency);
    frequency *= 2;
    amplitude *= 0.5;
  }
  return sum;
}

const TEXTURE_WIDTH = 1024;
const TEXTURE_HEIGHT = 512;

export function createSmallBody(descriptor: ProceduralDescriptor): GeneratedSmallBody {
  const { seed, palette, roughness, craters } = descriptor;
  const noise = makeNoise3D(seed);
  const rng = createRng(seed ^ 0x9e3779b9);

  // —— 几何：icosphere + fBm 径向位移 ——
  const geometry = new THREE.IcosahedronGeometry(1.6, 5);
  const position = geometry.attributes.position as THREE.BufferAttribute;
  const vertex = new THREE.Vector3();
  for (let i = 0; i < position.count; i += 1) {
    vertex.fromBufferAttribute(position, i).normalize();
    const displacement = (fbm(noise, vertex.x * 2.2 + 10, vertex.y * 2.2 + 10, vertex.z * 2.2 + 10) - 0.5) * 2;
    const radius = 1.6 * (1 + roughness * 0.45 * displacement);
    position.setXYZ(i, vertex.x * radius, vertex.y * radius, vertex.z * radius);
  }
  geometry.computeVertexNormals();

  // —— 反照率贴图：fBm 三色混合 + 程序陨石坑 ——
  const [base, mid, dark] = palette.map((hex) => new THREE.Color(hex));
  const canvas = document.createElement('canvas');
  canvas.width = TEXTURE_WIDTH;
  canvas.height = TEXTURE_HEIGHT;
  const context = canvas.getContext('2d');
  if (!context) throw new Error('Canvas 2D unavailable');
  const image = context.createImageData(TEXTURE_WIDTH, TEXTURE_HEIGHT);

  const cratersSpec: Array<{ u: number; v: number; r: number; depth: number }> = [];
  if (craters) {
    const craterCount = 36 + Math.floor(rng() * 20);
    for (let i = 0; i < craterCount; i += 1) {
      cratersSpec.push({
        u: rng(),
        v: 0.08 + rng() * 0.84,
        r: 0.008 + rng() * 0.035,
        depth: 0.25 + rng() * 0.5,
      });
    }
  }

  const color = new THREE.Color();
  for (let y = 0; y < TEXTURE_HEIGHT; y += 1) {
    const v = y / TEXTURE_HEIGHT; // 0..1 对应纬度
    const lat = (0.5 - v) * Math.PI;
    const cosLat = Math.cos(lat);
    const sinLat = Math.sin(lat);
    for (let x = 0; x < TEXTURE_WIDTH; x += 1) {
      const u = x / TEXTURE_WIDTH;
      const lon = u * Math.PI * 2;
      const nx = cosLat * Math.cos(lon);
      const ny = sinLat;
      const nz = cosLat * Math.sin(lon);

      const mottle = fbm(noise, nx * 3 + 40, ny * 3 + 40, nz * 3 + 40);
      if (mottle < 0.42) {
        color.copy(base).lerp(mid, mottle / 0.42);
      } else {
        color.copy(mid).lerp(dark, Math.min(1, (mottle - 0.42) / 0.3));
      }

      for (const crater of cratersSpec) {
        let du = Math.abs(u - crater.u);
        du = Math.min(du, 1 - du); // 经度环绕
        const dv = (v - crater.v) * 0.5; // 纬向压缩，近似球面距离
        const dist = Math.hypot(du, dv);
        if (dist < crater.r) {
          const rim = 1 - dist / crater.r;
          const shade = crater.depth * (rim > 0.8 ? -(rim - 0.8) * 5 : rim * 0.55);
          color.offsetHSL(0, 0, -shade * 0.35);
        }
      }

      const offset = (y * TEXTURE_WIDTH + x) * 4;
      image.data[offset] = Math.round(color.r * 255);
      image.data[offset + 1] = Math.round(color.g * 255);
      image.data[offset + 2] = Math.round(color.b * 255);
      image.data[offset + 3] = 255;
    }
  }
  context.putImageData(image, 0, 0);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return { geometry, texture };
}
