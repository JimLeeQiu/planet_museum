import { useEffect, useRef, useState } from 'react';
import type { RuntimeBody } from '../content/types';
import { planComparison } from '../content/compare';
import { createCompareScene } from '../viewer/exhibit/createCompareScene';

interface CompareViewProps {
  body: RuntimeBody;
}

/** 「和地球比比看」视图（SPEC §3.2）：真实比例双球 / 「N 个排成一行」类比。 */
export function CompareView({ body }: CompareViewProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<ReturnType<typeof createCompareScene> | null>(null);
  const [webglFailed, setWebglFailed] = useState(false);

  const plan = planComparison(body.content.data.diameterKm);
  const caption =
    plan.mode === 'dual'
      ? `两个球按真实大小摆放：左边是${body.content.name.zh}，右边是地球。`
      : `右边是地球。左边的小球代表${body.content.name.zh}——约 ${plan.count.toLocaleString('zh-CN')} 个排成一行，才和地球一样宽。`;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let scene: ReturnType<typeof createCompareScene>;
    try {
      scene = createCompareScene(canvas, body);
    } catch {
      setWebglFailed(true);
      return;
    }
    sceneRef.current = scene;
    const observer = new ResizeObserver(() => scene.resize());
    observer.observe(canvas);
    return () => {
      observer.disconnect();
      scene.dispose();
      sceneRef.current = null;
    };
  }, [body]);

  if (webglFailed) {
    return <p className="sandbox-fallback">你的浏览器不支持 WebGL，无法显示 3D 对比。</p>;
  }

  return (
    <>
      <div className="exhibit-stage">
        <canvas
          ref={canvasRef}
          className="exhibit-canvas"
          tabIndex={0}
          role="application"
          aria-label={`${body.content.name.zh}和地球的真实大小对比。左右方向键旋转，滚轮缩放。`}
          onKeyDown={(event) => {
            const scene = sceneRef.current;
            if (!scene) return;
            const step = 0.18;
            if (event.key === 'ArrowLeft') {
              scene.rotateBy(-step, 0);
              event.preventDefault();
            } else if (event.key === 'ArrowRight') {
              scene.rotateBy(step, 0);
              event.preventDefault();
            } else if (event.key === 'ArrowUp') {
              scene.rotateBy(0, -step);
              event.preventDefault();
            } else if (event.key === 'ArrowDown') {
              scene.rotateBy(0, step);
              event.preventDefault();
            }
          }}
        />
      </div>
      <p className="compare-caption">{caption}</p>
      <div role="status" aria-live="polite" className="visually-hidden">
        已切换到和地球比比看。{caption}
      </div>
    </>
  );
}
