import { useEffect, useRef, useState } from 'react';
import { SANDBOX_BODIES } from '../content/bodies/sandbox';
import { usePrefersReducedMotion } from '../hooks/usePrefersReducedMotion';
import { createSandboxScene } from '../viewer/sandbox/createSandboxScene';

interface SandboxProps {
  onSelectBody: (id: string) => void;
}

/**
 * 太阳系沙盘（首页主视觉）。
 * 点击天体 → 进展台；点击空白 → 暂停/继续；reduced-motion 下默认静止。
 */
export function Sandbox({ onSelectBody }: SandboxProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<ReturnType<typeof createSandboxScene> | null>(null);
  const reducedMotion = usePrefersReducedMotion();
  const [paused, setPaused] = useState(reducedMotion);
  const [webglFailed, setWebglFailed] = useState(false);
  const pausedRef = useRef(paused);
  pausedRef.current = paused;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let scene: ReturnType<typeof createSandboxScene>;
    try {
      scene = createSandboxScene(canvas, SANDBOX_BODIES, (isPaused) => {
        setPaused(isPaused);
      });
    } catch {
      setWebglFailed(true);
      return;
    }
    sceneRef.current = scene;
    scene.setPaused(pausedRef.current);

    const observer = new ResizeObserver(() => scene.resize());
    observer.observe(canvas);

    return () => {
      observer.disconnect();
      scene.dispose();
      sceneRef.current = null;
    };
    // 场景只随挂载创建一次；初始暂停状态通过 setPaused 同步
  }, []);

  const statusText = paused ? '太阳系沙盘动画已暂停' : '太阳系沙盘动画播放中';

  return (
    <section aria-label="太阳系沙盘">
      <div className="sandbox-stage">
        {webglFailed ? (
          <p className="sandbox-fallback">你的浏览器不支持 WebGL，无法显示 3D 沙盘。</p>
        ) : (
          <canvas
            ref={canvasRef}
            className="sandbox-canvas"
            aria-label="太阳系沙盘：太阳居中，天体沿轨道缓慢公转。点击下方天体列表可进入展台。"
            onPointerUp={(event) => {
              const scene = sceneRef.current;
              if (!scene) return;
              const id = scene.handlePointerUp(event.clientX, event.clientY);
              if (id) onSelectBody(id);
            }}
          />
        )}
      </div>
      <div className="sandbox-controls">
        <button
          type="button"
          onClick={() => sceneRef.current?.setPaused(!paused)}
          disabled={webglFailed}
        >
          {paused ? '继续转动' : '暂停转动'}
        </button>
        <p className="sandbox-hint">点一点沙盘里的天体，去看看它的展台；点空白处可以暂停。</p>
      </div>
      <div role="status" aria-live="polite" className="visually-hidden">
        {statusText}
      </div>
    </section>
  );
}
