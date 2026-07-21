async function checkGroqHealth() {
  const key = process.env.GROQ_API_KEY || '';
  if (!key) {
    return { ok: false, configured: false, message: 'GROQ_API_KEY manquant' };
  }
  try {
    const res = await fetch('https://api.groq.com/openai/v1/models', {
      headers: { Authorization: `Bearer ${key}` }
    });
    return {
      ok: res.ok,
      configured: true,
      message: res.ok ? 'API accessible' : `Erreur HTTP ${res.status}`
    };
  } catch (err) {
    return { ok: false, configured: true, message: err.message || 'Connexion impossible' };
  }
}

async function checkDeepgramHealth() {
  const key = process.env.DEEPGRAM_API_KEY || '';
  if (!key) {
    return { ok: false, configured: false, message: 'DEEPGRAM_API_KEY manquant' };
  }
  try {
    const res = await fetch('https://api.deepgram.com/v1/projects', {
      headers: { Authorization: `Token ${key}` }
    });
    return {
      ok: res.ok,
      configured: true,
      message: res.ok ? 'API accessible' : `Erreur HTTP ${res.status}`
    };
  } catch (err) {
    return { ok: false, configured: true, message: err.message || 'Connexion impossible' };
  }
}

async function getAiHealth() {
  const [llm, deepgram] = await Promise.all([checkGroqHealth(), checkDeepgramHealth()]);
  return {
    llm: { service: 'LLM', provider: 'groq', ...llm },
    stt: { service: 'STT', provider: 'deepgram', ...deepgram },
    tts: { service: 'TTS', provider: 'deepgram', ...deepgram },
    ready: llm.ok && deepgram.ok
  };
}

module.exports = { getAiHealth };
