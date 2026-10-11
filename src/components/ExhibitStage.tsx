import { useEffect, useRef, useState } from 'react';
import type { RuntimeBody } from '../content/types';
import {
  createExhibitScene,
  type ExhibitStatus,
} from '../viewer/exhibit/createExhibitScene';

interface ExhibitStageProps {
  body: RuntimeBody;
}

const STATUS_TEXT: Record<ExhibitStatus, string> = {
  'loading-texture': '模型贴图加载中',
  ready: '3D 模型已就绪，可以拖动旋转',
  'texture-failed': '贴图加载失败，已显示纯色模型',
};

/** 展台 3D 舞台：拖动旋转/双指缩放/滚轮缩放/方向键旋转，aria-live 播报状态。 */
export function ExhibitStage({ body }: ExhibitStageProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<ReturnType<typeof createExhibitScene> | null>(null);
  const [status, setStatus] = useState<ExhibitStatus>('loading-texture');
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    let scene: ReturnType<typeof createExhibitScene>;
    try {
      scene = createExhibitScene(canvas, {
        textureUrl: body.textureUrl,
        fallbackColor: body.fallbackColor,
        presentation: body.presentation,
        onStatusChange: setStatus,
      });
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
    return <p className="sandbox-fallback">你的浏览器不支持 WebGL，无法显示 3D 模型。</p>;
  }

  return (
    <>
      <div className="exhibit-stage">
        <canvas
          ref={canvasRef}
          className="exhibit-canvas"
          tabIndex={0}
          role="application"
          aria-label={`${body.content.name.zh} 3D 模型。左右方向键水平旋转，上下方向键垂直旋转。`}
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
      <div role="status" aria-live="polite" className="visually-hidden">
        {body.content.name.zh}展台：{STATUS_TEXT[status]}
      </div>
    </>
  );
}
