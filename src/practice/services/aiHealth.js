import { AI_GATEWAY_URL, LLM_PROVIDER, SPEECH_PROVIDER } from '../config';

export async function checkAiProvidersHealth() {
  const url = `${AI_GATEWAY_URL}/api/ai/health`;
  try {
    const res = await fetch(url);
    const payload = await res.json();
    if (!res.ok || payload?.ok === false) {
      throw new Error(payload?.error?.message || `HTTP ${res.status}`);
    }
    return {
      ...payload.data,
      client: {
        llmProvider: LLM_PROVIDER,
        speechProvider: SPEECH_PROVIDER,
        gatewayUrl: AI_GATEWAY_URL || '(same-origin)'
      }
    };
  } catch (err) {
    return {
      llm: { service: 'LLM', provider: 'groq', ok: false, configured: LLM_PROVIDER === 'remote', message: err.message },
      stt: { service: 'STT', provider: 'deepgram', ok: false, configured: SPEECH_PROVIDER === 'remote', message: err.message },
      tts: { service: 'TTS', provider: 'deepgram', ok: false, configured: SPEECH_PROVIDER === 'remote', message: err.message },
      ready: false,
      client: {
        llmProvider: LLM_PROVIDER,
        speechProvider: SPEECH_PROVIDER,
        gatewayUrl: AI_GATEWAY_URL || '(same-origin)'
      },
      errors: [err.message]
    };
  }
}
