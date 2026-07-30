import { useEffect, useRef } from 'react';

const BOOT_MUSIC = '/music/music-3.mp3';
const MUSIC_VOLUME = 0.16;
const MUSIC_DELAY_MS = 1400;

export function useSoundtrack() {
  const musicRef = useRef<HTMLAudioElement | null>(null);
  const delayRef = useRef<number | null>(null);

  useEffect(() => {
    const music = new Audio(BOOT_MUSIC);
    music.loop = false;
    music.volume = MUSIC_VOLUME;
    musicRef.current = music;

    return () => {
      if (delayRef.current !== null) {
        window.clearTimeout(delayRef.current);
      }

      music.pause();
    };
  }, []);

  function start() {
    const music = musicRef.current;

    if (!music) {
      return;
    }

    if (delayRef.current !== null) {
      window.clearTimeout(delayRef.current);
    }

    music.currentTime = 0;
    music.muted = true;
    music.loop = false;
    void music.play().catch(() => undefined);

    delayRef.current = window.setTimeout(() => {
      music.currentTime = 0;
      music.muted = false;
      delayRef.current = null;
    }, MUSIC_DELAY_MS);
  }

  return { start };
}
