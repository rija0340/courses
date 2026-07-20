import { aiClient } from '../gateway/aiClient';
import { createTranscript } from '../contracts';

function blobToBase64(blob) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = String(reader.result || '');
      const base64 = result.includes(',') ? result.split(',')[1] : result;
      resolve(base64);
    };
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
}

export const remoteSpeechAdapter = {
  async transcribe(blob, { language = 'en' } = {}) {
    const audioBase64 = await blobToBase64(blob);
    const data = await aiClient.transcribe(audioBase64, {
      mimeType: blob.type || 'audio/webm',
      language
    });
    return createTranscript(data);
  },

  async synthesize(text, { model } = {}) {
    const data = await aiClient.speak(text, { model });
    return {
      audioBase64: data.audioBase64,
      mimeType: data.mimeType || 'audio/mpeg',
      provider: data.provider || 'deepgram'
    };
  }
};
