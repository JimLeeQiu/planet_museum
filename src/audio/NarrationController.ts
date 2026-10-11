/**
 * 配音控制器（SPEC §6.4）：框架无关纯 TS。
 * 状态空间：stopped/playing/paused × missing/available/undecodable。
 * 绝不自动播放：autoplay 恒为 false，只能显式 play/toggle 启动。
 */

export type NarrationPlayback = 'stopped' | 'playing' | 'paused';
export type NarrationAvailability = 'missing' | 'available' | 'undecodable';

/** 结构兼容 HTMLAudioElement，便于测试注入 mock */
export interface NarrationAudioLike {
  src: string;
  autoplay: boolean;
  readonly paused: boolean;
  currentTime: number;
  play(): Promise<void> | void;
  pause(): void;
  addEventListener(type: string, listener: () => void): void;
  removeEventListener(type: string, listener: () => void): void;
}

export class NarrationController {
  readonly autoplay = false;

  private playback: NarrationPlayback = 'stopped';
  private availability: NarrationAvailability;
  private readonly onEnded = () => {
    this.setPlayback('stopped');
  };
  private readonly onError = () => {
    this.availability = 'undecodable';
    this.setPlayback('stopped');
  };

  constructor(
    private readonly audio: NarrationAudioLike,
    private readonly onChange?: (playback: NarrationPlayback) => void,
  ) {
    this.audio.autoplay = false;
    this.availability = audio.src ? 'available' : 'missing';
    audio.addEventListener('ended', this.onEnded);
    audio.addEventListener('error', this.onError);
  }

  private setPlayback(next: NarrationPlayback) {
    this.playback = next;
    this.onChange?.(next);
  }

  get playbackState(): NarrationPlayback {
    return this.playback;
  }

  get audioAvailability(): NarrationAvailability {
    return this.availability;
  }

  async play(): Promise<void> {
    if (this.availability !== 'available') return;
    try {
      await this.audio.play();
      this.setPlayback('playing');
    } catch {
      // 浏览器拒绝播放（策略/解码失败）→ 视为不可解码
      this.availability = 'undecodable';
      this.setPlayback('stopped');
    }
  }

  pause(): void {
    if (this.playback !== 'playing') return;
    this.audio.pause();
    this.setPlayback('paused');
  }

  toggle(): void | Promise<void> {
    if (this.playback === 'playing') {
      this.pause();
      return;
    }
    return this.play();
  }

  /** 切换展台时调用：立即停止并复位（SPEC §3.5） */
  stop(): void {
    if (this.playback === 'stopped') return;
    if (this.playback === 'playing') {
      this.audio.pause();
    }
    this.audio.currentTime = 0;
    this.setPlayback('stopped');
  }

  dispose(): void {
    this.stop();
    this.audio.removeEventListener('ended', this.onEnded);
    this.audio.removeEventListener('error', this.onError);
  }
}
