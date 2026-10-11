import { describe, expect, it, vi } from 'vitest';
import { NarrationController, type NarrationAudioLike } from './NarrationController';

function createMockAudio(overrides: Partial<NarrationAudioLike> = {}) {
  const listeners = new Map<string, Array<() => void>>();
  let paused = true;
  const audio: NarrationAudioLike & {
    emit(type: string): void;
    rejectNextPlay?: boolean;
  } = {
    src: 'narration.wav',
    autoplay: false,
    get paused() {
      return paused;
    },
    currentTime: 0,
    async play() {
      if (audio.rejectNextPlay) {
        audio.rejectNextPlay = false;
        throw new Error('play() rejected');
      }
      paused = false;
    },
    pause() {
      paused = true;
    },
    addEventListener(type, listener) {
      const list = listeners.get(type) ?? [];
      list.push(listener);
      listeners.set(type, list);
    },
    removeEventListener(type, listener) {
      listeners.set(
        type,
        (listeners.get(type) ?? []).filter((l) => l !== listener),
      );
    },
    emit(type) {
      for (const listener of listeners.get(type) ?? []) listener();
    },
    ...overrides,
  };
  return audio;
}

describe('NarrationController', () => {
  it('never autoplays and starts stopped', () => {
    const audio = createMockAudio();
    const controller = new NarrationController(audio);
    expect(controller.autoplay).toBe(false);
    expect(audio.autoplay).toBe(false);
    expect(controller.playbackState).toBe('stopped');
  });

  it('reports missing audio when no src', () => {
    const audio = createMockAudio({ src: '' });
    const controller = new NarrationController(audio);
    expect(controller.audioAvailability).toBe('missing');
  });

  it('play → playing, ended → stopped', async () => {
    const audio = createMockAudio();
    const controller = new NarrationController(audio);
    await controller.play();
    expect(controller.playbackState).toBe('playing');
    audio.emit('ended');
    expect(controller.playbackState).toBe('stopped');
  });

  it('toggle pauses and resumes', async () => {
    const audio = createMockAudio();
    const controller = new NarrationController(audio);
    await controller.play();
    controller.toggle();
    expect(controller.playbackState).toBe('paused');
    await controller.toggle();
    expect(controller.playbackState).toBe('playing');
  });

  it('error event marks audio undecodable', () => {
    const audio = createMockAudio();
    const controller = new NarrationController(audio);
    audio.emit('error');
    expect(controller.audioAvailability).toBe('undecodable');
  });

  it('rejected play() marks undecodable instead of throwing', async () => {
    const audio = createMockAudio();
    audio.rejectNextPlay = true;
    const controller = new NarrationController(audio);
    await controller.play();
    expect(controller.audioAvailability).toBe('undecodable');
    expect(controller.playbackState).toBe('stopped');
  });

  it('stop() resets position and is safe when already stopped', async () => {
    const audio = createMockAudio();
    const controller = new NarrationController(audio);
    controller.stop();
    await controller.play();
    audio.currentTime = 1.5;
    controller.stop();
    expect(controller.playbackState).toBe('stopped');
    expect(audio.currentTime).toBe(0);
  });

  it('notifies onChange on transitions', async () => {
    const audio = createMockAudio();
    const onChange = vi.fn();
    const controller = new NarrationController(audio, onChange);
    await controller.play();
    controller.pause();
    expect(onChange).toHaveBeenCalledTimes(2);
    expect(onChange).toHaveBeenNthCalledWith(1, 'playing');
    expect(onChange).toHaveBeenNthCalledWith(2, 'paused');
  });

  it('dispose() stops playback and detaches listeners', async () => {
    const audio = createMockAudio();
    const controller = new NarrationController(audio);
    await controller.play();
    controller.dispose();
    expect(controller.playbackState).toBe('stopped');
    audio.emit('ended');
    expect(controller.playbackState).toBe('stopped');
  });
});
