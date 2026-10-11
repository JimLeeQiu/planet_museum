import { useEffect, useRef, useState } from 'react';
import { NarrationController } from '../audio/NarrationController';
import type { NarrationPlan } from '../content/types';

interface NarrationButtonProps {
  plan: NarrationPlan;
  audioUrl: string | null;
}

const PLAYBACK_TEXT = {
  stopped: '听一听',
  playing: '暂停',
  paused: '继续听',
} as const;

/**
 * 「听一听」按钮（SPEC §3.5）：点击才播放，绝不自动播放，切换展台即停。
 * 配音缺失或未过审（pending-review）时显示「介绍准备中」。
 */
export function NarrationButton({ plan, audioUrl }: NarrationButtonProps) {
  const controllerRef = useRef<NarrationController | null>(null);
  const [playback, setPlayback] =
    useState<NarrationController['playbackState']>('stopped');

  const playable = plan.status === 'ready' && audioUrl !== null;

  useEffect(() => {
    if (!playable || !audioUrl) return;
    const audio = new Audio(audioUrl);
    audio.autoplay = false;
    audio.preload = 'none';
    const controller = new NarrationController(audio, setPlayback);
    controllerRef.current = controller;
    return () => {
      // 切换展台/卸载：立即停止上一段音频（SPEC §3.5）
      controller.dispose();
      controllerRef.current = null;
      setPlayback('stopped');
    };
  }, [playable, audioUrl]);

  if (!playable) {
    return <p className="narration-pending">介绍准备中</p>;
  }

  return (
    <button
      type="button"
      className="narration-button"
      onClick={() => controllerRef.current?.toggle()}
    >
      {PLAYBACK_TEXT[playback]}
    </button>
  );
}
