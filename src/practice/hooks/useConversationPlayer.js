import { useCallback, useEffect, useRef, useState } from 'react';
import { speechService, stopPlayback } from '../services/speechService';

/**
 * Play simulation turns one-by-one or continuously (role-aware voices).
 */
export function useConversationPlayer(turns = []) {
  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [mode, setMode] = useState('step');
  const cancelRef = useRef(false);
  const turnsKey = turns.map((t) => t.id || t.text).join('|');

  useEffect(() => {
    setIndex(0);
    setPlaying(false);
    stopPlayback();
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reset when dialogue identity changes
  }, [turnsKey]);

  useEffect(() => () => stopPlayback(), []);

  const playAt = useCallback(
    async (i) => {
      const turn = turns[i];
      if (!turn?.text) return;
      setIndex(i);
      setPlaying(true);
      try {
        await speechService.speak(turn.text, { role: turn.role });
      } finally {
        if (!cancelRef.current) setPlaying(false);
      }
    },
    [turns]
  );

  const playCurrent = useCallback(async () => {
    cancelRef.current = false;
    await playAt(index);
  }, [index, playAt]);

  const playContinuous = useCallback(async () => {
    cancelRef.current = false;
    setMode('continuous');
    setPlaying(true);
    for (let i = index; i < turns.length; i += 1) {
      if (cancelRef.current) break;
      setIndex(i);
      try {
        await speechService.speak(turns[i].text, { role: turns[i].role });
        if (cancelRef.current) break;
        // brief pause between speakers
        await new Promise((r) => setTimeout(r, 280));
      } catch {
        break;
      }
    }
    if (!cancelRef.current) setPlaying(false);
  }, [index, turns]);

  const next = useCallback(() => {
    setIndex((i) => Math.min(i + 1, Math.max(0, turns.length - 1)));
  }, [turns.length]);

  const prev = useCallback(() => {
    setIndex((i) => Math.max(0, i - 1));
  }, []);

  const stop = useCallback(() => {
    cancelRef.current = true;
    stopPlayback();
    setPlaying(false);
  }, []);

  return {
    index,
    current: turns[index] || null,
    playing,
    mode,
    setMode,
    playCurrent,
    playContinuous,
    next,
    prev,
    stop,
    setIndex
  };
}
