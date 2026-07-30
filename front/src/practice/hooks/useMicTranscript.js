import { useCallback, useEffect, useRef, useState } from 'react';
import { speechService } from '../services/speechService';

/**
 * Record mic → transcribe to text (for written/oral reply input).
 */
export function useMicTranscript({ language = 'en' } = {}) {
  const [status, setStatus] = useState('idle'); // idle | recording | transcribing | done | error
  const [transcript, setTranscript] = useState('');
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
    setTranscript('');
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
      setError(err.message || 'Microphone indisponible');
    }
  }, []);

  const stop = useCallback(async () => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === 'inactive') return null;

    setStatus('transcribing');
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
      const result = await speechService.transcribe(blob, { language });
      const text = String(result?.text || '').trim();
      setTranscript(text);
      setStatus('done');
      return text;
    } catch (err) {
      setStatus('error');
      setError(err.message || 'Transcription échouée');
      return null;
    } finally {
      recorderRef.current = null;
      chunksRef.current = [];
    }
  }, [language]);

  const reset = useCallback(() => {
    cleanup();
    setStatus('idle');
    setTranscript('');
    setError(null);
  }, [cleanup]);

  return { status, transcript, error, start, stop, reset };
}
