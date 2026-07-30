const { createTranscript } = require('./contracts');
const { mapUpstreamError } = require('./errors');

const DEEPGRAM_BASE = 'https://api.deepgram.com/v1';

function getApiKey() {
  return process.env.DEEPGRAM_API_KEY || '';
}

async function transcribeAudio({ audioBuffer, mimeType = 'audio/webm', language = 'en' }) {
  const key = getApiKey();
  if (!key) {
    return { error: { code: 'MISSING_KEY', message: 'DEEPGRAM_API_KEY not configured', status: 503 } };
  }

  const params = new URLSearchParams({
    model: process.env.DEEPGRAM_STT_MODEL || 'nova-2',
    smart_format: 'true',
    punctuate: 'true',
    language
  });

  const res = await fetch(`${DEEPGRAM_BASE}/listen?${params}`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${key}`,
      'Content-Type': mimeType
    },
    body: audioBuffer
  });

  if (!res.ok) {
    const text = await res.text();
    return { error: mapUpstreamError('deepgram', res.status, text) };
  }

  const data = await res.json();
  const alt = data?.results?.channels?.[0]?.alternatives?.[0];
  const words = (alt?.words || []).map((w) => ({
    word: w.word,
    start: w.start,
    end: w.end,
    confidence: w.confidence
  }));

  return {
    data: createTranscript({
      text: alt?.transcript || '',
      confidence: alt?.confidence ?? null,
      words
    })
  };
}

async function synthesizeSpeech({ text, model }) {
  const key = getApiKey();
  if (!key) {
    return { error: { code: 'MISSING_KEY', message: 'DEEPGRAM_API_KEY not configured', status: 503 } };
  }

  const voice = model || process.env.DEEPGRAM_TTS_MODEL || 'aura-asteria-en';
  const res = await fetch(`${DEEPGRAM_BASE}/speak?model=${encodeURIComponent(voice)}`, {
    method: 'POST',
    headers: {
      Authorization: `Token ${key}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ text })
  });

  if (!res.ok) {
    const errText = await res.text();
    return { error: mapUpstreamError('deepgram', res.status, errText) };
  }

  const arrayBuf = await res.arrayBuffer();
  const audioBase64 = Buffer.from(arrayBuf).toString('base64');
  const contentType = res.headers.get('content-type') || 'audio/mpeg';

  return {
    data: {
      audioBase64,
      mimeType: contentType,
      provider: 'deepgram',
      model: voice
    }
  };
}

module.exports = { transcribeAudio, synthesizeSpeech };
