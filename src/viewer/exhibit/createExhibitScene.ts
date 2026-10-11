import * as THREE from 'three';
import type { BodyPresentation } from '../../content/types';
import { exhibitTextureCache } from '../TextureCache';
import { createSmallBody } from '../procedural/createSmallBody';

export type ExhibitStatus = 'loading-texture' | 'ready' | 'texture-failed';

export interface ExhibitSceneOptions {
  textureUrl: string | null;
  fallbackColor: string;
  presentation: BodyPresentation;
  onStatusChange?: (status: ExhibitStatus) => void;
}

export interface ExhibitScene {
  dispose(): void;
  resize(): void;
  /** 键盘方向键旋转（无障碍，SPEC §3.1） */
  rotateBy(deltaX: number, deltaY: number): void;
  zoomBy(factor: number): void;
}

const MIN_DISTANCE = 2.6;
const MAX_DISTANCE = 7.5;
const ROTATE_CLAMP_X = 1.2;

/**
 * 单天体展台 3D 场景。
 * 交互（SPEC §3.1）：单指/左键拖动旋转，双指捏合缩放，滚轮缩放。
 */
export function createExhibitScene(
  canvas: HTMLCanvasElement,
  options: ExhibitSceneOptions,
): ExhibitScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
  camera.position.set(0, 0.4, 4.6);

  scene.add(new THREE.AmbientLight(0xffffff, 0.45));
  const keyLight = new THREE.DirectionalLight(0xfff4e0, 2.2);
  keyLight.position.set(4, 2, 5);
  scene.add(keyLight);
  const rimLight = new THREE.DirectionalLight(0x7aa2ff, 0.6);
  rimLight.position.set(-5, -1, -4);
  scene.add(rimLight);

  const group = new THREE.Group();
  const { presentation } = options;
  // 恒星（太阳）用无光照自发光材质；其余用 Lambert 受光材质
  const material = presentation.emissive
    ? new THREE.MeshBasicMaterial({ color: options.fallbackColor })
    : new THREE.MeshLambertMaterial({ color: options.fallbackColor });
  const baseGeometry: THREE.BufferGeometry = new THREE.SphereGeometry(1.6, 64, 44);
  const sphere = new THREE.Mesh(baseGeometry, material);
  group.add(sphere);

  if (presentation.hasRings) {
    const ring = new THREE.Mesh(
      new THREE.RingGeometry(2.2, 3.55, 96),
      new THREE.MeshBasicMaterial({
        color: 0xd8c49a,
        transparent: true,
        opacity: 0.65,
        side: THREE.DoubleSide,
      }),
    );
    ring.rotation.x = -Math.PI / 2;
    group.add(ring);
    group.rotation.x = 0.32;
  }
  scene.add(group);

  // 资产装载：程序化生成（同步）或贴图懒加载（LRU，失败回退纯色）
  let disposed = false;
  let generated: ReturnType<typeof createSmallBody> | null = null;
  if (presentation.procedural) {
    generated = createSmallBody(presentation.procedural);
    sphere.geometry.dispose();
    sphere.geometry = generated.geometry;
    material.map = generated.texture;
    material.color.set('#ffffff');
    material.needsUpdate = true;
    options.onStatusChange?.('ready');
  } else if (options.textureUrl) {
    options.onStatusChange?.('loading-texture');
    exhibitTextureCache
      .get(options.textureUrl)
      .then((texture) => {
        if (disposed) return;
        material.map = texture;
        material.color.set('#ffffff');
        material.needsUpdate = true;
        options.onStatusChange?.('ready');
      })
      .catch(() => {
        if (!disposed) options.onStatusChange?.('texture-failed');
      });
  } else {
    options.onStatusChange?.('ready');
  }

  // —— 指针交互：拖动旋转 + 双指捏合 ——
  const activePointers = new Map<number, { x: number; y: number }>();
  let pinchDistance = 0;

  function clampRotation() {
    group.rotation.x = Math.max(
      -ROTATE_CLAMP_X,
      Math.min(ROTATE_CLAMP_X, group.rotation.x),
    );
  }

  function pointerDistance(): number {
    const [a, b] = [...activePointers.values()];
    return Math.hypot(a.x - b.x, a.y - b.y);
  }

  function onPointerDown(event: PointerEvent) {
    canvas.setPointerCapture(event.pointerId);
    activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });
    if (activePointers.size === 2) {
      pinchDistance = pointerDistance();
    }
  }

  function onPointerMove(event: PointerEvent) {
    const prev = activePointers.get(event.pointerId);
    if (!prev) return;
    const dx = event.clientX - prev.x;
    const dy = event.clientY - prev.y;
    activePointers.set(event.pointerId, { x: event.clientX, y: event.clientY });

    if (activePointers.size === 1) {
      // 单指/单键拖动旋转
      group.rotation.y += dx * 0.006;
      group.rotation.x += dy * 0.006;
      clampRotation();
    } else if (activePointers.size === 2) {
      const next = pointerDistance();
      if (pinchDistance > 0 && next > 0) {
        zoomBy(pinchDistance / next);
      }
      pinchDistance = next;
    }
  }

  function onPointerEnd(event: PointerEvent) {
    activePointers.delete(event.pointerId);
    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
    if (activePointers.size === 2) {
      pinchDistance = pointerDistance();
    }
  }

  function onWheel(event: WheelEvent) {
    event.preventDefault();
    zoomBy(event.deltaY > 0 ? 1.08 : 0.92);
  }

  function zoomBy(factor: number) {
    const length = camera.position.length();
    const next = Math.max(MIN_DISTANCE, Math.min(MAX_DISTANCE, length * factor));
    camera.position.setLength(next);
  }

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerEnd);
  canvas.addEventListener('pointercancel', onPointerEnd);
  canvas.addEventListener('wheel', onWheel, { passive: false });

  let rafId = 0;
  let disposedFlag = false;
  function tick() {
    if (disposedFlag) return;
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  }

  function resize() {
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width === 0 || height === 0) return;
    renderer.setSize(width, height, false);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
  }

  resize();
  rafId = requestAnimationFrame(tick);

  return {
    rotateBy(deltaX, deltaY) {
      group.rotation.y += deltaX;
      group.rotation.x += deltaY;
      clampRotation();
    },
    zoomBy,
    resize,
    dispose() {
      disposed = true;
      disposedFlag = true;
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerEnd);
      canvas.removeEventListener('pointercancel', onPointerEnd);
      canvas.removeEventListener('wheel', onWheel);
      sphere.geometry.dispose();
      material.dispose();
      generated?.texture.dispose();
      renderer.dispose();
    },
  };
}
