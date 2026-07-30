import { useCallback, useEffect, useRef, useState } from 'react';
import { speechService } from '../services/speechService';

/**
 * Record mic → assess pronunciation against targetText.
 */
export function usePronunciation(targetText) {
  const [status, setStatus] = useState('idle'); // idle | recording | scoring | done | error
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const mediaRef = useRef(null);
  const chunksRef = useRef([]);
  const recorderRef = useRef(null);

  const cleanup = useCallback(() => {
    if (recorderRef.current && recorderRef.current.state !== 'inactive') {
      try {
        recorderRef.current.stop();
      } catch {
        /* ignore */
      }
    }
    if (mediaRef.current) {
      mediaRef.current.getTracks().forEach((t) => t.stop());
      mediaRef.current = null;
    }
    recorderRef.current = null;
    chunksRef.current = [];
  }, []);

  useEffect(() => () => cleanup(), [cleanup]);

  const start = useCallback(async () => {
    setError(null);
    setResult(null);
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaRef.current = stream;
      chunksRef.current = [];
      const mimeType = MediaRecorder.isTypeSupported('audio/webm')
        ? 'audio/webm'
        : 'audio/mp4';
      const recorder = new MediaRecorder(stream, { mimeType });
      recorderRef.current = recorder;
      recorder.ondataavailable = (e) => {
        if (e.data?.size) chunksRef.current.push(e.data);
      };
      recorder.start();
      setStatus('recording');
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Microphone unavailable');
    }
  }, []);

  const stop = useCallback(async () => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === 'inactive') return;

    setStatus('scoring');
    const blob = await new Promise((resolve) => {
      recorder.onstop = () => {
        resolve(new Blob(chunksRef.current, { type: recorder.mimeType || 'audio/webm' }));
      };
      recorder.stop();
      if (mediaRef.current) {
        mediaRef.current.getTracks().forEach((t) => t.stop());
        mediaRef.current = null;
      }
    });

    try {
      const { result: scored } = await speechService.assessPronunciation(targetText, blob, {
        language: 'en',
        targetHint: targetText
      });
      setResult(scored);
      setStatus('done');
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Scoring failed');
    } finally {
      recorderRef.current = null;
      chunksRef.current = [];
    }
  }, [targetText]);

  const reset = useCallback(() => {
    cleanup();
    setStatus('idle');
    setResult(null);
    setError(null);
  }, [cleanup]);

  return { status, result, error, start, stop, reset };
}
