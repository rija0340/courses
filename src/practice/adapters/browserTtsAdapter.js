/** Browser Web Speech TTS — local fallback with role pitch/voice. */
export const browserTtsAdapter = {
  async synthesize(text, { lang = 'en-US', pitch = 1, rate = 1, prefer = null } = {}) {
    return new Promise((resolve, reject) => {
      if (typeof window === 'undefined' || !window.speechSynthesis) {
        reject(new Error('SpeechSynthesis unavailable'));
        return;
      }
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      utterance.pitch = pitch;
      utterance.rate = rate;

      const voices = window.speechSynthesis.getVoices?.() || [];
      if (prefer && voices.length) {
        const match = voices.find((v) => prefer.test(`${v.name} ${v.lang}`));
        if (match) utterance.voice = match;
      }

      utterance.onend = () => resolve({ provider: 'browser' });
      utterance.onerror = (e) => reject(e.error || new Error('TTS error'));
      window.speechSynthesis.speak(utterance);
    });
  },

  stop() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }
};
