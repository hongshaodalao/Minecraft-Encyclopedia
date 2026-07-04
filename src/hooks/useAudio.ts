import { useState, useRef, useCallback, useEffect } from 'react';

const BASE = import.meta.env.BASE_URL;
const AUDIO_EXT = '.wav';

export type AudioState = 'idle' | 'loading' | 'playing' | 'paused' | 'error';

export function useAudio() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [state, setState] = useState<AudioState>('idle');

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    return audioRef.current;
  }, []);

  const load = useCallback(
    (entryId: string) => {
      const audio = getAudio();
      audio.pause();
      audio.src = `${BASE}audio/${entryId}${AUDIO_EXT}`;
      audio.load();
      setState('idle');
    },
    [getAudio]
  );

  const play = useCallback(
    (entryId?: string) => {
      const audio = getAudio();

      if (entryId && !audio.src.includes(entryId)) {
        audio.src = `${BASE}audio/${entryId}${AUDIO_EXT}`;
        audio.load();
      }

      setState('loading');
      audio
        .play()
        .then(() => setState('playing'))
        .catch(() => setState('error'));
    },
    [getAudio]
  );

  const pause = useCallback(() => {
    const audio = getAudio();
    audio.pause();
    setState('paused');
  }, [getAudio]);

  const toggle = useCallback(
    (entryId?: string) => {
      if (state === 'playing') {
        pause();
      } else {
        play(entryId);
      }
    },
    [state, play, pause]
  );

  useEffect(() => {
    const audio = getAudio();

    const onEnded = () => setState('idle');
    const onError = () => setState('error');
    const onPlaying = () => setState('playing');
    const onPause = () => {
      if (audio.currentTime > 0) setState('paused');
    };

    audio.addEventListener('ended', onEnded);
    audio.addEventListener('error', onError);
    audio.addEventListener('playing', onPlaying);
    audio.addEventListener('pause', onPause);

    return () => {
      audio.removeEventListener('ended', onEnded);
      audio.removeEventListener('error', onError);
      audio.removeEventListener('playing', onPlaying);
      audio.removeEventListener('pause', onPause);
      audio.pause();
      audio.src = '';
    };
  }, [getAudio]);

  return { state, play, pause, toggle, load };
}
