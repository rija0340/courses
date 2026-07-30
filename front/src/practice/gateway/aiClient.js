import { AI_GATEWAY_URL } from '../config';
import { recordAiSuccess, recordAiFailure } from '../services/aiUsage';

class AiGatewayError extends Error {
  constructor(code, message, details = null) {
    super(message);
    this.name = 'AiGatewayError';
    this.code = code;
    this.details = details;
  }
}

async function postJson(path, body) {
  const url = `${AI_GATEWAY_URL}${path}`;
  try {
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body)
    });

    let payload;
    try {
      payload = await res.json();
    } catch {
      const err = new AiGatewayError('BAD_RESPONSE', `Invalid JSON from ${path}`);
      recordAiFailure(path, err);
      throw err;
    }

    if (!res.ok || payload?.ok === false) {
      const errInfo = payload?.error || {};
      const err = new AiGatewayError(
        errInfo.code || 'REQUEST_FAILED',
        errInfo.message || `Request failed (${res.status})`,
        errInfo.details || null
      );
      recordAiFailure(path, err);
      throw err;
    }

    recordAiSuccess(path, payload.usage || payload.data?.meta?.usage || null);
    return payload.data;
  } catch (err) {
    if (err instanceof AiGatewayError) throw err;
    recordAiFailure(path, err);
    throw err;
  }
}

export const aiClient = {
  transcribe(audioBase64, { mimeType = 'audio/webm', language = 'en' } = {}) {
    return postJson('/api/speech/transcribe', { audioBase64, mimeType, language });
  },

  speak(text, { model } = {}) {
    return postJson('/api/speech/speak', { text, model });
  },

  generateSimulation(input) {
    return postJson('/api/llm/generate', input);
  },

  generateWrittenTurn(input) {
    return postJson('/api/llm/written-turn', input);
  },

  generateQuizFeedback(input) {
    return postJson('/api/llm/quiz-feedback', input);
  }
};

export { AiGatewayError };
