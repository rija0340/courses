import { AI_GATEWAY_URL } from '../config';

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
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });

  let payload;
  try {
    payload = await res.json();
  } catch {
    throw new AiGatewayError('BAD_RESPONSE', `Invalid JSON from ${path}`);
  }

  if (!res.ok || payload?.ok === false) {
    const err = payload?.error || {};
    throw new AiGatewayError(
      err.code || 'REQUEST_FAILED',
      err.message || `Request failed (${res.status})`,
      err.details || null
    );
  }

  return payload.data;
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
  }
};

export { AiGatewayError };
