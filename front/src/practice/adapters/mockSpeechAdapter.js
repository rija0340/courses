import { createTranscript } from '../contracts';

/** Deterministic fake STT/TTS for offline UI work. */
export const mockSpeechAdapter = {
  async transcribe(_blob, { targetHint } = {}) {
    await delay(400);
    const text = targetHint
      ? approximateHeard(targetHint)
      : 'hello i need help';
    return createTranscript({ text, confidence: 0.82, words: [] });
  },

  async synthesize(text) {
    await delay(200);
    // Signal client to fall back to browser TTS
    return { useBrowserTts: true, text };
  }
};

function approximateHeard(target) {
  const words = String(target).split(/\s+/);
  if (words.length <= 2) return target;
  // Drop last word occasionally to simulate imperfect speech
  return words.slice(0, -1).join(' ');
}

function delay(ms) {
  return new Promise((r) => setTimeout(r, ms));
}
