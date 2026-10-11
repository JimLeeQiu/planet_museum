import * as THREE from 'three';
import { OUTERMOST_ORBIT_PERIOD_SECONDS, OUTERMOST_ORBIT_RADIUS } from '../../content/bodies/sandbox';
import type { SandboxBody } from '../../content/bodies/types';

export interface SandboxScene {
  /** 释放 renderer / geometry / material / RAF */
  dispose(): void;
  setPaused(paused: boolean): void;
  isPaused(): boolean;
  resize(): void;
  /** 返回命中的天体 id；未命中则切换暂停状态并返回 null */
  handlePointerUp(clientX: number, clientY: number): string | null;
}

interface BodyRuntime {
  def: SandboxBody;
  group: THREE.Group;
  /** 相对宿主的局部轨道角度增量（卫星），否则为绕日角度 */
  moon: boolean;
}

/**
 * 太阳系沙盘场景。
 * viewer 核心：只负责把「天体描述符」渲染成场景，压缩比例、名单全部来自数据文件。
 */
export function createSandboxScene(
  canvas: HTMLCanvasElement,
  bodies: readonly SandboxBody[],
  onTogglePause?: (paused: boolean) => void,
): SandboxScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 500);
  camera.position.set(0, 30, 42);
  camera.lookAt(0, 0, 0);

  scene.add(new THREE.AmbientLight(0xffffff, 0.55));
  const sunLight = new THREE.PointLight(0xfff2d8, 2.5, 0, 0);
  scene.add(sunLight);

  addStarfield(scene);

  const orbitLineMaterial = new THREE.LineBasicMaterial({
    color: 0x5a6b9e,
    transparent: true,
    opacity: 0.35,
  });

  const runtimes: BodyRuntime[] = [];
  const pickables: THREE.Object3D[] = [];
  const groups = new Map<string, THREE.Group>();

  for (const def of bodies) {
    if (def.orbitLineOnly) {
      addOrbitLineOnly(scene, def);
      continue;
    }

    const group = new THREE.Group();
    group.userData.bodyId = def.id;
    // 恒星用无光照自发光材质：点光源在球心时 Lambert 漫反射为零，太阳会发黑
    const material =
      def.kind === 'star'
        ? new THREE.MeshBasicMaterial({ color: def.color })
        : new THREE.MeshLambertMaterial({ color: def.color });
    const mesh = new THREE.Mesh(new THREE.SphereGeometry(def.bodyRadius, 40, 28), material);
    mesh.userData.bodyId = def.id;
    group.add(mesh);

    if (def.hasRings) {
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(def.bodyRadius * 1.4, def.bodyRadius * 2.2, 72),
        new THREE.MeshBasicMaterial({
          color: 0xd8c49a,
          transparent: true,
          opacity: 0.65,
          side: THREE.DoubleSide,
        }),
      );
      ring.rotation.x = -Math.PI / 2;
      ring.userData.bodyId = def.id;
      group.add(ring);
      group.rotation.x = 0.32;
    }

    if (!def.hostBody) {
      // 绕日轨道参考线
      const circle = circleLine(def.orbitRadius, orbitLineMaterial);
      scene.add(circle);
    }

    groups.set(def.id, group);
    scene.add(group);
    pickables.push(group);
    runtimes.push({ def, group, moon: Boolean(def.hostBody) });
  }

  // 卫星轨道参考线挂在宿主 group 上，随宿主一起移动
  for (const rt of runtimes) {
    if (!rt.moon) continue;
    const host = groups.get(rt.def.hostBody ?? '');
    if (!host) continue;
    host.add(circleLine(rt.def.orbitRadius, orbitLineMaterial));
  }

  const raycaster = new THREE.Raycaster();
  const pointer = new THREE.Vector2();
  let paused = false;
  let elapsed = 0;
  let lastTime = performance.now();
  let disposed = false;
  let rafId = 0;

  function tick(now: number) {
    if (disposed) return;
    const dt = Math.min((now - lastTime) / 1000, 0.1);
    lastTime = now;
    if (!paused) {
      elapsed += dt;
      for (const rt of runtimes) {
        const { def, group } = rt;
        const angle = def.initialAngle + elapsed * angularSpeed(def);
        if (rt.moon) {
          const host = groups.get(def.hostBody ?? '');
          const hx = host?.position.x ?? 0;
          const hz = host?.position.z ?? 0;
          group.position.set(
            hx + Math.cos(angle) * def.orbitRadius,
            0,
            hz + Math.sin(angle) * def.orbitRadius,
          );
        } else {
          group.position.set(
            Math.cos(angle) * def.orbitRadius,
            0,
            Math.sin(angle) * def.orbitRadius,
          );
        }
      }
    }
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
    setPaused(next) {
      paused = next;
      onTogglePause?.(next);
    },
    isPaused: () => paused,
    resize,
    handlePointerUp(clientX, clientY) {
      const rect = canvas.getBoundingClientRect();
      pointer.set(
        ((clientX - rect.left) / rect.width) * 2 - 1,
        -((clientY - rect.top) / rect.height) * 2 + 1,
      );
      raycaster.setFromCamera(pointer, camera);
      const hits = raycaster.intersectObjects(pickables, true);
      const hit = hits.find((h) => typeof h.object.userData.bodyId === 'string');
      if (hit) {
        return hit.object.userData.bodyId as string;
      }
      paused = !paused;
      onTogglePause?.(paused);
      return null;
    },
    dispose() {
      disposed = true;
      cancelAnimationFrame(rafId);
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh || obj instanceof THREE.Line) {
          obj.geometry.dispose();
          const material = obj.material;
          if (Array.isArray(material)) {
            material.forEach((m) => m.dispose());
          } else {
            material.dispose();
          }
        }
      });
      renderer.dispose();
    },
  };
}

/** 公转角速度（rad/s）：外圈约 OUTERMOST_ORBIT_PERIOD_SECONDS 一圈，内圈按比例加快。
 *  orbitRadius 为 0（太阳）时静止在中心，返回 0（否则 2π/0 = Infinity 会把坐标算成 NaN）。 */
export function angularSpeed(def: SandboxBody): number {
  if (def.hostBody) {
    // 卫星绕宿主：局部小轨道 ~12 秒一圈
    return (Math.PI * 2) / (12 * (def.orbitRadius / 1.9));
  }
  if (def.orbitRadius <= 0) return 0;
  const period =
    OUTERMOST_ORBIT_PERIOD_SECONDS * (def.orbitRadius / OUTERMOST_ORBIT_RADIUS);
  return (Math.PI * 2) / period;
}

function circleLine(radius: number, material: THREE.Material): THREE.LineLoop {
  const points: THREE.Vector3[] = [];
  for (let i = 0; i < 128; i += 1) {
    const a = (i / 128) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(a) * radius, 0, Math.sin(a) * radius));
  }
  return new THREE.LineLoop(new THREE.BufferGeometry().setFromPoints(points), material);
}

/** 哈雷彗星：不摆实体，只画扁椭圆轨道线（SPEC §2.2） */
function addOrbitLineOnly(scene: THREE.Scene, def: SandboxBody): void {
  if (!def.orbitLine) return;
  const curve = new THREE.EllipseCurve(0, 0, def.orbitLine.rx, def.orbitLine.ry);
  const points3 = curve.getPoints(160).map((p) => new THREE.Vector3(p.x, p.y, 0));
  const line = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(points3),
    new THREE.LineBasicMaterial({ color: def.orbitLine.color, transparent: true, opacity: 0.5 }),
  );
  const tilt = new THREE.Group();
  tilt.rotation.x = def.orbitLine.tiltX;
  tilt.rotation.z = def.orbitLine.tiltZ;
  tilt.add(line);
  scene.add(tilt);
}

function addStarfield(scene: THREE.Scene): void {
  const count = 400;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < count; i += 1) {
    const r = 120 + Math.random() * 120;
    const theta = Math.random() * Math.PI * 2;
    const phi = Math.acos(2 * Math.random() - 1);
    positions[i * 3] = r * Math.sin(phi) * Math.cos(theta);
    positions[i * 3 + 1] = r * Math.cos(phi);
    positions[i * 3 + 2] = r * Math.sin(phi) * Math.sin(theta);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  scene.add(
    new THREE.Points(
      geometry,
      new THREE.PointsMaterial({ color: 0xcdd6ff, size: 0.7, transparent: true, opacity: 0.8 }),
    ),
  );
}
