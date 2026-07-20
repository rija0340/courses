import { usesRemoteSpeech } from '../config';
import { mockSpeechAdapter } from '../adapters/mockSpeechAdapter';
import { remoteSpeechAdapter } from '../adapters/remoteSpeechAdapter';
import { browserTtsAdapter } from '../adapters/browserTtsAdapter';
import { scorePronunciation } from '../domain/pronunciation';
import { browserVoiceOptsForRole, voiceModelForRole } from '../domain/voices';

function speechAdapter() {
  return usesRemoteSpeech() ? remoteSpeechAdapter : mockSpeechAdapter;
}

let currentAudio = null;

export function stopPlayback() {
  browserTtsAdapter.stop();
  if (currentAudio) {
    currentAudio.pause();
    currentAudio = null;
  }
}

function playBase64Audio(audioBase64, mimeType) {
  return new Promise((resolve, reject) => {
    stopPlayback();
    const byteChars = atob(audioBase64);
    const bytes = new Uint8Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i += 1) {
      bytes[i] = byteChars.charCodeAt(i);
    }
    const blob = new Blob([bytes], { type: mimeType || 'audio/mpeg' });
    const url = URL.createObjectURL(blob);
    const audio = new Audio(url);
    currentAudio = audio;
    audio.onended = () => {
      URL.revokeObjectURL(url);
      currentAudio = null;
      resolve();
    };
    audio.onerror = () => {
      URL.revokeObjectURL(url);
      currentAudio = null;
      reject(new Error('Audio playback failed'));
    };
    audio.play().catch(reject);
  });
}

export const speechService = {
  async speak(text, options = {}) {
    const role = options.role || null;
    const model = options.model || (role ? voiceModelForRole(role) : undefined);
    const browserOpts = role
      ? { lang: options.lang || 'en-US', ...browserVoiceOptsForRole(role) }
      : { lang: options.lang || 'en-US' };

    const adapter = speechAdapter();
    try {
      const result = await adapter.synthesize(text, { ...options, model });
      if (result?.useBrowserTts || !result?.audioBase64) {
        return browserTtsAdapter.synthesize(text, browserOpts);
      }
      return playBase64Audio(result.audioBase64, result.mimeType);
    } catch {
      return browserTtsAdapter.synthesize(text, browserOpts);
    }
  },

  async transcribe(blob, options = {}) {
    return speechAdapter().transcribe(blob, options);
  },

  async assessPronunciation(targetText, audioBlob, options = {}) {
    const transcript = await speechAdapter().transcribe(audioBlob, {
      ...options,
      targetHint: targetText
    });
    const result = scorePronunciation(targetText, transcript.text);
    return { transcript, result };
  },

  stop: stopPlayback
};
