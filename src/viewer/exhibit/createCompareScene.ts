import * as THREE from 'three';
import type { RuntimeBody } from '../../content/types';
import { planComparison } from '../../content/compare';
import { exhibitTextureCache } from '../TextureCache';
import { createSmallBody } from '../procedural/createSmallBody';
import { earth } from '../../content/bodies/earth/body';

export interface CompareScene {
  dispose(): void;
  resize(): void;
  rotateBy(deltaX: number, deltaY: number): void;
}

const EARTH_RADIUS = 1.6;
const GAP = 0.5;

/**
 * 「和地球比比看」场景（SPEC §3.2）：真实比例。
 * dual：两个球按真实直径比并排；row：一排 N 个小球 = 地球直径。
 */
export function createCompareScene(
  canvas: HTMLCanvasElement,
  body: RuntimeBody,
): CompareScene {
  const plan = planComparison(body.content.data.diameterKm);
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100000);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const keyLight = new THREE.DirectionalLight(0xfff4e0, 2.2);
  keyLight.position.set(4, 3, 6);
  scene.add(keyLight);

  const group = new THREE.Group();
  scene.add(group);
  const disposables: Array<{ dispose(): void }> = [];

  // —— 地球（参照物，始终真实大小） ——
  const earthMaterial = new THREE.MeshLambertMaterial({ color: earth.fallbackColor });
  const earthMesh = new THREE.Mesh(new THREE.SphereGeometry(EARTH_RADIUS, 64, 44), earthMaterial);
  group.add(earthMesh);
  disposables.push(earthMesh.geometry, earthMaterial);
  if (earth.textureUrl) {
    exhibitTextureCache
      .get(earth.textureUrl)
      .then((texture) => {
        earthMaterial.map = texture;
        earthMaterial.color.set('#ffffff');
        earthMaterial.needsUpdate = true;
      })
      .catch(() => {
        // 贴图失败保留纯色地球
      });
  }

  function createBodyMaterial(): THREE.MeshLambertMaterial | THREE.MeshBasicMaterial {
    return body.presentation.emissive
      ? new THREE.MeshBasicMaterial({ color: body.fallbackColor })
      : new THREE.MeshLambertMaterial({ color: body.fallbackColor });
  }

  function applyBodySurface(
    material: THREE.MeshLambertMaterial | THREE.MeshBasicMaterial,
  ): void {
    if (body.presentation.procedural) {
      const generated = createSmallBody(body.presentation.procedural);
      disposables.push(generated.texture);
      material.map = generated.texture;
      material.color.set('#ffffff');
      material.needsUpdate = true;
    } else if (body.textureUrl) {
      exhibitTextureCache
        .get(body.textureUrl)
        .then((texture) => {
          material.map = texture;
          material.color.set('#ffffff');
          material.needsUpdate = true;
        })
        .catch(() => {
          // 保留纯色
        });
    }
  }

  if (plan.mode === 'dual') {
    // 真实比例双球并排（太阳等大天体：地球会显得很小，这正是要点）
    const bodyRadius = EARTH_RADIUS * plan.ratio;
    const material = createBodyMaterial();
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(bodyRadius, 64, 44), material);
    mesh.position.x = -(bodyRadius + GAP);
    earthMesh.position.x = EARTH_RADIUS + GAP;
    group.add(mesh);
    disposables.push(mesh.geometry, material);
    applyBodySurface(material);
  } else {
    // 「N 个排成一行」：一排小球的总宽度 = 地球直径
    const rowSphereDiameter = (EARTH_RADIUS * 2) / plan.count;
    const rowSphereRadius = rowSphereDiameter / 2;
    const shown = Math.min(plan.count, 10);
    earthMesh.position.x = EARTH_RADIUS + GAP + rowSphereDiameter * shown;
    const material = createBodyMaterial();
    const geometry = new THREE.SphereGeometry(rowSphereRadius, 24, 16);
    disposables.push(geometry, material);
    const rowRight = earthMesh.position.x - EARTH_RADIUS - GAP;
    for (let i = 0; i < shown; i += 1) {
      const mini = new THREE.Mesh(geometry, material);
      mini.position.x = rowRight - rowSphereDiameter * (i + 0.5);
      group.add(mini);
    }
    applyBodySurface(material);
  }

  // —— 交互：拖动旋转 + 滚轮缩放（与展台一致） ——
  let dragging = false;
  let lastX = 0;
  let lastY = 0;
  let fitDistance = 10;

  function onPointerDown(event: PointerEvent) {
    dragging = true;
    lastX = event.clientX;
    lastY = event.clientY;
    canvas.setPointerCapture(event.pointerId);
  }
  function onPointerMove(event: PointerEvent) {
    if (!dragging) return;
    group.rotation.y += (event.clientX - lastX) * 0.006;
    group.rotation.x += (event.clientY - lastY) * 0.006;
    group.rotation.x = Math.max(-1.2, Math.min(1.2, group.rotation.x));
    lastX = event.clientX;
    lastY = event.clientY;
  }
  function onPointerUp(event: PointerEvent) {
    dragging = false;
    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
  }
  function onWheel(event: WheelEvent) {
    event.preventDefault();
    const length = camera.position.length();
    camera.position.setLength(Math.max(fitDistance * 0.5, Math.min(fitDistance * 3, length * (event.deltaY > 0 ? 1.1 : 0.9))));
  }

  canvas.addEventListener('pointerdown', onPointerDown);
  canvas.addEventListener('pointermove', onPointerMove);
  canvas.addEventListener('pointerup', onPointerUp);
  canvas.addEventListener('pointercancel', onPointerUp);
  canvas.addEventListener('wheel', onWheel, { passive: false });

  function frame() {
    const box = new THREE.Box3().setFromObject(group);
    const sphere = box.getBoundingSphere(new THREE.Sphere());
    fitDistance = sphere.radius / Math.tan((camera.fov * Math.PI) / 360) + sphere.radius;
    camera.position.set(0, sphere.radius * 0.45, fitDistance);
    camera.lookAt(sphere.center);
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;
    if (width > 0 && height > 0) {
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  }
  frame();

  let rafId = 0;
  let disposed = false;
  function tick() {
    if (disposed) return;
    renderer.render(scene, camera);
    rafId = requestAnimationFrame(tick);
  }
  rafId = requestAnimationFrame(tick);

  return {
    rotateBy(deltaX, deltaY) {
      group.rotation.y += deltaX;
      group.rotation.x = Math.max(-1.2, Math.min(1.2, group.rotation.x + deltaY));
    },
    resize: frame,
    dispose() {
      disposed = true;
      cancelAnimationFrame(rafId);
      canvas.removeEventListener('pointerdown', onPointerDown);
      canvas.removeEventListener('pointermove', onPointerMove);
      canvas.removeEventListener('pointerup', onPointerUp);
      canvas.removeEventListener('pointercancel', onPointerUp);
      canvas.removeEventListener('wheel', onWheel);
      for (const item of disposables) item.dispose();
      renderer.dispose();
    },
  };
}
